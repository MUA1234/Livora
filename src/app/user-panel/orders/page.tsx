"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Package,
    ChevronRight,
    Loader2,
    AlertCircle,
    ShoppingBag,
    Calendar,
    Hash,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import api from "@/lib/api";
import { Toast, ToastType } from "@/components/ui/Toast";

interface Order {
    _id: string;
    orderNumber: string;
    items: { name: string; quantity: number }[];
    total: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    pending: { label: "Pending", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
    confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    processing: { label: "Processing", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
    shipped: { label: "Shipped", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    delivered: { label: "Delivered", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    const fetchOrders = async (pageNum: number, status: string) => {
        setLoading(true);
        setError("");
        try {
            const params: Record<string, string> = { page: String(pageNum), limit: "10" };
            if (status) params.status = status;
            const res = await api.get("/api/orders/my", { params });
            if (res.data.success) {
                setOrders(res.data.data.orders);
                setTotalPages(res.data.data.pagination.pages);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to load orders";
            setError(msg);
            setToast({ message: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, statusFilter);
    }, [page, statusFilter]);

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        setPage(1);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const totalItemCount = (items: { quantity: number }[]) =>
        items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            <main className="max-w-[900px] mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">My Orders</h1>
                        <p className="text-sm text-[#1C1C1C]/50 mt-1">
                            Track and manage your orders
                        </p>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { value: "", label: "All" },
                        { value: "pending", label: "Pending" },
                        { value: "confirmed", label: "Confirmed" },
                        { value: "processing", label: "Processing" },
                        { value: "shipped", label: "Shipped" },
                        { value: "delivered", label: "Delivered" },
                        { value: "cancelled", label: "Cancelled" },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => handleFilterChange(f.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                statusFilter === f.value
                                    ? "bg-[#663F23] text-white"
                                    : "bg-white text-[#1C1C1C]/70 border border-[#E5E5E5] hover:border-[#663F23]/30"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-[#663F23]" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5]">
                        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-[#1C1C1C]/60 mb-6">{error}</p>
                        <button
                            onClick={() => fetchOrders(page, statusFilter)}
                            className="px-6 py-2.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5]">
                        <Package size={48} className="mx-auto text-[#1C1C1C]/20 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-[#1C1C1C]/60 mb-6">
                            {statusFilter
                                ? `You have no ${statusFilter} orders.`
                                : "Start shopping to see your orders here."}
                        </p>
                        <Link
                            href="/user-panel/furniture-catalogue"
                            className="inline-block px-8 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                        >
                            Browse Catalogue
                        </Link>
                    </div>
                )}

                {/* Order List */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <button
                                key={order._id}
                                onClick={() => router.push(`/user-panel/orders/${order._id}`)}
                                className="w-full text-left bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E5E5] shadow-sm hover:border-[#663F23]/30 hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#663F23]/10 flex items-center justify-center shrink-0">
                                            <Package size={20} className="text-[#663F23]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1C1C1C] flex items-center gap-1.5">
                                                <Hash size={14} className="text-[#1C1C1C]/40" />
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-xs text-[#1C1C1C]/50 flex items-center gap-1 mt-0.5">
                                                <Calendar size={12} />
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.orderStatus} />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]/60">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-[#1C1C1C]/50">Items</p>
                                            <p className="font-semibold text-sm">
                                                {totalItemCount(order.items)}{" "}
                                                {totalItemCount(order.items) === 1
                                                    ? "item"
                                                    : "items"}
                                            </p>
                                        </div>
                                        <div className="w-px h-8 bg-[#E5E5E5]" />
                                        <div>
                                            <p className="text-xs text-[#1C1C1C]/50">Total</p>
                                            <p className="font-bold text-sm">
                                                Rs.{order.total.toLocaleString("en-IN")}.00
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={20}
                                        className="text-[#1C1C1C]/30 group-hover:text-[#663F23] transition-colors"
                                    />
                                </div>
                            </button>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E5E5E5] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-[#1C1C1C]/60 px-3">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E5E5E5] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
