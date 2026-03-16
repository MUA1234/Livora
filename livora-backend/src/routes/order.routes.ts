import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updateDeliverySchedule,
    getInvoicePdf,
    createPaymentIntent,
} from "../controllers/order.controller";

const router = express.Router();

router.use(authMiddleware);

// User routes
router.post("/", createOrder);
router.get("/my", getMyOrders);
router.post("/create-payment-intent", createPaymentIntent);
router.get("/:id", getOrderById);
router.get("/:id/invoice/pdf", getInvoicePdf);

// Admin routes
router.get("/", adminOnly, getAllOrders);
router.put("/:id/status", adminOnly, updateOrderStatus);
router.put("/:id/delivery", adminOnly, updateDeliverySchedule);

export default router;
