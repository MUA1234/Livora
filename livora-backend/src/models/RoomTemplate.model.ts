import mongoose, { Schema, Document } from "mongoose";

export interface IRoomTemplate extends Document {
    name: string;
    description: string;
    style: "minimalist" | "modern" | "classic" | "scandinavian" | "industrial" | "bohemian";
    roomType: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    layoutData: any;
    furniture: { productId: string; position: { x: number; y: number }; rotation: number }[];
    thumbnailUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RoomTemplateSchema = new Schema<IRoomTemplate>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        style: {
            type: String,
            enum: ["minimalist", "modern", "classic", "scandinavian", "industrial", "bohemian"],
            required: true,
        },
        roomType: { type: String, required: true },
        dimensions: {
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            height: { type: Number, required: true },
            unit: { type: String, default: "m" },
        },
        layoutData: { type: Schema.Types.Mixed, default: {} },
        furniture: [
            {
                productId: { type: String },
                position: { x: { type: Number }, y: { type: Number } },
                rotation: { type: Number, default: 0 },
            },
        ],
        thumbnailUrl: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const RoomTemplate = mongoose.model<IRoomTemplate>("RoomTemplate", RoomTemplateSchema);
