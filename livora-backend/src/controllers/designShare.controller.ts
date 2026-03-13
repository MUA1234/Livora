import { Request, Response } from "express";
import crypto from "crypto";
import Design from "../models/design.model";
import Room from "../models/room.model";
import { Product } from "../models/Product.model";

const generateShareToken = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const generateShareLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { expiresInDays } = req.body;

    const design = await Design.findOne({ _id: id, deletedAt: null });
    if (!design) {
      res.status(404).json({ message: "Design not found" });
      return;
    }

    const token = generateShareToken();
    const now = new Date();
    let expires: Date | null = null;

    if (expiresInDays && expiresInDays > 0) {
      expires = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    }

    design.shareToken = token;
    design.sharedAt = now;
    design.shareExpires = expires;
    await design.save();

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/preview/${token}`;

    res.status(200).json({
      shareToken: token,
      shareUrl,
      sharedAt: now,
      shareExpires: expires,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error generating share link", error: error.message });
  }
};

export const revokeShareLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const design = await Design.findOne({ _id: id, deletedAt: null });
    if (!design) {
      res.status(404).json({ message: "Design not found" });
      return;
    }

    design.shareToken = null;
    design.sharedAt = null;
    design.shareExpires = null;
    await design.save();

    res.status(200).json({ message: "Share link revoked" });
  } catch (error: any) {
    res.status(500).json({ message: "Error revoking share link", error: error.message });
  }
};

export const getPublicPreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const design = await Design.findOne({ shareToken: token, deletedAt: null }).populate("roomId");
    if (!design) {
      res.status(404).json({ message: "Preview not found or link is invalid" });
      return;
    }

    if (design.shareExpires && new Date() > design.shareExpires) {
      res.status(410).json({ message: "This preview link has expired" });
      return;
    }

    const furnitureItems = extractFurnitureFromLayout(design.layoutData);
    const productIds = furnitureItems.map((f: any) => f.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select("name sku category price images colors materials width height depth description");

    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const furnitureWithDetails = furnitureItems.map((item: any) => {
      const product = productMap.get(item.productId?.toString());
      return {
        ...item,
        product: product || null,
      };
    });

    res.status(200).json({
      designName: design.name,
      status: design.status,
      room: design.roomId,
      furniture: furnitureWithDetails,
      sharedAt: design.sharedAt,
      shareExpires: design.shareExpires,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error loading preview", error: error.message });
  }
};

const extractFurnitureFromLayout = (layoutData: any): any[] => {
  if (!layoutData || typeof layoutData !== "object") return [];
  if (Array.isArray(layoutData.furniture)) return layoutData.furniture;
  if (Array.isArray(layoutData.items)) return layoutData.items;
  return [];
};
