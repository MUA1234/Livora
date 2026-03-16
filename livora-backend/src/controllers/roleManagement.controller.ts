import { Request, Response } from "express";
import { User } from "../models/User.model";
import { logAction } from "./auditLog.controller";

const ALL_PERMISSIONS = [
    "manage_products",
    "manage_orders",
    "manage_consultations",
    "manage_designs",
    "manage_users",
    "manage_promo_codes",
    "view_analytics",
    "manage_inventory",
    "manage_settings",
    "manage_templates",
];

const ROLE_DEFAULTS: Record<string, string[]> = {
    lead_designer: [...ALL_PERMISSIONS],
    manager: ["manage_orders", "manage_consultations", "manage_users", "view_analytics", "manage_promo_codes", "manage_inventory"],
    designer: ["manage_products", "manage_designs", "manage_consultations", "manage_templates"],
    viewer: ["view_analytics"],
};

// GET /api/admin/roles/users - Get all admin users with roles
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await User.find({ role: "admin" }).select("name email adminRole permissions avatarUrl createdAt");
        res.json({ success: true, data: { users: admins, allPermissions: ALL_PERMISSIONS, roleDefaults: ROLE_DEFAULTS } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/roles/users/:id - Update admin role and permissions
export const updateAdminRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { adminRole, permissions } = req.body;
        const targetUser = await User.findById(req.params.id);
        if (!targetUser || targetUser.role !== "admin") {
            res.status(404).json({ success: false, message: "Admin user not found" });
            return;
        }

        const oldRole = targetUser.adminRole;
        const oldPerms = targetUser.permissions;

        if (adminRole) targetUser.adminRole = adminRole;
        if (permissions) targetUser.permissions = permissions;
        else if (adminRole && ROLE_DEFAULTS[adminRole]) {
            targetUser.permissions = ROLE_DEFAULTS[adminRole];
        }

        await targetUser.save();

        // Log the change
        await logAction({
            userId: req.user?.id,
            userName: req.user?.name || "Admin",
            action: "update_role",
            targetModel: "User",
            targetId: targetUser._id?.toString(),
            targetName: targetUser.name,
            changes: {
                before: { adminRole: oldRole, permissions: oldPerms },
                after: { adminRole: targetUser.adminRole, permissions: targetUser.permissions },
                summary: `Changed role from ${oldRole || "none"} to ${targetUser.adminRole}`,
            },
        });

        res.json({ success: true, data: targetUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/admin/roles/permissions - Get all available permissions
export const getPermissions = async (_req: Request, res: Response): Promise<void> => {
    res.json({ success: true, data: { permissions: ALL_PERMISSIONS, roleDefaults: ROLE_DEFAULTS } });
};
