import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    getMyMoodBoards,
    getMoodBoardById,
    createMoodBoard,
    updateMoodBoard,
    deleteMoodBoard,
} from "../controllers/moodBoard.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyMoodBoards);
router.get("/:id", getMoodBoardById);
router.post("/", createMoodBoard);
router.put("/:id", updateMoodBoard);
router.delete("/:id", deleteMoodBoard);

export default router;
