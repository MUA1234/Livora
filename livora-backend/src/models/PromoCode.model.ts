import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount: number;
    maxUses: number;
    currentUses: number;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true, min: 0 },
        minOrderAmount: { type: Number, default: 0 },
        maxUses: { type: Number, default: 0 },
        currentUses: { type: Number, default: 0 },
        expiresAt: { type: Date },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const PromoCode = mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);
