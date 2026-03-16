import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    userId: mongoose.Types.ObjectId;
    userName: string;
    action: string;
    targetModel: string;
    targetId?: string;
    targetName?: string;
    changes?: {
        before?: any;
        after?: any;
        summary?: string;
    };
    ipAddress?: string;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        action: { type: String, required: true },
        targetModel: { type: String, required: true },
        targetId: { type: String },
        targetName: { type: String },
        changes: {
            before: { type: Schema.Types.Mixed },
            after: { type: Schema.Types.Mixed },
            summary: { type: String },
        },
        ipAddress: { type: String },
    },
    { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ targetModel: 1, targetId: 1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
