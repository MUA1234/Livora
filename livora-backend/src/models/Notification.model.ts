import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
    | "consultation_request"
    | "consultation_status_update"
    | "consultation_response"
    | "new_review"
    | "design_shared"
    | "new_user_registered"
    | "order_placed"
    | "general";

export interface INotification extends Document {
    recipientId: mongoose.Types.ObjectId;
    recipientRole: "admin" | "user";
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
    relatedModel?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        recipientRole: { type: String, enum: ["admin", "user"], required: true },
        type: {
            type: String,
            enum: [
                "consultation_request",
                "consultation_status_update",
                "consultation_response",
                "new_review",
                "design_shared",
                "new_user_registered",
                "order_placed",
                "general",
            ],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        relatedId: { type: String },
        relatedModel: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
