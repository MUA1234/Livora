import { Request, Response } from "express";
import { WishlistItem } from "../models/WishlistItem.model";
import { Product } from "../models/Product.model";
import mongoose from "mongoose";

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const items = await WishlistItem.find({ userId })
            .populate("productId", "name price sku category images colors materials description")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ success: false, message: "Valid product ID is required" });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const existing = await WishlistItem.findOne({ userId, productId });
        if (existing) {
            res.status(400).json({ success: false, message: "Product already in wishlist" });
            return;
        }

        const item = new WishlistItem({ userId, productId });
        await item.save();

        const populated = await WishlistItem.findById(item._id)
            .populate("productId", "name price sku category images colors materials description");

        res.status(201).json({ success: true, message: "Added to wishlist", data: populated });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        const item = await WishlistItem.findOneAndDelete({ userId, productId });
        if (!item) {
            res.status(404).json({ success: false, message: "Item not found in wishlist" });
            return;
        }

        res.json({ success: true, message: "Removed from wishlist" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        const item = await WishlistItem.findOne({ userId, productId });
        res.json({ success: true, data: { inWishlist: !!item } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
