"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  Inbox,
  Package,
  X,
  ChevronDown,
  Calendar,
  Clock,
  Truck,
  User as UserIcon,
  Hash,
  DollarSign,
  ShoppingBag,
  Eye,
  Edit3,
  Save,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shippingCost?: number;
  status: OrderStatus;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusBadge: Record<
  OrderStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmed" },
  processing: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    label: "Processing",
  },
  shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Delivered",
  },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
};

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Status update
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(
    null
  );
  const [statusNotes, setStatusNotes] = useState("");

  // Delivery update
  const [editingDelivery, setEditingDelivery] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  const fetchOrders = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, string | number> = { page, limit: 10 };
        if (statusFilter !== "all") params.status = statusFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const response = await api.get("/api/orders", { params });
        const { data, pagination } = response.data;

        setOrders(data || []);
        setCurrentPage(pagination?.page || 1);
        setTotalPages(pagination?.pages || 1);
        setTotalCount(pagination?.total || 0);
      } catch (err: unknown) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter, searchQuery]
  );

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter, fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleOpenDrawer = async (order: Order) => {
    setIsDrawerOpen(true);
    setIsDetailLoading(true);
    setEditingDelivery(false);
    setSelectedOrder(order);
    setDeliveryDate(order.deliveryDate || "");
    setDeliveryTimeSlot(order.deliveryTimeSlot || "");

    try {
      const response = await api.get(`/api/orders/${order._id}`);
      const detail = response.data.data || response.data;
      setSelectedOrder(detail);
      setDeliveryDate(detail.deliveryDate?.split("T")[0] || "");
      setDeliveryTimeSlot(detail.deliveryTimeSlot || "");
    } catch {
      // keep the basic info we already have
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingStatusId(orderId);
      await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
        notes: statusNotes || undefined,
      });
      setToastConfig({
        message: `Order status updated to ${newStatus}.`,
        type: "success",
      });
      setStatusDropdownOpen(null);
      setStatusNotes("");
      fetchOrders(currentPage);

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch {
      setToastConfig({
        message: "Failed to update order status.",
        type: "error",
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeliverySave = async () => {
    if (!selectedOrder) return;
    try {
      setIsSavingDelivery(true);
      await api.put(`/api/orders/${selectedOrder._id}/delivery`, {
        deliveryDate: deliveryDate || undefined,
        deliveryTimeSlot: deliveryTimeSlot || undefined,
      });
      setToastConfig({
        message: "Delivery schedule updated.",
        type: "success",
      });
      setEditingDelivery(false);
      setSelectedOrder({
        ...selectedOrder,
        deliveryDate,
        deliveryTimeSlot,
      });
      fetchOrders(currentPage);
    } catch {
      setToastConfig({
        message: "Failed to update delivery schedule.",
        type: "error",
      });
    } finally {
      setIsSavingDelivery(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-['Poppins',_sans-serif] text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">
                Order Management
              </h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">
                Track, manage, and update customer orders
              </p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 w-full border-b border-[#E5E5E5]/60 shadow-[0_4px_10px_rgba(0,0,0,0.02)] overflow-x-auto">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  statusFilter === opt.value
                    ? "bg-[#6E421E] text-white shadow-sm"
                    : "bg-[#F4F1ED] text-[#8C8C8C] hover:bg-[#EBE7DF]"
                }`}
              >
                {opt.value === "all" ? (
                  <Package className="w-4 h-4" />
                ) : opt.value === "pending" ? (
                  <Clock className="w-4 h-4" />
                ) : opt.value === "shipped" ? (
                  <Truck className="w-4 h-4" />
                ) : opt.value === "delivered" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : opt.value === "cancelled" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                <span>{opt.label}</span>
                {statusFilter === opt.value && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5A2B]/40 text-white">
                    {totalCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto">
          {/* Search + Refresh */}
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between mb-6 gap-4"
          >
            <div className="relative flex-1 max-w-[800px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#A8A8A8]" />
              </div>
              <input
                type="text"
                placeholder="Search by order number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchOrders(1)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </form>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            {/* Desktop header */}
            <div className="hidden lg:grid grid-cols-[1fr_1.3fr_0.6fr_0.8fr_0.8fr_0.8fr_0.6fr] items-center px-8 py-4 bg-white border-b border-[#E5E5E5]">
              {[
                { icon: <Hash className="w-3.5 h-3.5" />, label: "Order #" },
                {
                  icon: <UserIcon className="w-3.5 h-3.5" />,
                  label: "Customer",
                },
                {
                  icon: <ShoppingBag className="w-3.5 h-3.5" />,
                  label: "Items",
                },
                {
                  icon: <DollarSign className="w-3.5 h-3.5" />,
                  label: "Total",
                },
                {
                  icon: <AlertCircle className="w-3.5 h-3.5" />,
                  label: "Status",
                },
                {
                  icon: <Calendar className="w-3.5 h-3.5" />,
                  label: "Date",
                },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest"
                >
                  {icon}
                  {label}
                </div>
              ))}
              <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">
                Actions
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-[#6E421E] animate-spin" />
                  <p className="text-[#A8A8A8] font-medium">
                    Loading orders...
                  </p>
                </div>
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-4">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1C1C]">
                      Something went wrong
                    </h3>
                    <p className="text-[#A8A8A8] mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => fetchOrders(currentPage)}
                    className="px-6 py-2 bg-[#6E421E] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Inbox className="w-12 h-12 text-[#EBE7DF]" />
                  <p className="text-[#A8A8A8] font-semibold">
                    No orders found
                  </p>
                </div>
              ) : (
                orders.map((order, idx, arr) => {
                  const badge = statusBadge[order.status];
                  return (
                    <React.Fragment key={order._id}>
                      {/* Desktop Row */}
                      <div
                        className={`hidden lg:grid grid-cols-[1fr_1.3fr_0.6fr_0.8fr_0.8fr_0.8fr_0.6fr] items-center px-8 py-5 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="text-[14px] font-bold text-[#1C1C1C]">
                          {order.orderNumber}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[14px] font-bold text-[#1C1C1C] truncate">
                            {order.customer?.name || "N/A"}
                          </p>
                          <p className="text-[12px] font-medium text-[#A8A8A8] truncate">
                            {order.customer?.email || "N/A"}
                          </p>
                        </div>
                        <div className="text-[14px] font-semibold text-[#6C6C6C]">
                          {order.items?.length || 0}
                        </div>
                        <div className="text-[14px] font-bold text-[#1C1C1C]">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdownOpen(
                                statusDropdownOpen === order._id
                                  ? null
                                  : order._id
                              )
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text} hover:opacity-80 transition-opacity`}
                          >
                            {badge.label}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {statusDropdownOpen === order._id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setStatusDropdownOpen(null)}
                              />
                              <div className="absolute top-full left-0 mt-2 z-40 bg-white rounded-xl border border-[#E5E5E5] shadow-xl py-2 min-w-[180px]">
                                <div className="px-3 pb-2 mb-2 border-b border-[#E5E5E5]">
                                  <input
                                    type="text"
                                    placeholder="Add notes..."
                                    value={statusNotes}
                                    onChange={(e) =>
                                      setStatusNotes(e.target.value)
                                    }
                                    className="w-full px-2 py-1.5 text-[12px] bg-[#F8F6F0] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4C3A3]"
                                  />
                                </div>
                                {(
                                  [
                                    "pending",
                                    "confirmed",
                                    "processing",
                                    "shipped",
                                    "delivered",
                                    "cancelled",
                                  ] as OrderStatus[]
                                ).map((s) => (
                                  <button
                                    key={s}
                                    disabled={
                                      s === order.status ||
                                      updatingStatusId === order._id
                                    }
                                    onClick={() =>
                                      handleStatusUpdate(order._id, s)
                                    }
                                    className={`w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-[#F4F1ED] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
                                      s === order.status
                                        ? "font-bold text-[#6E421E]"
                                        : "text-[#6C6C6C]"
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${statusBadge[s].bg} border ${statusBadge[s].text}`}
                                    />
                                    {statusBadge[s].label}
                                    {updatingStatusId === order._id && (
                                      <Loader2 className="w-3 h-3 animate-spin ml-auto" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-[13px] font-medium text-[#6C6C6C]">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleOpenDrawer(order)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#D4C3A3]/20 text-[#A8A8A8] hover:text-[#6E421E] transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div
                        className={`lg:hidden p-4 border-b border-[#E5E5E5] ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[14px] font-bold text-[#1C1C1C]">
                              {order.orderNumber}
                            </p>
                            <p className="text-[12px] text-[#A8A8A8]">
                              {order.customer?.name}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-[13px] text-[#6C6C6C]">
                            <span>
                              {order.items?.length || 0}{" "}
                              {(order.items?.length || 0) === 1
                                ? "item"
                                : "items"}
                            </span>
                            <span className="font-bold text-[#1C1C1C]">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenDrawer(order)}
                            className="px-3 py-1.5 text-[12px] font-bold text-[#6E421E] bg-[#F4F1ED] rounded-lg hover:bg-[#EBE7DF] transition-colors"
                          >
                            View
                          </button>
                        </div>
                        <p className="text-[11px] text-[#A8A8A8] mt-2">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && !error && orders.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-[13px] font-semibold text-[#8C8C8C]">
                Showing{" "}
                <span className="text-[#1C1C1C]">{orders.length}</span> of{" "}
                <span className="text-[#1C1C1C]">{totalCount}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchOrders(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E5E5] shadow-sm">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => fetchOrders(page)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                          currentPage === page
                            ? "bg-[#6E421E] text-white shadow-md"
                            : "text-[#6C6C6C] hover:bg-[#F4F1ED]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => fetchOrders(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Detail Drawer */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isDrawerOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-[#1C1C1C]/40 backdrop-blur-sm"
            onClick={handleCloseDrawer}
          />
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-300 ease-in-out transform ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedOrder && (
              <>
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-[18px] font-bold text-[#1C1C1C]">
                      Order Details
                    </h2>
                    <p className="text-[13px] text-[#A8A8A8]">
                      {selectedOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseDrawer}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto relative">
                  {isDetailLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#6E421E] animate-spin" />
                    </div>
                  )}

                  <div className="p-6 space-y-6">
                    {/* Status badge */}
                    <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E5E5E5]/60 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#8C8C8C] uppercase tracking-wider">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${
                          statusBadge[selectedOrder.status].bg
                        } ${statusBadge[selectedOrder.status].text}`}
                      >
                        {statusBadge[selectedOrder.status].label}
                      </span>
                    </div>

                    {/* Quick Status Update */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-2">
                        Update Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ] as OrderStatus[]
                        ).map((s) => (
                          <button
                            key={s}
                            disabled={
                              s === selectedOrder.status ||
                              updatingStatusId === selectedOrder._id
                            }
                            onClick={() =>
                              handleStatusUpdate(selectedOrder._id, s)
                            }
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
                              s === selectedOrder.status
                                ? `${statusBadge[s].bg} ${statusBadge[s].text} border-current`
                                : "bg-white border-[#E5E5E5] text-[#6C6C6C] hover:bg-[#F4F1ED]"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {statusBadge[s].label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Status update notes (optional)..."
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-[13px] bg-[#F8F6F0] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4C3A3]"
                      />
                    </div>

                    {/* Customer Info */}
                    <div>
                      <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-3">
                        Customer
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[12px] text-[#A8A8A8]">Name</p>
                          <p className="text-[14px] font-semibold">
                            {selectedOrder.customer?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] text-[#A8A8A8]">Email</p>
                          <p className="text-[14px] font-semibold truncate">
                            {selectedOrder.customer?.email || "N/A"}
                          </p>
                        </div>
                        {selectedOrder.customer?.phone && (
                          <div>
                            <p className="text-[12px] text-[#A8A8A8]">Phone</p>
                            <p className="text-[14px] font-semibold">
                              {selectedOrder.customer.phone}
                            </p>
                          </div>
                        )}
                        {selectedOrder.customer?.address && (
                          <div className="col-span-2">
                            <p className="text-[12px] text-[#A8A8A8]">
                              Address
                            </p>
                            <p className="text-[14px] font-semibold">
                              {selectedOrder.customer.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-3">
                        Items ({selectedOrder.items?.length || 0})
                      </span>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#F8F6F0] rounded-xl border border-[#E5E5E5]/60"
                          >
                            <div className="w-12 h-12 bg-[#EBE7DF] rounded-lg flex items-center justify-center shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-[#A8A8A8]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#1C1C1C] truncate">
                                {item.name}
                              </p>
                              <p className="text-[12px] text-[#A8A8A8]">
                                Qty: {item.quantity} x{" "}
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="text-[14px] font-bold text-[#1C1C1C] shrink-0">
                              {formatCurrency(item.quantity * item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#E5E5E5] space-y-2">
                        {selectedOrder.subtotal !== undefined && (
                          <div className="flex justify-between text-[13px] text-[#6C6C6C]">
                            <span>Subtotal</span>
                            <span>
                              {formatCurrency(selectedOrder.subtotal)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.shippingCost !== undefined && (
                          <div className="flex justify-between text-[13px] text-[#6C6C6C]">
                            <span>Shipping</span>
                            <span>
                              {formatCurrency(selectedOrder.shippingCost)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-[15px] font-bold text-[#1C1C1C]">
                          <span>Total</span>
                          <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                          Delivery Schedule
                        </span>
                        <button
                          onClick={() => setEditingDelivery(!editingDelivery)}
                          className="text-[12px] font-bold text-[#6E421E] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {editingDelivery ? "Cancel" : "Edit"}
                        </button>
                      </div>
                      {editingDelivery ? (
                        <div className="space-y-3 bg-[#F8F6F0] p-4 rounded-xl border border-[#E5E5E5]/60">
                          <div>
                            <label className="block text-[12px] font-medium text-[#6C6C6C] mb-1">
                              Delivery Date
                            </label>
                            <input
                              type="date"
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                              className="w-full px-3 py-2 text-[14px] bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] font-medium text-[#6C6C6C] mb-1">
                              Time Slot
                            </label>
                            <select
                              value={deliveryTimeSlot}
                              onChange={(e) =>
                                setDeliveryTimeSlot(e.target.value)
                              }
                              className="w-full px-3 py-2 text-[14px] bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                            >
                              <option value="">Select time slot</option>
                              <option value="9:00 AM - 12:00 PM">
                                9:00 AM - 12:00 PM
                              </option>
                              <option value="12:00 PM - 3:00 PM">
                                12:00 PM - 3:00 PM
                              </option>
                              <option value="3:00 PM - 6:00 PM">
                                3:00 PM - 6:00 PM
                              </option>
                              <option value="6:00 PM - 9:00 PM">
                                6:00 PM - 9:00 PM
                              </option>
                            </select>
                          </div>
                          <button
                            onClick={handleDeliverySave}
                            disabled={isSavingDelivery}
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] disabled:opacity-50 transition-all"
                          >
                            {isSavingDelivery ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save Delivery Schedule
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 bg-[#F8F6F0] p-4 rounded-xl border border-[#E5E5E5]/60">
                          <div>
                            <p className="text-[12px] text-[#A8A8A8]">Date</p>
                            <p className="text-[14px] font-semibold">
                              {selectedOrder.deliveryDate
                                ? formatDate(selectedOrder.deliveryDate)
                                : "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[12px] text-[#A8A8A8]">
                              Time Slot
                            </p>
                            <p className="text-[14px] font-semibold">
                              {selectedOrder.deliveryTimeSlot || "Not set"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[12px] text-[#A8A8A8]">
                          Order Placed
                        </p>
                        <p className="text-[14px] font-semibold">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                      {selectedOrder.updatedAt && (
                        <div>
                          <p className="text-[12px] text-[#A8A8A8]">
                            Last Updated
                          </p>
                          <p className="text-[14px] font-semibold">
                            {formatDate(selectedOrder.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {toastConfig && (
          <Toast
            message={toastConfig.message}
            type={toastConfig.type}
            onClose={() => setToastConfig(null)}
          />
        )}
      </div>
    </div>
  );
}
