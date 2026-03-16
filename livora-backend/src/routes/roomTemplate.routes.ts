import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import {
    getRoomTemplates,
    getRoomTemplateById,
    createRoomTemplate,
    updateRoomTemplate,
    deleteRoomTemplate,
} from "../controllers/roomTemplate.controller";

const router = express.Router();

router.get("/", getRoomTemplates);
router.get("/:id", getRoomTemplateById);
router.post("/", authMiddleware, adminOnly, createRoomTemplate);
router.put("/:id", authMiddleware, adminOnly, updateRoomTemplate);
router.delete("/:id", authMiddleware, adminOnly, deleteRoomTemplate);

export default router;
