import { Request, Response } from "express";
import Room, { IRoom } from "../models/room.model";

// Create a new room configuration
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const newRoom: IRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json({ success: true, data: savedRoom });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating room", error: error.message });
  }
};

// Fetch all rooms (drafts)
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching rooms", error: error.message });
  }
};

// Fetch a single room by ID
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }
    res.status(200).json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching room", error: error.message });
  }
};

// Update an existing room config
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedRoom) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }
    
    res.status(200).json({ success: true, data: updatedRoom });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating room", error: error.message });
  }
};
