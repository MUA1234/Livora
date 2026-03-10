import { Request, Response } from "express";
import Design from "../models/design.model";
import { Product } from "../models/Product.model";
import Consultation from "../models/consultation.model";
import { User } from "../models/User.model";

// GET /api/admin/dashboard
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalDesigns, totalProducts, pendingConsultations, totalClients, recentDesigns] = await Promise.all([
      Design.countDocuments({ deletedAt: null }),
      Product.countDocuments(), // Assuming all are active; add filtering if there's an active/inactive flag
      Consultation.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "user" }),
      Design.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("id name status createdAt") // Exclude heavy layoutData; wait for 'thumbnail' implementation if missing
    ]);

    res.status(200).json({
      totalDesigns,
      totalProducts,
      pendingConsultations,
      totalClients,
      recentDesigns: recentDesigns.map(design => ({
        id: design._id,
        name: design.name,
        status: design.status,
        createdAt: design.createdAt,
        thumbnail: "placeholder_thumbnail_url" // Add actual thumbnail logic if applicable
      }))
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};
