import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const generateToken = (id: string, role: string) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "livora_super_secret_key_2026",
        {
            expiresIn: "30d",
        }
    );
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash,
            phone,
            role: "user", // Default role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // If user signed up with Google and has no password set
        if (user.authProvider === "google" && !user.passwordHash) {
            res.status(401).json({ message: "This account uses Google sign-in. Please use the Google button to log in." });
            return;
        }

        if (await bcrypt.compare(password, user.passwordHash)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        const user = await User.findById(req.user.id).select("-passwordHash");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            res.status(400).json({ message: "Google credential is required" });
            return;
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            res.status(500).json({ message: "Google OAuth is not configured on the server" });
            return;
        }

        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { sub: googleId, email, name, picture } = payload;

        // Check if user already exists by email
        let user = await User.findOne({ email });

        if (user) {
            // If admin login, verify role
            if (role === "admin" && user.role !== "admin") {
                res.status(403).json({ message: "Admin access only. This account does not have admin privileges." });
                return;
            }

            // Link Google account if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                if (user.authProvider === "local") {
                    // Keep as local but add googleId for future logins
                }
                if (picture && !user.avatarUrl) {
                    user.avatarUrl = picture;
                }
                await user.save();
            }
        } else {
            // Admin login should not create new accounts
            if (role === "admin") {
                res.status(403).json({ message: "No admin account found for this Google account. Contact your administrator." });
                return;
            }

            // Create new user for user-panel signups
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                passwordHash: "",
                googleId,
                authProvider: "google",
                avatarUrl: picture || "",
                role: "user",
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            token: generateToken(user._id.toString(), user.role),
        });
    } catch (error: any) {
        console.error("Google auth error:", error);
        if (error.message?.includes("Token used too late") || error.message?.includes("Invalid token")) {
            res.status(401).json({ message: "Google token has expired. Please try again." });
        } else {
            res.status(500).json({ message: "Google authentication failed. Please try again." });
        }
    }
};
