import { Request, Response } from "express";
import Consultation from "../models/consultation.model";
import { createNotification } from "../utils/createNotification";

// GET /api/admin/consultations - List all consultations, filterable by status, paginated
export const getAdminConsultations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    const consultations = await Consultation.find(filters)
      .populate("userId", "name email phone")
      .populate("designId", "name status")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Consultation.countDocuments(filters);

    res.status(200).json({
      data: consultations,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching consultations", error: error.message });
  }
};

// GET /api/admin/consultations/:id - Full detail including customer info, design, thread
export const getAdminConsultationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("designId", "name layoutData status");

    if (!consultation) {
      res.status(404).json({ message: "Consultation not found" });
      return;
    }

    res.status(200).json(consultation);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching consultation", error: error.message });
  }
};

// PUT /api/admin/consultations/:id/status - Update status
export const updateAdminConsultationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedConsultation) {
      res.status(404).json({ message: "Consultation not found" });
      return;
    }

    // Notify the user about the status change
    if (updatedConsultation.userId) {
      const statusLabels: Record<string, string> = {
        accepted: "accepted",
        rejected: "declined",
        completed: "marked as completed",
        pending: "set back to pending",
      };
      await createNotification({
        recipientId: updatedConsultation.userId.toString(),
        recipientRole: "user",
        type: "consultation_status_update",
        title: "Consultation Updated",
        message: `Your consultation has been ${statusLabels[status] || status}.`,
        relatedId: updatedConsultation._id?.toString(),
        relatedModel: "Consultation",
      });
    }

    res.status(200).json(updatedConsultation);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating consultation status", error: error.message });
  }
};

// POST /api/admin/consultations/:id/respond - Append an admin response message
export const respondToConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ message: "A valid 'message' string is required" });
      return;
    }

    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      res.status(404).json({ message: "Consultation not found" });
      return;
    }

    consultation.messageThread.push({
      sender: "admin",
      message: message,
      timestamp: new Date()
    });

    const savedConsultation = await consultation.save();

    // Notify the user about the admin response
    if (consultation.userId) {
      await createNotification({
        recipientId: consultation.userId.toString(),
        recipientRole: "user",
        type: "consultation_response",
        title: "New Message from Admin",
        message: message.length > 80 ? message.substring(0, 80) + "..." : message,
        relatedId: consultation._id?.toString(),
        relatedModel: "Consultation",
      });
    }

    res.status(201).json(savedConsultation);
  } catch (error: any) {
    res.status(500).json({ message: "Error responding to consultation", error: error.message });
  }
};
