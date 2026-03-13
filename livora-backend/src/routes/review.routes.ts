import express from "express";
import {
    getProductReviews,
    getAllReviews,
    createReview,
    markHelpful
} from "../controllers/review.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getAllReviews);
router.post("/", authMiddleware, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id/helpful", markHelpful);

export default router;
