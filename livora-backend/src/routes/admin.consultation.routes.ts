import { Router } from "express";
import { 
  getAdminConsultations, 
  getAdminConsultationById, 
  updateAdminConsultationStatus, 
  respondToConsultation 
} from "../controllers/admin.consultation.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";

const router = Router();

// Protect all routes with admin auth middleware
router.use(authMiddleware, adminOnly);

// GET /api/admin/consultations
router.get("/", getAdminConsultations);

// GET /api/admin/consultations/:id
router.get("/:id", getAdminConsultationById);

// PUT /api/admin/consultations/:id/status
router.put("/:id/status", updateAdminConsultationStatus);

// POST /api/admin/consultations/:id/respond
router.post("/:id/respond", respondToConsultation);

export default router;
