import { Request, Response } from "express";
import { PromoCode } from "../models/PromoCode.model";

// GET /api/promo-codes - Admin: list all
export const getAllPromoCodes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = "1", limit = "20" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const [codes, total] = await Promise.all([
            PromoCode.find().sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
            PromoCode.countDocuments(),
        ]);

        res.json({ success: true, data: { codes, pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total } } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/promo-codes - Admin: create
export const createPromoCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;

        if (!code || !discountType || discountValue === undefined) {
            res.status(400).json({ success: false, message: "Code, discount type, and discount value are required" });
            return;
        }

        const existing = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existing) {
            res.status(400).json({ success: false, message: "Promo code already exists" });
            return;
        }

        const promo = await PromoCode.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxUses: maxUses || 0,
            expiresAt: expiresAt || undefined,
        });

        res.status(201).json({ success: true, data: promo });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/promo-codes/:id - Admin: update
export const updatePromoCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const promo = await PromoCode.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!promo) { res.status(404).json({ success: false, message: "Promo code not found" }); return; }
        res.json({ success: true, data: promo });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/promo-codes/:id - Admin: delete
export const deletePromoCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const promo = await PromoCode.findByIdAndDelete(req.params.id);
        if (!promo) { res.status(404).json({ success: false, message: "Promo code not found" }); return; }
        res.json({ success: true, message: "Promo code deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/promo-codes/validate - User: validate a code
export const validatePromoCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) { res.status(400).json({ success: false, message: "Code is required" }); return; }

        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
        if (!promo) { res.status(404).json({ success: false, message: "Invalid promo code" }); return; }

        if (promo.expiresAt && new Date() > promo.expiresAt) {
            res.status(400).json({ success: false, message: "Promo code has expired" }); return;
        }
        if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
            res.status(400).json({ success: false, message: "Promo code usage limit reached" }); return;
        }
        if (orderAmount && orderAmount < promo.minOrderAmount) {
            res.status(400).json({ success: false, message: `Minimum order amount is Rs.${promo.minOrderAmount.toLocaleString()}` }); return;
        }

        const discount = promo.discountType === "percentage"
            ? Math.round((orderAmount || 0) * (promo.discountValue / 100))
            : promo.discountValue;

        res.json({
            success: true,
            data: {
                code: promo.code,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                calculatedDiscount: discount,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
