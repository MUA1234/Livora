import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import {
    getAllPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    validatePromoCode,
} from "../controllers/promoCode.controller";

const router = express.Router();

// Public validation endpoint (still needs auth for user context)
router.post("/validate", authMiddleware, validatePromoCode);

// Admin routes
router.get("/", authMiddleware, adminOnly, getAllPromoCodes);
router.post("/", authMiddleware, adminOnly, createPromoCode);
router.put("/:id", authMiddleware, adminOnly, updatePromoCode);
router.delete("/:id", authMiddleware, adminOnly, deletePromoCode);

export default router;
