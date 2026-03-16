import mongoose, { Schema, Document } from "mongoose";

export interface IMoodBoardItem {
    type: "image" | "color" | "text" | "product";
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    meta?: any;
}

export interface IMoodBoard extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    items: IMoodBoardItem[];
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor: string;
    createdAt: Date;
    updatedAt: Date;
}

const MoodBoardItemSchema = new Schema<IMoodBoardItem>(
    {
        type: { type: String, enum: ["image", "color", "text", "product"], required: true },
        content: { type: String, required: true },
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        width: { type: Number, default: 200 },
        height: { type: Number, default: 200 },
        rotation: { type: Number, default: 0 },
        zIndex: { type: Number, default: 0 },
        meta: { type: Schema.Types.Mixed },
    },
    { _id: true }
);

const MoodBoardSchema = new Schema<IMoodBoard>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String },
        items: { type: [MoodBoardItemSchema], default: [] },
        canvasWidth: { type: Number, default: 1200 },
        canvasHeight: { type: Number, default: 800 },
        backgroundColor: { type: String, default: "#FFFFFF" },
    },
    { timestamps: true }
);

MoodBoardSchema.index({ userId: 1, createdAt: -1 });

export const MoodBoard = mongoose.model<IMoodBoard>("MoodBoard", MoodBoardSchema);
