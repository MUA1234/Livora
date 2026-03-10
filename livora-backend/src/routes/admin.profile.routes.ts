import { Router } from "express";
import { 
  getAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword, 
  updateAdminPreferences 
} from "../controllers/admin.profile.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";

const router = Router();

// Protect all routes with admin auth middleware
router.use(authMiddleware, adminOnly);

// GET /api/admin/profile
router.get("/", getAdminProfile);

// PUT /api/admin/profile
router.put("/", updateAdminProfile);

// PUT /api/admin/change-password
router.put("/change-password", changeAdminPassword);

// PUT /api/admin/preferences
router.put("/preferences", updateAdminPreferences);

export default router;
