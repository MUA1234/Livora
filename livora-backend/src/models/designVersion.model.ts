import mongoose, { Schema, Document } from "mongoose";

export interface IDesignVersion extends Document {
  designId: mongoose.Types.ObjectId;
  label: string;
  layoutData: any; // Snapshot of the layout
  createdAt: Date;
}

const DesignVersionSchema: Schema = new Schema(
  {
    designId: { type: Schema.Types.ObjectId, ref: "Design", required: true },
    label: { type: String, default: "Auto-save" },
    layoutData: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IDesignVersion>("DesignVersion", DesignVersionSchema);
