import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.dashboard.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";

const router = Router();

// Protect all routes with admin auth middleware
router.use(authMiddleware, adminOnly);

// GET /api/admin/dashboard
router.get("/", getDashboardStats);

export default router;
