import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    rating: number;
    title?: string;
    body?: string;
    helpfulCount: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String },
        body: { type: String },
        helpfulCount: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// A user can leave only 1 review per product
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
