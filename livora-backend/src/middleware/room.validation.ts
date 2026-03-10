import { Request, Response, NextFunction } from "express";

export const validateRoomInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, dimensions, shape } = req.body;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "Invalid or missing 'name'" });
    return;
  }
  
  if (!dimensions || typeof dimensions.length !== "number" || typeof dimensions.width !== "number" || typeof dimensions.height !== "number") {
    res.status(400).json({ message: "Invalid or missing 'dimensions'. Requires length, width, and height as numbers." });
    return;
  }
  
  if (dimensions.unit && !["cm", "m", "inch", "ft"].includes(dimensions.unit)) {
    res.status(400).json({ message: "Invalid dimension unit. Must be one of cm, m, inch, ft." });
    return;
  }

  next();
};
