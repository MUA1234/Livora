import { Request, Response } from "express";
import { Review } from "../models/Review.model";
import { Product } from "../models/Product.model";
import mongoose from "mongoose";

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const { page = "1", limit = "10", sort = "recent" } = req.query;

        const pid = productId as string;

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            res.status(400).json({ success: false, message: "Invalid product ID" });
            return;
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        let sortOption: any = { createdAt: -1 };
        if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
        if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };
        if (sort === "helpful") sortOption = { helpfulCount: -1, createdAt: -1 };

        const reviews = await Review.find({ productId: pid })
            .populate("userId", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const total = await Review.countDocuments({ productId: pid });

        const ratingAgg = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(pid) } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 },
                    star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                }
            }
        ]);

        const stats = ratingAgg[0] || { avgRating: 0, count: 0, star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 };

        res.json({
            success: true,
            data: {
                reviews,
                stats: {
                    averageRating: Math.round((stats.avgRating || 0) * 10) / 10,
                    totalReviews: stats.count,
                    distribution: [
                        { stars: 5, count: stats.star5 },
                        { stars: 4, count: stats.star4 },
                        { stars: 3, count: stats.star3 },
                        { stars: 2, count: stats.star2 },
                        { stars: 1, count: stats.star1 },
                    ]
                },
                pagination: {
                    page: pageNumber,
                    pages: Math.ceil(total / limitNumber),
                    total
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = "1", limit = "10", sort = "recent", rating } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: any = {};
        if (rating) query.rating = parseInt(rating as string, 10);

        let sortOption: any = { createdAt: -1 };
        if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
        if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };

        const reviews = await Review.find(query)
            .populate("userId", "name email")
            .populate("productId", "name price sku images")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const total = await Review.countDocuments(query);

        const ratingAgg = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 },
                    star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                }
            }
        ]);

        const stats = ratingAgg[0] || { avgRating: 0, count: 0, star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 };

        res.json({
            success: true,
            data: {
                reviews,
                stats: {
                    averageRating: Math.round((stats.avgRating || 0) * 10) / 10,
                    totalReviews: stats.count,
                    distribution: [
                        { stars: 5, count: stats.star5 },
                        { stars: 4, count: stats.star4 },
                        { stars: 3, count: stats.star3 },
                        { stars: 2, count: stats.star2 },
                        { stars: 1, count: stats.star1 },
                    ]
                },
                pagination: {
                    page: pageNumber,
                    pages: Math.ceil(total / limitNumber),
                    total
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId, rating, title, body } = req.body;
        const userId = req.user?.id;

        if (!productId || !rating) {
            res.status(400).json({ success: false, message: "Product ID and rating are required" });
            return;
        }

        if (rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
            return;
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const existing = await Review.findOne({ userId, productId });
        if (existing) {
            res.status(400).json({ success: false, message: "You have already reviewed this product" });
            return;
        }

        const review = new Review({ userId, productId, rating, title, body });
        await review.save();

        const populated = await Review.findById(review._id).populate("userId", "name email");

        res.status(201).json({ success: true, message: "Review submitted successfully", data: populated });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markHelpful = async (req: Request, res: Response): Promise<void> => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpfulCount: 1 } },
            { new: true }
        );

        if (!review) {
            res.status(404).json({ success: false, message: "Review not found" });
            return;
        }

        res.json({ success: true, data: review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
