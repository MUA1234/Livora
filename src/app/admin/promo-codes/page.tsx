"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  AlertCircle,
  Inbox,
  Plus,
  Edit3,
  Trash2,
  X,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

interface PromoCode {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
}

interface PromoFormData {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxUses: number;
  expiresAt: string;
}

const emptyForm: PromoFormData = {
  code: "",
  type: "percentage",
  value: 0,
  minOrderAmount: 0,
  maxUses: 0,
  expiresAt: "",
};

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<PromoFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPromoCodes = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, string | number> = { page, limit: 10 };
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const response = await api.get("/api/promo-codes", { params });
        const res = response.data;
        const innerData = res.data || res;

        setPromoCodes(innerData?.codes || innerData || []);
        const pag = innerData?.pagination || res.pagination;
        if (pag) {
          setCurrentPage(pag.page || 1);
          setTotalPages(pag.pages || 1);
          setTotalCount(pag.total || 0);
        } else {
          const arr = innerData?.codes || innerData || [];
          setTotalCount(Array.isArray(arr) ? arr.length : 0);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (err: unknown) {
        console.error("Fetch promo codes error:", err);
        setError("Failed to load promo codes.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    fetchPromoCodes(1);
  }, [fetchPromoCodes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPromoCodes(1);
  };

  // Form handlers
  const openCreateModal = () => {
    setEditingPromo(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrderAmount: promo.minOrderAmount,
      maxUses: promo.maxUses,
      expiresAt: promo.expiresAt ? promo.expiresAt.split("T")[0] : "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromo(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (formData.value <= 0) errors.value = "Value must be greater than 0";
    if (formData.type === "percentage" && formData.value > 100)
      errors.value = "Percentage cannot exceed 100";
    if (!formData.expiresAt) errors.expiresAt = "Expiry date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
      };

      if (editingPromo) {
        await api.put(`/api/promo-codes/${editingPromo._id}`, payload);
        setToastConfig({
          message: "Promo code updated successfully.",
          type: "success",
        });
      } else {
        await api.post("/api/promo-codes", payload);
        setToastConfig({
          message: "Promo code created successfully.",
          type: "success",
        });
      }

      closeModal();
      fetchPromoCodes(currentPage);
    } catch {
      setToastConfig({
        message: editingPromo
          ? "Failed to update promo code."
          : "Failed to create promo code.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/api/promo-codes/${deleteTarget._id}`);
      setToastConfig({
        message: "Promo code deleted.",
        type: "success",
      });
      setDeleteTarget(null);
      fetchPromoCodes(currentPage);
    } catch {
      setToastConfig({
        message: "Failed to delete promo code.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (promo: PromoCode) => {
    try {
      setTogglingId(promo._id);
      await api.put(`/api/promo-codes/${promo._id}`, {
        isActive: !promo.isActive,
      });
      setToastConfig({
        message: `Promo code ${!promo.isActive ? "activated" : "deactivated"}.`,
        type: "success",
      });
      fetchPromoCodes(currentPage);
    } catch {
      setToastConfig({
        message: "Failed to toggle promo code.",
        type: "error",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isExpired = (d: string) => new Date(d) < new Date();

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-['Poppins',_sans-serif] text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">
                Promo Codes
              </h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">
                Create and manage promotional discount codes
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Promo Code</span>
            </button>
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
                placeholder="Search promo codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchPromoCodes(1)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </form>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            {/* Desktop Header */}
            <div className="hidden lg:grid grid-cols-[1fr_0.7fr_0.6fr_0.7fr_0.6fr_0.5fr_0.7fr_0.5fr_0.6fr] items-center px-6 py-4 bg-white border-b border-[#E5E5E5]">
              {[
                "Code",
                "Type",
                "Value",
                "Min Order",
                "Max Uses",
                "Used",
                "Expires",
                "Status",
              ].map((label) => (
                <div
                  key={label}
                  className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest"
                >
                  {label}
                </div>
              ))}
              <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">
                Actions
              </div>
            </div>

            <div className="flex flex-col">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-[#6E421E] animate-spin" />
                  <p className="text-[#A8A8A8] font-medium">
                    Loading promo codes...
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
                    onClick={() => fetchPromoCodes(currentPage)}
                    className="px-6 py-2 bg-[#6E421E] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              ) : promoCodes.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Inbox className="w-12 h-12 text-[#EBE7DF]" />
                  <p className="text-[#A8A8A8] font-semibold">
                    No promo codes found
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] transition-all"
                  >
                    Create First Promo Code
                  </button>
                </div>
              ) : (
                promoCodes.map((promo, idx, arr) => {
                  const expired = isExpired(promo.expiresAt);
                  return (
                    <React.Fragment key={promo._id}>
                      {/* Desktop Row */}
                      <div
                        className={`hidden lg:grid grid-cols-[1fr_0.7fr_0.6fr_0.7fr_0.6fr_0.5fr_0.7fr_0.5fr_0.6fr] items-center px-6 py-4 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#A8A8A8]" />
                          <span className="text-[14px] font-bold text-[#1C1C1C] font-mono">
                            {promo.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {promo.type === "percentage" ? (
                            <Percent className="w-3.5 h-3.5 text-[#A8A8A8]" />
                          ) : (
                            <DollarSign className="w-3.5 h-3.5 text-[#A8A8A8]" />
                          )}
                          <span className="text-[13px] font-medium text-[#6C6C6C] capitalize">
                            {promo.type}
                          </span>
                        </div>
                        <div className="text-[14px] font-bold text-[#1C1C1C]">
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : `$${promo.value.toFixed(2)}`}
                        </div>
                        <div className="text-[13px] font-medium text-[#6C6C6C]">
                          ${promo.minOrderAmount.toFixed(2)}
                        </div>
                        <div className="text-[13px] font-medium text-[#6C6C6C]">
                          {promo.maxUses || "Unlimited"}
                        </div>
                        <div className="text-[13px] font-bold text-[#1C1C1C]">
                          {promo.usedCount}
                        </div>
                        <div>
                          <span
                            className={`text-[13px] font-medium ${
                              expired ? "text-red-500" : "text-[#6C6C6C]"
                            }`}
                          >
                            {formatDate(promo.expiresAt)}
                          </span>
                          {expired && (
                            <span className="block text-[10px] font-bold text-red-500 uppercase">
                              Expired
                            </span>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => handleToggleActive(promo)}
                            disabled={togglingId === promo._id}
                            className="flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {promo.isActive ? (
                              <ToggleRight className="w-6 h-6 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-[#A8A8A8]" />
                            )}
                            <span
                              className={`text-[12px] font-bold ${
                                promo.isActive
                                  ? "text-green-700"
                                  : "text-[#A8A8A8]"
                              }`}
                            >
                              {promo.isActive ? "Active" : "Inactive"}
                            </span>
                          </button>
                        </div>
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(promo)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#D4C3A3]/20 text-[#A8A8A8] hover:text-[#6E421E] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(promo)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#A8A8A8] hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div
                        className={`lg:hidden p-4 border-b border-[#E5E5E5] space-y-3 ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[15px] font-bold text-[#1C1C1C] font-mono">
                              {promo.code}
                            </p>
                            <p className="text-[13px] text-[#6C6C6C] capitalize">
                              {promo.type} -{" "}
                              {promo.type === "percentage"
                                ? `${promo.value}%`
                                : `$${promo.value.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(promo)}
                              disabled={togglingId === promo._id}
                              className="disabled:opacity-50"
                            >
                              {promo.isActive ? (
                                <ToggleRight className="w-6 h-6 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-[#A8A8A8]" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#A8A8A8]">
                          <span>
                            Min: <strong>${promo.minOrderAmount}</strong>
                          </span>
                          <span>
                            Uses: <strong>{promo.usedCount}</strong>/
                            {promo.maxUses || "Unlimited"}
                          </span>
                          <span className={expired ? "text-red-500" : ""}>
                            Expires: {formatDate(promo.expiresAt)}
                            {expired && " (Expired)"}
                          </span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(promo)}
                            className="px-3 py-1.5 text-[12px] font-bold text-[#6E421E] bg-[#F4F1ED] rounded-lg hover:bg-[#EBE7DF] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(promo)}
                            className="px-3 py-1.5 text-[12px] font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && !error && promoCodes.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-[13px] font-semibold text-[#8C8C8C]">
                Showing{" "}
                <span className="text-[#1C1C1C]">{promoCodes.length}</span> of{" "}
                <span className="text-[#1C1C1C]">{totalCount}</span> promo
                codes
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchPromoCodes(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E5E5] shadow-sm">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => {
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
                          onClick={() => fetchPromoCodes(page)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                            currentPage === page
                              ? "bg-[#6E421E] text-white shadow-md"
                              : "text-[#6C6C6C] hover:bg-[#F4F1ED]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() => fetchPromoCodes(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-[#1C1C1C]">
                  {editingPromo ? "Edit Promo Code" : "Create Promo Code"}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Code */}
                <div>
                  <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g. SUMMER2024"
                    className={`w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 font-mono uppercase ${
                      formErrors.code
                        ? "border-red-400"
                        : "border-[#E5E5E5]"
                    }`}
                  />
                  {formErrors.code && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {formErrors.code}
                    </p>
                  )}
                </div>

                {/* Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "percentage" | "fixed",
                        })
                      }
                      className="w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                      Value {formData.type === "percentage" ? "(%)" : "($)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={formData.type === "percentage" ? 1 : 0.01}
                      max={formData.type === "percentage" ? 100 : undefined}
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 ${
                        formErrors.value
                          ? "border-red-400"
                          : "border-[#E5E5E5]"
                      }`}
                    />
                    {formErrors.value && (
                      <p className="text-[12px] text-red-500 mt-1">
                        {formErrors.value}
                      </p>
                    )}
                  </div>
                </div>

                {/* Min Order + Max Uses */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                      Min Order ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.minOrderAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minOrderAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                      Max Uses
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.maxUses}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxUses: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0 = unlimited"
                      className="w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className={`w-full px-4 py-3 text-[14px] bg-[#F8F6F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 ${
                      formErrors.expiresAt
                        ? "border-red-400"
                        : "border-[#E5E5E5]"
                    }`}
                  />
                  {formErrors.expiresAt && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {formErrors.expiresAt}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-[13px] font-bold text-[#6C6C6C] bg-transparent border border-[#E5E5E5] rounded-xl hover:bg-[#F4F1ED] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] disabled:opacity-50 transition-all"
                  >
                    {isSaving && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {editingPromo ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <ConfirmModal
            title="Delete Promo Code"
            message={`Are you sure you want to delete the promo code "${deleteTarget.code}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

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
