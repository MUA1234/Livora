import { Request, Response } from "express";
import Room, { IRoom } from "../models/room.model";

// Create a new room configuration
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const newRoom: IRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

// Fetch a single room by ID
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json(room);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching room", error: error.message });
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
      res.status(404).json({ message: "Room not found" });
      return;
    }
    
    res.status(200).json(updatedRoom);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};
