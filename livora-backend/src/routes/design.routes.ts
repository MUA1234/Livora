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
import { getCostSummary, getCostReportPdf } from "../controllers/designCost.controller";
import { getDesignsComparison } from "../controllers/designCompare.controller";
import { generateShareLink, revokeShareLink } from "../controllers/designShare.controller";

const router = Router();

// GET /api/designs/compare
// NOTE: This must come before /:id so that 'compare' is not treated as an ID
router.get("/compare", getDesignsComparison);

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

// GET /api/designs/:id/cost-summary
router.get("/:id/cost-summary", getCostSummary);

// GET /api/designs/:id/cost-report/pdf
router.get("/:id/cost-report/pdf", getCostReportPdf);

// POST /api/designs/:id/share - Generate share link
router.post("/:id/share", generateShareLink);

// DELETE /api/designs/:id/share - Revoke share link
router.delete("/:id/share", revokeShareLink);

export default router;
