import { Request, Response } from "express";
import { Order } from "../models/Order.model";
import { Product } from "../models/Product.model";
import { PromoCode } from "../models/PromoCode.model";
import { createNotification, notifyAllAdmins } from "../utils/createNotification";
import PDFDocument from "pdfkit";

const generateOrderNumber = (): string => {
    const prefix = "LV";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${year}-${random}`;
};

// POST /api/orders - Create order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { res.status(401).json({ success: false, message: "Not authenticated" }); return; }

        const { items, shippingAddress, paymentMethod, promoCode, deliveryDate, deliveryTimeSlot } = req.body;

        if (!items || !items.length || !shippingAddress) {
            res.status(400).json({ success: false, message: "Items and shipping address are required" });
            return;
        }

        // Validate products and calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
                return;
            }
            if (product.stock < item.quantity) {
                res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
                return;
            }
            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;
            orderItems.push({
                productId: product._id,
                name: product.name,
                sku: product.sku,
                price: product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal,
            });
        }

        // Apply promo code
        let discountAmount = 0;
        let appliedPromoCode: string | undefined;
        if (promoCode) {
            const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
            if (promo) {
                if (promo.expiresAt && new Date() > promo.expiresAt) {
                    res.status(400).json({ success: false, message: "Promo code has expired" });
                    return;
                }
                if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
                    res.status(400).json({ success: false, message: "Promo code usage limit reached" });
                    return;
                }
                if (subtotal < promo.minOrderAmount) {
                    res.status(400).json({ success: false, message: `Minimum order amount is Rs.${promo.minOrderAmount.toLocaleString()}` });
                    return;
                }
                discountAmount = promo.discountType === "percentage"
                    ? Math.round(subtotal * (promo.discountValue / 100))
                    : promo.discountValue;
                discountAmount = Math.min(discountAmount, subtotal);
                appliedPromoCode = promo.code;
                promo.currentUses += 1;
                await promo.save();
            }
        }

        const total = subtotal - discountAmount;

        const order = await Order.create({
            userId,
            orderNumber: generateOrderNumber(),
            items: orderItems,
            subtotal,
            discountAmount,
            promoCode: appliedPromoCode,
            total,
            paymentMethod: paymentMethod || "cod",
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            orderStatus: "pending",
            shippingAddress,
            deliveryDate: deliveryDate || undefined,
            deliveryTimeSlot: deliveryTimeSlot || undefined,
            invoiceNumber: generateInvoiceNumber(),
            trackingNotes: [{ status: "pending", note: "Order placed successfully", timestamp: new Date() }],
        });

        // Deduct stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        // Check for low stock alerts
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product && product.stock <= product.lowStockThreshold) {
                await notifyAllAdmins(
                    "general",
                    "Low Stock Alert",
                    `"${product.name}" (SKU: ${product.sku}) is running low. Only ${product.stock} units left.`,
                    product._id?.toString(),
                    "Product"
                );
            }
        }

        // Notify admins
        await notifyAllAdmins(
            "order_placed",
            "New Order Placed",
            `Order #${order.orderNumber} — Rs.${total.toLocaleString()} (${orderItems.length} items)`,
            order._id?.toString(),
            "Order"
        );

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/my - User's orders
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { page = "1", limit = "10", status } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const query: any = { userId };
        if (status) query.orderStatus = status;

        const [orders, total] = await Promise.all([
            Order.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
            Order.countDocuments(query),
        ]);

        res.json({ success: true, data: { orders, pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total } } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/:id - Order details
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "name email phone");
        if (!order) { res.status(404).json({ success: false, message: "Order not found" }); return; }
        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders - Admin: all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = "1", limit = "10", status, search } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const query: any = {};
        if (status) query.orderStatus = status;
        if (search) query.orderNumber = { $regex: search, $options: "i" };

        const [orders, total] = await Promise.all([
            Order.find(query).populate("userId", "name email").sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
            Order.countDocuments(query),
        ]);

        res.json({ success: true, data: { orders, pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total } } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/orders/:id/status - Admin: update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, note } = req.body;
        const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status" }); return;
        }

        const order = await Order.findById(req.params.id);
        if (!order) { res.status(404).json({ success: false, message: "Order not found" }); return; }

        order.orderStatus = status;
        if (status === "delivered") order.paymentStatus = "paid";
        if (status === "cancelled" && order.paymentStatus === "paid") order.paymentStatus = "refunded";

        order.trackingNotes.push({
            status,
            note: note || `Order ${status}`,
            timestamp: new Date(),
        });

        await order.save();

        // Notify user
        await createNotification({
            recipientId: order.userId.toString(),
            recipientRole: "user",
            type: "general",
            title: "Order Update",
            message: `Your order #${order.orderNumber} has been ${status}.`,
            relatedId: order._id?.toString(),
            relatedModel: "Order",
        });

        // If cancelled, restore stock
        if (status === "cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
            }
        }

        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/orders/:id/delivery - Update delivery schedule
export const updateDeliverySchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { deliveryDate, deliveryTimeSlot } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { deliveryDate, deliveryTimeSlot } },
            { new: true }
        );
        if (!order) { res.status(404).json({ success: false, message: "Order not found" }); return; }
        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/:id/invoice/pdf - Generate invoice PDF
export const getInvoicePdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "name email phone");
        if (!order) { res.status(404).json({ success: false, message: "Order not found" }); return; }

        const doc = new PDFDocument({ margin: 50 });
        const filename = encodeURIComponent(`Invoice-${order.invoiceNumber || order.orderNumber}.pdf`);
        res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-type", "application/pdf");
        doc.pipe(res);

        // Header
        doc.fontSize(24).font("Helvetica-Bold").text("LIVORA", 50, 50);
        doc.fontSize(10).font("Helvetica").text("Interior Design Studio", 50, 78);
        doc.moveDown(2);

        // Invoice info
        doc.fontSize(18).font("Helvetica-Bold").text("INVOICE", { align: "right" });
        doc.fontSize(10).font("Helvetica");
        doc.text(`Invoice #: ${order.invoiceNumber || "N/A"}`, { align: "right" });
        doc.text(`Order #: ${order.orderNumber}`, { align: "right" });
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: "right" });
        doc.text(`Status: ${order.paymentStatus.toUpperCase()}`, { align: "right" });
        doc.moveDown(2);

        // Ship to
        doc.font("Helvetica-Bold").text("Ship To:");
        doc.font("Helvetica");
        doc.text(order.shippingAddress.fullName);
        doc.text(order.shippingAddress.addressLine1);
        if (order.shippingAddress.addressLine2) doc.text(order.shippingAddress.addressLine2);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`);
        doc.text(order.shippingAddress.phone);
        doc.moveDown(2);

        // Table header
        const tableTop = doc.y;
        doc.font("Helvetica-Bold");
        doc.text("Item", 50, tableTop, { width: 220 });
        doc.text("SKU", 270, tableTop, { width: 70 });
        doc.text("Qty", 340, tableTop, { width: 40, align: "right" });
        doc.text("Price", 390, tableTop, { width: 80, align: "right" });
        doc.text("Total", 480, tableTop, { width: 80, align: "right" });
        doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).stroke();

        // Table rows
        doc.font("Helvetica");
        let y = tableTop + 25;
        for (const item of order.items) {
            if (y > 700) { doc.addPage(); y = 50; }
            doc.text(item.name, 50, y, { width: 220 });
            doc.text(item.sku, 270, y, { width: 70 });
            doc.text(item.quantity.toString(), 340, y, { width: 40, align: "right" });
            doc.text(`Rs.${item.price.toLocaleString()}`, 390, y, { width: 80, align: "right" });
            doc.text(`Rs.${item.subtotal.toLocaleString()}`, 480, y, { width: 80, align: "right" });
            y += 20;
        }

        doc.moveTo(50, y + 5).lineTo(560, y + 5).stroke();
        y += 20;

        // Totals
        doc.text("Subtotal:", 390, y, { width: 80, align: "right" });
        doc.text(`Rs.${order.subtotal.toLocaleString()}`, 480, y, { width: 80, align: "right" });
        y += 18;
        if (order.discountAmount > 0) {
            doc.text("Discount:", 390, y, { width: 80, align: "right" });
            doc.text(`-Rs.${order.discountAmount.toLocaleString()}`, 480, y, { width: 80, align: "right" });
            y += 18;
        }
        doc.font("Helvetica-Bold");
        doc.text("Total:", 390, y, { width: 80, align: "right" });
        doc.text(`Rs.${order.total.toLocaleString()}`, 480, y, { width: 80, align: "right" });

        // Footer
        doc.moveDown(4);
        doc.font("Helvetica").fontSize(8).text("Thank you for choosing Livora!", { align: "center" });

        doc.end();
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/orders/create-payment-intent - Stripe payment intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            res.status(500).json({ success: false, message: "Stripe is not configured" });
            return;
        }

        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey);

        const { amount } = req.body;
        if (!amount || amount <= 0) {
            res.status(400).json({ success: false, message: "Invalid amount" });
            return;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "lkr",
            metadata: { userId: req.user?.id },
        });

        res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
