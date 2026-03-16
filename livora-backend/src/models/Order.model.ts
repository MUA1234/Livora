import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    orderNumber: string;
    items: IOrderItem[];
    subtotal: number;
    discountAmount: number;
    promoCode?: string;
    total: number;
    paymentMethod: "stripe" | "cod";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    stripePaymentIntentId?: string;
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
    };
    deliveryDate?: Date;
    deliveryTimeSlot?: string;
    trackingNotes: { status: string; note: string; timestamp: Date }[];
    invoiceNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        sku: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orderNumber: { type: String, required: true, unique: true },
        items: { type: [OrderItemSchema], required: true },
        subtotal: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        promoCode: { type: String },
        total: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["stripe", "cod"], default: "cod" },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
        stripePaymentIntentId: { type: String },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
        },
        deliveryDate: { type: Date },
        deliveryTimeSlot: { type: String },
        trackingNotes: [
            {
                status: { type: String },
                note: { type: String },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        invoiceNumber: { type: String },
    },
    { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
