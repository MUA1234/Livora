import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    { timestamps: true }
);

// Ensure a user can only add a product to their wishlist once
WishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const WishlistItem = mongoose.model<IWishlistItem>(
    "WishlistItem",
    WishlistItemSchema
);
