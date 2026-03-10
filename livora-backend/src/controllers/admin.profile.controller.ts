import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model";

// GET /api/admin/profile - return current admin's details
export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id; // Accommodate different JWT payloads

    if (!userId) {
      res.status(401).json({ message: "Unauthorized. User context missing." });
      return;
    }

    const admin = await User.findById(userId).select("-passwordHash");
    if (!admin) {
      res.status(404).json({ message: "Admin profile not found" });
      return;
    }

    res.status(200).json(admin);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching admin profile", error: error.message });
  }
};

// PUT /api/admin/profile - update name, email, avatar
export const updateAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, email, avatarUrl } = req.body;
    
    // Build update object securely
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl; // Assuming file upload handled elsewhere yielding a URL string

    const updatedAdmin = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedAdmin) {
      res.status(404).json({ message: "Admin profile not found" });
      return;
    }

    res.status(200).json(updatedAdmin);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating admin profile", error: error.message });
  }
};

// PUT /api/admin/change-password - validate and change password
export const changeAdminPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Both currentPassword and newPassword are required" });
      return;
    }

    const admin = await User.findById(userId);
    if (!admin) {
      res.status(404).json({ message: "Admin profile not found" });
      return;
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid current password" });
      return;
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = newPasswordHash;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};

// PUT /api/admin/preferences - save notification and accessibility settings
export const updateAdminPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { emailAlerts, pushAlerts, theme, fontSize } = req.body;

    const admin = await User.findById(userId);
    if (!admin) {
      res.status(404).json({ message: "Admin profile not found" });
      return;
    }

    // Initialize preferences if missing
    if (!admin.preferences) {
      admin.preferences = {};
    }

    // Update defined fields only
    if (emailAlerts !== undefined) admin.preferences.emailAlerts = emailAlerts;
    if (pushAlerts !== undefined) admin.preferences.pushAlerts = pushAlerts;
    if (theme !== undefined) admin.preferences.theme = theme;
    if (fontSize !== undefined) admin.preferences.fontSize = fontSize;

    await admin.save();

    // Re-fetch to return formatted payload without password
    const updatedAdmin = await User.findById(userId).select("-passwordHash");
    res.status(200).json(updatedAdmin?.preferences);

  } catch (error: any) {
    res.status(500).json({ message: "Error updating preferences", error: error.message });
  }
};
