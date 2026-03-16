import { Request, Response } from "express";
import { Order } from "../models/Order.model";
import { Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { Review } from "../models/Review.model";
import { ConsultationRequest } from "../models/ConsultationRequest.model";
import Consultation from "../models/consultation.model";

// GET /api/analytics/overview
export const getAnalyticsOverview = async (req: Request, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Revenue
        const [revenueThisMonth, revenuePrevMonth] = await Promise.all([
            Order.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: { $in: ["paid", "pending"] }, orderStatus: { $ne: "cancelled" } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, paymentStatus: { $in: ["paid", "pending"] }, orderStatus: { $ne: "cancelled" } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
            ]),
        ]);

        const revenue = revenueThisMonth[0]?.total || 0;
        const prevRevenue = revenuePrevMonth[0]?.total || 0;
        const revenueGrowth = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0;

        // Users
        const [totalUsers, newUsersThisMonth, newUsersPrevMonth] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "user", createdAt: { $gte: thirtyDaysAgo } }),
            User.countDocuments({ role: "user", createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
        ]);
        const userGrowth = newUsersPrevMonth > 0 ? Math.round(((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100) : 0;

        // Orders
        const totalOrders = revenueThisMonth[0]?.count || 0;
        const prevOrders = revenuePrevMonth[0]?.count || 0;

        // Consultations
        const [totalConsultations, completedConsultations] = await Promise.all([
            ConsultationRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            ConsultationRequest.countDocuments({ status: "completed", createdAt: { $gte: thirtyDaysAgo } }),
        ]);
        const conversionRate = totalConsultations > 0 ? Math.round((completedConsultations / totalConsultations) * 100) : 0;

        // Products
        const [totalProducts, lowStockProducts] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } }),
        ]);

        res.json({
            success: true,
            data: {
                revenue: { amount: revenue, growth: revenueGrowth, orders: totalOrders },
                users: { total: totalUsers, newThisMonth: newUsersThisMonth, growth: userGrowth },
                orders: { thisMonth: totalOrders, prevMonth: prevOrders },
                consultations: { total: totalConsultations, completed: completedConsultations, conversionRate },
                products: { total: totalProducts, lowStock: lowStockProducts },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/analytics/revenue-chart - Revenue over time
export const getRevenueChart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { days = "30" } = req.query;
        const numDays = parseInt(days as string, 10);
        const startDate = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000);

        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/analytics/popular-products
export const getPopularProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Order.aggregate([
            { $match: { orderStatus: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    name: { $first: "$items.name" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: "$items.subtotal" },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
        ]);

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/analytics/user-growth
export const getUserGrowthChart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { days = "90" } = req.query;
        const numDays = parseInt(days as string, 10);
        const startDate = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000);

        const data = await User.aggregate([
            { $match: { role: "user", createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/analytics/category-breakdown
export const getCategoryBreakdown = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Order.aggregate([
            { $match: { orderStatus: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$product.category",
                    revenue: { $sum: "$items.subtotal" },
                    quantity: { $sum: "$items.quantity" },
                },
            },
            { $sort: { revenue: -1 } },
        ]);

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
