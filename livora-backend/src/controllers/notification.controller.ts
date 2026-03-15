import { Request, Response } from "express";
import { Notification } from "../models/Notification.model";

// GET /api/notifications - Get current user's notifications
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const { page = "1", limit = "20", unreadOnly } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: any = { recipientId: userId };
        if (unreadOnly === "true") {
            query.read = false;
        }

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
            Notification.countDocuments(query),
            Notification.countDocuments({ recipientId: userId, read: false }),
        ]);

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
                pagination: {
                    page: pageNumber,
                    pages: Math.ceil(total / limitNumber),
                    total,
                },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/notifications/unread-count - Quick count for badge
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const count = await Notification.countDocuments({ recipientId: userId, read: false });
        res.json({ success: true, count });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/notifications/:id/read - Mark single notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: userId },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }

        res.json({ success: true, data: notification });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/notifications/mark-all-read - Mark all as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        await Notification.updateMany(
            { recipientId: userId, read: false },
            { $set: { read: true } }
        );

        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/notifications/:id - Delete a notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipientId: userId,
        });

        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }

        res.json({ success: true, message: "Notification deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/notifications/clear-all - Delete all read notifications
export const clearAllRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        await Notification.deleteMany({ recipientId: userId, read: true });
        res.json({ success: true, message: "All read notifications cleared" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
