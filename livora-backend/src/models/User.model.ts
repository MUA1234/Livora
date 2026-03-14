import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role: "admin" | "user";
    avatarUrl?: string;
    googleId?: string;
    authProvider: "local" | "google";
    preferences?: {
        emailAlerts?: boolean;
        pushAlerts?: boolean;
        theme?: string;
        fontSize?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, default: "" },
        phone: { type: String },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        avatarUrl: { type: String },
        googleId: { type: String, sparse: true },
        authProvider: { type: String, enum: ["local", "google"], default: "local" },
        preferences: {
            emailAlerts: { type: Boolean, default: true },
            pushAlerts: { type: Boolean, default: true },
            theme: { type: String, default: "light" },
            fontSize: { type: String, default: "medium" },
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
