import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import { getAuditLogs, getLogsForTarget } from "../controllers/auditLog.controller";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/", getAuditLogs);
router.get("/target/:model/:id", getLogsForTarget);

export default router;
