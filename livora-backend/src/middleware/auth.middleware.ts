import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request object to include the user payload
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "No token provided, authorization denied" });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No token found, authorization denied" });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "livora_super_secret_key_2026"
        );

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
        return;
    }
};

export const adminOnly = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin role required." });
    }
};
