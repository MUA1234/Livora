import { Request, Response } from "express";
import { ConsultationRequest } from "../models/ConsultationRequest.model";

export const createConsultationRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, phone, roomType, roomSize, preferredDate, notes } = req.body;

        if (!fullName || !email || !phone || !roomType) {
            res.status(400).json({ success: false, message: "Full name, email, phone, and room type are required" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: "Invalid email format" });
            return;
        }

        const consultation = await ConsultationRequest.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            roomType: roomType.trim(),
            roomSize: roomSize ? roomSize.trim() : "",
            preferredDate: preferredDate || undefined,
            notes: notes ? notes.trim() : undefined,
            userId: req.user?.id || undefined,
        });

        res.status(201).json({
            success: true,
            message: "Consultation request submitted successfully",
            data: consultation,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserConsultations = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }

        const consultations = await ConsultationRequest.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: consultations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
