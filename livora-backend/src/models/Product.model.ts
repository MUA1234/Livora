import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    sku: string;
    category: string;
    price: number;
    description?: string;
    width?: number;
    height?: number;
    depth?: number;
    colors: string[];
    materials: string[];
    images: { imageUrl: string; sortOrder: number }[];
    stock: number;
    lowStockThreshold: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        width: { type: Number },
        height: { type: Number },
        depth: { type: Number },
        colors: [{ type: String }],
        materials: [{ type: String }],
        images: [
            {
                imageUrl: { type: String, required: true },
                sortOrder: { type: Number, default: 0 },
            },
        ],
        stock: { type: Number, default: 100 },
        lowStockThreshold: { type: Number, default: 10 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
