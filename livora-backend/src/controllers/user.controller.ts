import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const resetTokens = new Map<string, { userId: string; expires: Date }>();

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            res.status(200).json({
                success: true,
                message: "If an account with that email exists, a reset link has been sent",
            });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        resetTokens.set(token, {
            userId: user._id.toString(),
            expires: new Date(Date.now() + 3600000),
        });

        res.status(200).json({
            success: true,
            message: "If an account with that email exists, a reset link has been sent",
            resetToken: token,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({ success: false, message: "Token and password are required" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            return;
        }

        const resetData = resetTokens.get(token);

        if (!resetData || resetData.expires < new Date()) {
            resetTokens.delete(token);
            res.status(400).json({ success: false, message: "Invalid or expired reset token" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(resetData.userId, { passwordHash });
        resetTokens.delete(token);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const user = await User.findById(req.user.id).select("-passwordHash");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const { name, email, phone } = req.body;
        const updateData: any = {};

        if (name) updateData.name = name.trim();
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ success: false, message: "Invalid email format" });
                return;
            }
            const existing = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: req.user.id } });
            if (existing) {
                res.status(400).json({ success: false, message: "Email already in use" });
                return;
            }
            updateData.email = email.trim().toLowerCase();
        }
        if (phone !== undefined) updateData.phone = phone.trim();

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-passwordHash");

        res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changeUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: "Current and new passwords are required" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Current password is incorrect" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
