import { Router } from "express";
import { 
  createDesign, 
  getDesigns, 
  getDesignById, 
  updateDesign, 
  deleteDesign 
} from "../controllers/design.controller";
import { 
  validateCreateDesign, 
  validateDesignInput 
} from "../middleware/design.validation";
import designVersionRoutes from "./designVersion.routes";

const router = Router();

// POST /api/designs
router.post("/", validateCreateDesign, createDesign);

// GET /api/designs
router.get("/", getDesigns);

// GET /api/designs/:id
router.get("/:id", getDesignById);

// PUT /api/designs/:id
router.put("/:id", validateDesignInput, updateDesign);

// DELETE /api/designs/:id
// E.g., DELETE /api/designs/123 or DELETE /api/designs/123?hard=true
router.delete("/:id", deleteDesign);

// Mount version routes
router.use("/:id/versions", designVersionRoutes);

export default router;
