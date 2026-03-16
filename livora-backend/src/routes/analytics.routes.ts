import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import {
    getAnalyticsOverview,
    getRevenueChart,
    getPopularProducts,
    getUserGrowthChart,
    getCategoryBreakdown,
} from "../controllers/analytics.controller";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/overview", getAnalyticsOverview);
router.get("/revenue-chart", getRevenueChart);
router.get("/popular-products", getPopularProducts);
router.get("/user-growth", getUserGrowthChart);
router.get("/category-breakdown", getCategoryBreakdown);

export default router;
