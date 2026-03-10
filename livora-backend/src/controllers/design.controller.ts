import { Request, Response } from "express";
import Design, { IDesign } from "../models/design.model";
import Room from "../models/room.model";

// Create a new design
export const createDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, roomId, layoutData, status } = req.body;

    // Optional: Verify if room exists before associating
    const roomExists = await Room.findById(roomId);
    if (!roomExists) {
      res.status(404).json({ message: "Referenced Room not found" });
      return;
    }

    const newDesign: IDesign = new Design({
      name,
      roomId,
      layoutData: layoutData || {},
      status: status || "draft",
    });

    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating design", error: error.message });
  }
};

// List designs with filter and pagination
export const getDesigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, roomId, page = "1", limit = "10" } = req.query;
    
    // Pagination parameters
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Filters (Exclude soft-deleted by default)
    const filters: any = { deletedAt: null };
    
    if (status) {
      filters.status = status;
    }
    
    if (roomId) {
      filters.roomId = roomId;
    }

    const designs = await Design.find(filters)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Design.countDocuments(filters);

    res.status(200).json({
      data: designs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching designs", error: error.message });
  }
};

// Single design detail
export const getDesignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const design = await Design.findOne({ _id: req.params.id, deletedAt: null });
    
    if (!design) {
      res.status(404).json({ message: "Design not found or has been deleted" });
      return;
    }
    
    res.status(200).json(design);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching design", error: error.message });
  }
};

// Update an existing design config
export const updateDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status, layoutData } = req.body;
    
    // Create an update object with only defined fields
    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (status !== undefined) updatePayload.status = status;
    if (layoutData !== undefined) updatePayload.layoutData = layoutData;

    const updatedDesign = await Design.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );
    
    if (!updatedDesign) {
      res.status(404).json({ message: "Design not found or has been deleted" });
      return;
    }
    
    res.status(200).json(updatedDesign);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating design", error: error.message });
  }
};

// Soft delete
export const deleteDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hard } = req.query;
    
    if (hard === "true") {
      // Hard delete
      const deletedDesign = await Design.findByIdAndDelete(req.params.id);
      if (!deletedDesign) {
        res.status(404).json({ message: "Design not found" });
        return;
      }
      res.status(200).json({ message: "Design permanently deleted" });
    } else {
      // Soft delete
      const deletedDesign = await Design.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true }
      );

      if (!deletedDesign) {
        res.status(404).json({ message: "Design not found or already deleted" });
        return;
      }
      res.status(200).json({ message: "Design soft deleted", data: deletedDesign });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting design", error: error.message });
  }
};
