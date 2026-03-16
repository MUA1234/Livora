import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import { getAdminUsers, updateAdminRole, getPermissions } from "../controllers/roleManagement.controller";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminRole);
router.get("/permissions", getPermissions);

export default router;
