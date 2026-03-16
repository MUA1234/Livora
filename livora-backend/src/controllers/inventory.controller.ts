import { Request, Response } from "express";
import { Product } from "../models/Product.model";

// GET /api/inventory - Admin: get inventory overview
export const getInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = "1", limit = "20", filter, search, category } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
            ];
        }
        if (category) query.category = category;
        if (filter === "low_stock") {
            query.$expr = { $lte: ["$stock", "$lowStockThreshold"] };
        } else if (filter === "out_of_stock") {
            query.stock = 0;
        }

        const [products, total, totalLowStock, totalOutOfStock] = await Promise.all([
            Product.find(query).sort({ stock: 1, name: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum)
                .select("name sku category price stock lowStockThreshold isActive images"),
            Product.countDocuments(query),
            Product.countDocuments({ $expr: { $and: [{ $lte: ["$stock", "$lowStockThreshold"] }, { $gt: ["$stock", 0] }] } }),
            Product.countDocuments({ stock: 0 }),
        ]);

        res.json({
            success: true,
            data: {
                products,
                stats: { totalLowStock, totalOutOfStock, totalProducts: await Product.countDocuments() },
                pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/inventory/:id/stock - Admin: update stock
export const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { stock, lowStockThreshold } = req.body;
        const update: any = {};
        if (stock !== undefined) update.stock = stock;
        if (lowStockThreshold !== undefined) update.lowStockThreshold = lowStockThreshold;

        const product = await Product.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
        if (!product) { res.status(404).json({ success: false, message: "Product not found" }); return; }

        res.json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/inventory/bulk-import - Admin: CSV import
export const bulkImportProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            res.status(400).json({ success: false, message: "Products array is required" });
            return;
        }

        const results = { created: 0, updated: 0, errors: [] as string[] };

        for (const item of products) {
            try {
                if (!item.name || !item.sku || !item.category || item.price === undefined) {
                    results.errors.push(`SKU ${item.sku || "unknown"}: Missing required fields`);
                    continue;
                }

                const existing = await Product.findOne({ sku: item.sku });
                if (existing) {
                    Object.assign(existing, item);
                    await existing.save();
                    results.updated++;
                } else {
                    await Product.create({
                        ...item,
                        images: item.images || [],
                        colors: item.colors || [],
                        materials: item.materials || [],
                        stock: item.stock ?? 100,
                        lowStockThreshold: item.lowStockThreshold ?? 10,
                    });
                    results.created++;
                }
            } catch (err: any) {
                results.errors.push(`SKU ${item.sku || "unknown"}: ${err.message}`);
            }
        }

        res.json({ success: true, data: results });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
