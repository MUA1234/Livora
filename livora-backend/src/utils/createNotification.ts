import { Notification, NotificationType } from "../models/Notification.model";
import { User } from "../models/User.model";

interface CreateNotificationParams {
    recipientId: string;
    recipientRole: "admin" | "user";
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
    relatedModel?: string;
}

export async function createNotification(params: CreateNotificationParams) {
    try {
        return await Notification.create(params);
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}

export async function notifyAllAdmins(
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    relatedModel?: string
) {
    try {
        const admins = await User.find({ role: "admin" }).select("_id");
        const notifications = admins.map((admin) => ({
            recipientId: admin._id,
            recipientRole: "admin" as const,
            type,
            title,
            message,
            relatedId,
            relatedModel,
        }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error("Failed to notify admins:", error);
    }
}
