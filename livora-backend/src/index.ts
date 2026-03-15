import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import roomRoutes from "./routes/room.routes";
import designRoutes from "./routes/design.routes";
import adminConsultationRoutes from "./routes/admin.consultation.routes";
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import adminProfileRoutes from "./routes/admin.profile.routes";
import consultationRequestRoutes from "./routes/consultationRequest.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import notificationRoutes from "./routes/notification.routes";
import { getPublicPreview } from "./controllers/designShare.controller";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// MongoDB connection (cached for serverless warm starts)
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB Connected");
}

// Ensure DB is connected before handling requests
app.use(async (_req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/admin/consultations", adminConsultationRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/consultation-requests", consultationRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/api/public/preview/:token", getPublicPreview);

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });
}

// Export for Vercel serverless
export default app;
