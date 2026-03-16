import { Request, Response } from "express";
import { MoodBoard } from "../models/MoodBoard.model";

// GET /api/mood-boards - User's mood boards
export const getMyMoodBoards = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const boards = await MoodBoard.find({ userId }).sort({ updatedAt: -1 });
        res.json({ success: true, data: boards });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/mood-boards/:id
export const getMoodBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await MoodBoard.findById(req.params.id);
        if (!board) { res.status(404).json({ success: false, message: "Mood board not found" }); return; }
        res.json({ success: true, data: board });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/mood-boards
export const createMoodBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { name, description, backgroundColor } = req.body;
        if (!name) { res.status(400).json({ success: false, message: "Name is required" }); return; }

        const board = await MoodBoard.create({
            userId,
            name,
            description,
            backgroundColor: backgroundColor || "#FFFFFF",
        });

        res.status(201).json({ success: true, data: board });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/mood-boards/:id
export const updateMoodBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await MoodBoard.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!board) { res.status(404).json({ success: false, message: "Mood board not found" }); return; }
        res.json({ success: true, data: board });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/mood-boards/:id
export const deleteMoodBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        await MoodBoard.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Mood board deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
