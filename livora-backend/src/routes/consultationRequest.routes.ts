import express from "express";
import { createConsultationRequest, getUserConsultations } from "../controllers/consultationRequest.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", createConsultationRequest);
router.get("/my", authMiddleware, getUserConsultations);

export default router;
