import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product.model";
import { WishlistItem } from "../models/WishlistItem.model";
import { Order } from "../models/Order.model";

// GET /api/recommendations/:productId - "You may also like"
export const getProductRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) { res.status(404).json({ success: false, message: "Product not found" }); return; }

        const productObjId = new mongoose.Types.ObjectId(productId as string);

        // Find products in same category, similar price range
        const minPrice = product.price * 0.5;
        const maxPrice = product.price * 2;

        const recommendations = await Product.find({
            _id: { $ne: productObjId } as any,
            category: product.category,
            price: { $gte: minPrice, $lte: maxPrice },
            isActive: true,
            stock: { $gt: 0 },
        })
            .limit(6)
            .select("name price category images colors materials");

        // If not enough in same category, fill with other categories using same materials
        if (recommendations.length < 6) {
            const materialMatches = await Product.find({
                _id: { $ne: productObjId, $nin: recommendations.map((r) => r._id) } as any,
                materials: { $in: product.materials },
                isActive: true,
                stock: { $gt: 0 },
            })
                .limit(6 - recommendations.length)
                .select("name price category images colors materials");
            recommendations.push(...materialMatches);
        }

        res.json({ success: true, data: recommendations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/recommendations/personalized - Based on user's wishlist/orders
export const getPersonalizedRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { res.status(401).json({ success: false, message: "Not authenticated" }); return; }

        // Get user's wishlist and order history categories
        const [wishlistItems, orders] = await Promise.all([
            WishlistItem.find({ userId }).populate("productId", "category materials"),
            Order.find({ userId }).select("items"),
        ]);

        const categories = new Set<string>();
        const materials = new Set<string>();
        const ownedIds = new Set<string>();

        wishlistItems.forEach((item: any) => {
            if (item.productId) {
                categories.add(item.productId.category);
                item.productId.materials?.forEach((m: string) => materials.add(m));
                ownedIds.add(item.productId._id.toString());
            }
        });

        orders.forEach((order) => {
            order.items.forEach((item) => {
                ownedIds.add(item.productId.toString());
            });
        });

        const query: any = {
            _id: { $nin: Array.from(ownedIds) },
            isActive: true,
            stock: { $gt: 0 },
        };

        if (categories.size > 0) {
            query.$or = [
                { category: { $in: Array.from(categories) } },
                { materials: { $in: Array.from(materials) } },
            ];
        }

        const recommendations = await Product.find(query)
            .limit(8)
            .select("name price category images colors materials");

        res.json({ success: true, data: recommendations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
