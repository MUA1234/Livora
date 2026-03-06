import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role: "admin" | "user";
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        phone: { type: String },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        avatarUrl: { type: String },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
