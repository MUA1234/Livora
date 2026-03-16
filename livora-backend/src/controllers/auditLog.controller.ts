import { Request, Response } from "express";
import { AuditLog } from "../models/AuditLog.model";

// Utility to create audit log entries from controllers
export const logAction = async (params: {
    userId: string;
    userName: string;
    action: string;
    targetModel: string;
    targetId?: string;
    targetName?: string;
    changes?: { before?: any; after?: any; summary?: string };
    ipAddress?: string;
}) => {
    try {
        await AuditLog.create(params);
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
};

// GET /api/audit-logs
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = "1", limit = "30", action, targetModel, userId } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const query: any = {};
        if (action) query.action = { $regex: action, $options: "i" };
        if (targetModel) query.targetModel = targetModel;
        if (userId) query.userId = userId;

        const [logs, total] = await Promise.all([
            AuditLog.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
            AuditLog.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: {
                logs,
                pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/audit-logs/target/:model/:id - Logs for a specific entity
export const getLogsForTarget = async (req: Request, res: Response): Promise<void> => {
    try {
        const { model, id } = req.params;
        const logs = await AuditLog.find({ targetModel: model, targetId: id }).sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, data: logs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
