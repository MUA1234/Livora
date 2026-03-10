import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  sender: "user" | "admin" | "system";
  message: string;
  timestamp: Date;
}

export interface IConsultation extends Document {
  userId: mongoose.Types.ObjectId;
  designId?: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "completed";
  messageThread: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: String, enum: ["user", "admin", "system"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConsultationSchema = new Schema<IConsultation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designId: { type: Schema.Types.ObjectId, ref: "Design" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    messageThread: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IConsultation>("Consultation", ConsultationSchema);
