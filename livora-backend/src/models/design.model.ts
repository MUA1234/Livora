import mongoose, { Schema, Document } from "mongoose";

export interface IDesign extends Document {
  name: string;
  roomId: mongoose.Types.ObjectId;
  layoutData: any;
  status: "draft" | "published" | "archived";
  shareToken?: string | null;
  sharedAt?: Date | null;
  shareExpires?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    layoutData: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    shareToken: { type: String, default: null, index: true },
    sharedAt: { type: Date, default: null },
    shareExpires: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IDesign>("Design", DesignSchema);
