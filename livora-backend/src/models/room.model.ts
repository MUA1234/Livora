import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "m" | "inch" | "ft";
  };
  shape: string;
  walls: Array<{
    id: string;
    width: number;
    height: number;
    color?: string;
  }>;
  flooring: {
    type: string;
    material?: string;
  };
}

const RoomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      unit: { type: String, enum: ["cm", "m", "inch", "ft"], default: "m" },
    },
    shape: { type: String, required: true, default: "rectangular" },
    walls: [
      {
        id: { type: String },
        width: { type: Number },
        height: { type: Number },
        color: { type: String },
      },
    ],
    flooring: {
      type: { type: String },
      material: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
