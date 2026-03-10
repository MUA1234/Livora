import { Router } from "express";
import { 
  getDesignVersions, 
  createDesignVersion, 
  restoreDesignVersion, 
  compareDesignVersions 
} from "../controllers/designVersion.controller";

const router = Router({ mergeParams: true }); // Allows access to :id from parent router

// GET /api/designs/:id/versions
router.get("/", getDesignVersions);

// POST /api/designs/:id/versions
router.post("/", createDesignVersion);

// POST /api/designs/:id/versions/:versionId/restore
router.post("/:versionId/restore", restoreDesignVersion);

// GET /api/designs/:id/versions/:v1/compare/:v2
router.get("/:v1/compare/:v2", compareDesignVersions);

export default router;
