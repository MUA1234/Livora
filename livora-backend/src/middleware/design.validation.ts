import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateDesignInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, roomId, status } = req.body;

  if (name && typeof name !== "string") {
    res.status(400).json({ message: "Invalid 'name' format. Must be a string." });
    return;
  }

  if (roomId && !mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({ message: "Invalid 'roomId'. Must be a valid ObjectId." });
    return;
  }

  if (status && !["draft", "published", "archived"].includes(status)) {
    res.status(400).json({ message: "Invalid 'status'. Must be one of draft, published, archived." });
    return;
  }

  next();
};

export const validateCreateDesign = (req: Request, res: Response, next: NextFunction): void => {
  const { name, roomId } = req.body;

  if (!name) {
    res.status(400).json({ message: "Missing required field: 'name'" });
    return;
  }

  if (!roomId) {
    res.status(400).json({ message: "Missing required field: 'roomId'" });
    return;
  }

  validateDesignInput(req, res, next);
};
