"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    Loader2,
    MapPin,
    CreditCard,
    Calendar,
    FileText,
    AlertCircle,
} from "lucide-react";

interface OrderItem {
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
    };
    deliveryDate?: string;
    deliveryTimeSlot?: string;
    trackingNotes?: { note: string; status: string; createdAt: string }[];
    invoiceNumber?: string;
    promoCode?: string;
    createdAt: string;
    updatedAt: string;
}

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    pending: { color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock, label: "Pending" },
    confirmed: { color: "text-blue-700", bg: "bg-blue-100", icon: CheckCircle2, label: "Confirmed" },
    processing: { color: "text-indigo-700", bg: "bg-indigo-100", icon: Package, label: "Processing" },
    shipped: { color: "text-purple-700", bg: "bg-purple-100", icon: Truck, label: "Shipped" },
    delivered: { color: "text-green-700", bg: "bg-green-100", icon: CheckCircle2, label: "Delivered" },
    cancelled: { color: "text-red-700", bg: "bg-red-100", icon: XCircle, label: "Cancelled" },
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/orders/${orderId}`);
                setOrder(res.data.data || res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load order");
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchOrder();
    }, [orderId]);

    const handleDownloadInvoice = async () => {
        try {
            setDownloading(true);
            const res = await api.get(`/api/orders/${orderId}/invoice/pdf`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${order?.invoiceNumber || order?.orderNumber || "order"}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
            setToast({ message: "Invoice downloaded", type: "success" });
        } catch {
            setToast({ message: "Failed to download invoice", type: "error" });
        } finally {
            setDownloading(false);
        }
    };

    const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
    const isCancelled = order?.status === "cancelled";

    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            <UserNavbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Back */}
                <Link
                    href="/user-panel/orders"
                    className="inline-flex items-center gap-2 text-sm text-[#663F23] hover:text-[#52321A] mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#663F23]" size={32} />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <AlertCircle size={40} className="text-red-400" />
                        <p className="text-red-600">{error}</p>
                        <button onClick={() => router.back()} className="text-sm text-[#663F23] underline">Go back</button>
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                                        Order {order.orderNumber}
                                    </h1>
                                    <p className="text-sm text-[#1C1C1C]/50 mt-1">
                                        Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                        const Icon = cfg.icon;
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.bg} ${cfg.color}`}>
                                                <Icon size={14} />
                                                {cfg.label}
                                            </span>
                                        );
                                    })()}
                                    <button
                                        onClick={handleDownloadInvoice}
                                        disabled={downloading}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#663F23] text-white rounded-lg text-sm font-medium hover:bg-[#52321A] transition-colors disabled:opacity-50"
                                    >
                                        {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        {!isCancelled && (
                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                                <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider mb-6">Order Progress</h2>
                                <div className="flex items-center justify-between relative">
                                    {/* Progress line */}
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E5E5]" />
                                    <div
                                        className="absolute top-5 left-0 h-0.5 bg-[#663F23] transition-all duration-500"
                                        style={{ width: `${Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1) * 100}%` }}
                                    />

                                    {STATUS_STEPS.map((step, i) => {
                                        const isCompleted = i <= currentStepIndex;
                                        const isCurrent = i === currentStepIndex;
                                        const cfg = STATUS_CONFIG[step];
                                        return (
                                            <div key={step} className="flex flex-col items-center relative z-10">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                                        isCompleted
                                                            ? "bg-[#663F23] border-[#663F23] text-white"
                                                            : "bg-white border-[#E5E5E5] text-[#1C1C1C]/30"
                                                    } ${isCurrent ? "ring-4 ring-[#663F23]/20" : ""}`}
                                                >
                                                    {isCompleted ? <CheckCircle2 size={18} /> : <span className="text-xs font-bold">{i + 1}</span>}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${isCompleted ? "text-[#663F23]" : "text-[#1C1C1C]/40"}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Cancelled notice */}
                        {isCancelled && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                                <XCircle size={24} className="text-red-500 shrink-0" />
                                <div>
                                    <p className="font-semibold text-red-700">Order Cancelled</p>
                                    <p className="text-sm text-red-600/70">This order has been cancelled. If you were charged, a refund will be processed.</p>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                            <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider mb-4">
                                Items ({order.items.length})
                            </h2>
                            <div className="divide-y divide-[#E5E5E5]">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[#F5F1E8] flex items-center justify-center">
                                                <Package size={20} className="text-[#663F23]/50" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1C1C1C]">{item.name}</p>
                                                <p className="text-xs text-[#1C1C1C]/50">SKU: {item.sku} &middot; Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[#1C1C1C]">${item.subtotal.toFixed(2)}</p>
                                            <p className="text-xs text-[#1C1C1C]/50">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-[#E5E5E5] mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1C1C1C]/60">Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Discount {order.promoCode && `(${order.promoCode})`}</span>
                                        <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E5E5E5]">
                                    <span>Total</span>
                                    <span className="text-[#663F23]">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping */}
                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={16} className="text-[#663F23]" />
                                    <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider">Shipping Address</h2>
                                </div>
                                <div className="text-sm text-[#1C1C1C] space-y-1">
                                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                                    <p className="text-[#1C1C1C]/60">{order.shippingAddress.address}</p>
                                    <p className="text-[#1C1C1C]/60">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                    <p className="text-[#1C1C1C]/60">{order.shippingAddress.country}</p>
                                    <p className="text-[#1C1C1C]/60 pt-2">{order.shippingAddress.phone}</p>
                                    <p className="text-[#1C1C1C]/60">{order.shippingAddress.email}</p>
                                </div>
                            </div>

                            {/* Payment & Delivery */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard size={16} className="text-[#663F23]" />
                                        <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider">Payment</h2>
                                    </div>
                                    <div className="text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-[#1C1C1C]/60">Method</span>
                                            <span className="font-medium capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#1C1C1C]/60">Status</span>
                                            <span className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        {order.invoiceNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-[#1C1C1C]/60">Invoice</span>
                                                <span className="font-medium">{order.invoiceNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(order.deliveryDate || order.deliveryTimeSlot) && (
                                    <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Calendar size={16} className="text-[#663F23]" />
                                            <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider">Delivery Schedule</h2>
                                        </div>
                                        <div className="text-sm space-y-2">
                                            {order.deliveryDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-[#1C1C1C]/60">Date</span>
                                                    <span className="font-medium">{formatDate(order.deliveryDate)}</span>
                                                </div>
                                            )}
                                            {order.deliveryTimeSlot && (
                                                <div className="flex justify-between">
                                                    <span className="text-[#1C1C1C]/60">Time Slot</span>
                                                    <span className="font-medium capitalize">{order.deliveryTimeSlot}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tracking Notes */}
                        {order.trackingNotes && order.trackingNotes.length > 0 && (
                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText size={16} className="text-[#663F23]" />
                                    <h2 className="text-sm font-semibold text-[#1C1C1C]/60 uppercase tracking-wider">Tracking History</h2>
                                </div>
                                <div className="space-y-4">
                                    {order.trackingNotes.map((note, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-[#663F23] shrink-0 mt-1" />
                                                {idx < order.trackingNotes!.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-[#E5E5E5] mt-1" />
                                                )}
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm font-medium text-[#1C1C1C]">{note.note}</p>
                                                <p className="text-xs text-[#1C1C1C]/50 mt-0.5">
                                                    {formatDate(note.createdAt)} at {formatTime(note.createdAt)}
                                                    <span className="ml-2 capitalize text-[#663F23]">{note.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
