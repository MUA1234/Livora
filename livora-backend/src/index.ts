import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import roomRoutes from "./routes/room.routes";
import designRoutes from "./routes/design.routes";
import adminConsultationRoutes from "./routes/admin.consultation.routes";
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import adminProfileRoutes from "./routes/admin.profile.routes";
import consultationRequestRoutes from "./routes/consultationRequest.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in the environment variables.");
    process.exit(1);
}

// Connect to MongoDB and start server
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });
