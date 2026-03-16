import { Request, Response } from "express";
import { RoomTemplate } from "../models/RoomTemplate.model";

// GET /api/room-templates
export const getRoomTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { style, roomType } = req.query;
        const query: any = { isActive: true };
        if (style) query.style = style;
        if (roomType) query.roomType = roomType;

        const templates = await RoomTemplate.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: templates });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/room-templates/:id
export const getRoomTemplateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const template = await RoomTemplate.findById(req.params.id);
        if (!template) { res.status(404).json({ success: false, message: "Template not found" }); return; }
        res.json({ success: true, data: template });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/room-templates - Admin: create
export const createRoomTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const template = await RoomTemplate.create(req.body);
        res.status(201).json({ success: true, data: template });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/room-templates/:id - Admin: update
export const updateRoomTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const template = await RoomTemplate.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!template) { res.status(404).json({ success: false, message: "Template not found" }); return; }
        res.json({ success: true, data: template });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/room-templates/:id - Admin: delete
export const deleteRoomTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        await RoomTemplate.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Template deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
