import mongoose, { Schema, Document } from "mongoose";

export interface IConsultationRequest extends Document {
    userId?: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    roomType: string;
    roomSize: string;
    preferredDate?: Date;
    notes?: string;
    status: "pending" | "confirmed" | "completed" | "rejected";
    adminResponse?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ConsultationRequestSchema = new Schema<IConsultationRequest>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        roomType: { type: String, required: true },
        roomSize: { type: String, required: true },
        preferredDate: { type: Date },
        notes: { type: String },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "rejected"],
            default: "pending",
        },
        adminResponse: { type: String },
    },
    { timestamps: true }
);

export const ConsultationRequest = mongoose.model<IConsultationRequest>(
    "ConsultationRequest",
    ConsultationRequestSchema
);
