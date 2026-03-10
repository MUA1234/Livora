import { Router } from "express";
import { createRoom, getRoomById, updateRoom, getRooms } from "../controllers/room.controller";
import { validateRoomInput } from "../middleware/room.validation";

const router = Router();

// GET /api/rooms
router.get("/", getRooms);

// POST /api/rooms
router.post("/", validateRoomInput, createRoom);

// GET /api/rooms/:id
router.get("/:id", getRoomById);

// PUT /api/rooms/:id
router.put("/:id", validateRoomInput, updateRoom);

export default router;
