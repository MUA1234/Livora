import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/mark-all-read", markAllAsRead);
router.delete("/clear-all-read", clearAllRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
