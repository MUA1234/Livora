import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getProductRecommendations, getPersonalizedRecommendations } from "../controllers/recommendations.controller";

const router = express.Router();

router.get("/product/:productId", getProductRecommendations);
router.get("/personalized", authMiddleware, getPersonalizedRecommendations);

export default router;
