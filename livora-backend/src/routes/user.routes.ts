import express from "express";
import {
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/change-password", authMiddleware, changeUserPassword);

export default router;
