"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  LayoutGrid,
  Image as ImageIcon,
  Ruler,
  Sofa,
  ChevronDown,
  Check,
  Filter,
  Inbox,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

interface RoomTemplate {
  _id: string;
  name: string;
  description: string;
  style: string;
  roomType: string;
  dimensions: { width: number; length: number; height: number };
  previewImage: string;
  furnitureCount: number;
  createdAt: string;
}

interface TemplateForm {
  name: string;
  description: string;
  style: string;
  roomType: string;
  width: string;
  length: string;
  height: string;
  previewImage: string;
}

const STYLES = ["minimalist", "modern", "classic", "scandinavian", "industrial", "bohemian"] as const;
type Style = (typeof STYLES)[number];

const ROOM_TYPES = ["living_room", "bedroom", "kitchen", "bathroom", "office", "dining_room"] as const;

const styleConfig: Record<Style, { label: string; bg: string; text: string }> = {
  minimalist: { label: "Minimalist", bg: "bg-gray-100", text: "text-gray-700" },
  modern: { label: "Modern", bg: "bg-blue-100", text: "text-blue-700" },
  classic: { label: "Classic", bg: "bg-amber-100", text: "text-amber-700" },
  scandinavian: { label: "Scandinavian", bg: "bg-teal-100", text: "text-teal-700" },
  industrial: { label: "Industrial", bg: "bg-slate-200", text: "text-slate-700" },
  bohemian: { label: "Bohemian", bg: "bg-rose-100", text: "text-rose-700" },
};

const roomTypeLabels: Record<string, string> = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  office: "Office",
  dining_room: "Dining Room",
};

const emptyForm: TemplateForm = {
  name: "",
  description: "",
  style: "modern",
  roomType: "living_room",
  width: "",
  length: "",
  height: "",
  previewImage: "",
};

export default function RoomTemplatesPage() {
  const [templates, setTemplates] = useState<RoomTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RoomTemplate | null>(null);
  const [form, setForm] = useState<TemplateForm>({ ...emptyForm });
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TemplateForm, string>>>({});

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<RoomTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter dropdown
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get("/api/room-templates");
      setTemplates(res.data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load room templates. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const openCreateForm = () => {
    setEditingTemplate(null);
    setForm({ ...emptyForm });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (template: RoomTemplate) => {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      description: template.description,
      style: template.style,
      roomType: template.roomType,
      width: String(template.dimensions?.width || ""),
      length: String(template.dimensions?.length || ""),
      height: String(template.dimensions?.height || ""),
      previewImage: template.previewImage || "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof TemplateForm, string>> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.width || parseFloat(form.width) <= 0) errors.width = "Valid width required";
    if (!form.length || parseFloat(form.length) <= 0) errors.length = "Valid length required";
    if (!form.height || parseFloat(form.height) <= 0) errors.height = "Valid height required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setIsSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        style: form.style,
        roomType: form.roomType,
        dimensions: {
          width: parseFloat(form.width),
          length: parseFloat(form.length),
          height: parseFloat(form.height),
        },
        previewImage: form.previewImage.trim() || undefined,
      };

      if (editingTemplate) {
        await api.put(`/api/room-templates/${editingTemplate._id}`, payload);
        setToastConfig({ message: "Template updated successfully!", type: "success" });
      } else {
        await api.post("/api/room-templates", payload);
        setToastConfig({ message: "Template created successfully!", type: "success" });
      }
      setIsFormOpen(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to save template.";
      setToastConfig({ message: msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/api/room-templates/${deleteTarget._id}`);
      setToastConfig({ message: "Template deleted successfully!", type: "success" });
      setDeleteTarget(null);
      fetchTemplates();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete template.";
      setToastConfig({ message: msg, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = styleFilter === "all" || t.style === styleFilter;
    return matchesSearch && matchesStyle;
  });

  const updateField = (field: keyof TemplateForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#663F23]/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-[#663F23]" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">Room Templates</h1>
                <p className="text-[13px] font-medium text-[#8C8C8C]">Manage room template configurations</p>
              </div>
            </div>
            <button
              onClick={openCreateForm}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#663F23] text-white rounded-xl text-[13px] font-bold hover:bg-[#4A2D19] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full max-w-[500px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#A8A8A8]" />
              </div>
              <input
                type="text"
                placeholder="Search templates by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
              />
            </div>

            {/* Style Filter */}
            <div className="relative">
              <button
                onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[13px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm"
              >
                <Filter className="w-4 h-4" />
                {styleFilter === "all" ? "All Styles" : styleConfig[styleFilter as Style]?.label || styleFilter}
                <ChevronDown className={`w-4 h-4 transition-transform ${isStyleDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isStyleDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px]">
                  <button
                    onClick={() => {
                      setStyleFilter("all");
                      setIsStyleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium hover:bg-[#F5F1E8] transition-colors ${styleFilter === "all" ? "bg-[#F5F1E8] font-bold" : ""}`}
                  >
                    All Styles
                    {styleFilter === "all" && <Check className="w-4 h-4 text-[#663F23] ml-auto" />}
                  </button>
                  {STYLES.map((style) => {
                    const sc = styleConfig[style];
                    return (
                      <button
                        key={style}
                        onClick={() => {
                          setStyleFilter(style);
                          setIsStyleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium hover:bg-[#F5F1E8] transition-colors ${styleFilter === style ? "bg-[#F5F1E8] font-bold" : ""}`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${sc.bg}`} />
                        {sc.label}
                        {styleFilter === style && <Check className="w-4 h-4 text-[#663F23] ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile create button */}
            <button
              onClick={openCreateForm}
              className="sm:hidden flex items-center gap-2 px-5 py-3 bg-[#663F23] text-white rounded-xl text-[13px] font-bold hover:bg-[#4A2D19] transition-colors shadow-sm w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-[#663F23] animate-spin" />
              <p className="text-[#A8A8A8] font-medium">Loading templates...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-[#1C1C1C]">Something went wrong</h3>
                <p className="text-[#A8A8A8] mt-1">{error}</p>
              </div>
              <button
                onClick={fetchTemplates}
                className="px-6 py-2 bg-[#663F23] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
              >
                Try Again
              </button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Inbox className="w-16 h-16 text-[#EBE7DF]" />
              <div>
                <h3 className="text-lg font-bold text-[#1C1C1C]">No templates found</h3>
                <p className="text-[#A8A8A8] mt-1">
                  {searchQuery || styleFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first room template to get started."}
                </p>
              </div>
              {!searchQuery && styleFilter === "all" && (
                <button
                  onClick={openCreateForm}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#663F23] text-white rounded-xl text-[13px] font-bold hover:bg-[#4A2D19] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Template
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const sc = styleConfig[template.style as Style] || { label: template.style, bg: "bg-gray-100", text: "text-gray-700" };
                return (
                  <div
                    key={template._id}
                    className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all overflow-hidden group"
                  >
                    {/* Preview Image */}
                    <div className="h-44 bg-[#F5F1E8] relative overflow-hidden">
                      {template.previewImage ? (
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-10 h-10 text-[#D4C3A3]" />
                          <span className="text-[12px] font-medium text-[#A8A8A8]">No preview</span>
                        </div>
                      )}

                      {/* Style Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${sc.bg} ${sc.text} shadow-sm`}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditForm(template)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-[#663F23] hover:bg-white shadow-sm transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(template)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-red-500 hover:bg-white shadow-sm transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#1C1C1C] truncate">{template.name}</h3>
                        <p className="text-[12px] text-[#8C8C8C] mt-0.5 line-clamp-2">{template.description}</p>
                      </div>

                      <div className="flex items-center gap-3 text-[12px] font-medium text-[#6C6C6C]">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F1E8] rounded-md">
                          <LayoutGrid className="w-3 h-3" />
                          {roomTypeLabels[template.roomType] || template.roomType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F1E8] rounded-md">
                          <Ruler className="w-3 h-3" />
                          {template.dimensions?.width}x{template.dimensions?.length}x{template.dimensions?.height}m
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]/50">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#663F23]">
                          <Sofa className="w-3.5 h-3.5" />
                          {template.furnitureCount} item{template.furnitureCount !== 1 ? "s" : ""}
                        </span>
                        <span className="text-[11px] font-medium text-[#A8A8A8]">
                          {new Date(template.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Poppins',_sans-serif]">
          <div
            className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSaving && setIsFormOpen(false)}
          />
          <div className="relative bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E5E5E5]/60 flex items-center justify-between bg-white rounded-t-2xl">
              <div>
                <h3 className="text-[18px] font-bold text-[#1C1C1C]">
                  {editingTemplate ? "Edit Template" : "Create Template"}
                </h3>
                <p className="text-[13px] text-[#8C8C8C] mt-0.5">
                  {editingTemplate ? "Update template details" : "Add a new room template"}
                </p>
              </div>
              <button
                onClick={() => !isSaving && setIsFormOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g., Modern Living Room"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all ${formErrors.name ? "border-red-400" : "border-[#E5E5E5]"}`}
                />
                {formErrors.name && <p className="text-[11px] text-red-500 font-medium mt-1">{formErrors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Brief description of the template..."
                  rows={3}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all resize-none ${formErrors.description ? "border-red-400" : "border-[#E5E5E5]"}`}
                />
                {formErrors.description && <p className="text-[11px] text-red-500 font-medium mt-1">{formErrors.description}</p>}
              </div>

              {/* Style & Room Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                    Style
                  </label>
                  <select
                    value={form.style}
                    onChange={(e) => updateField("style", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-medium text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all appearance-none cursor-pointer"
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s}>
                        {styleConfig[s].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                    Room Type
                  </label>
                  <select
                    value={form.roomType}
                    onChange={(e) => updateField("roomType", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-medium text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all appearance-none cursor-pointer"
                  >
                    {ROOM_TYPES.map((rt) => (
                      <option key={rt} value={rt}>
                        {roomTypeLabels[rt]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                  Dimensions (meters) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.width}
                      onChange={(e) => updateField("width", e.target.value)}
                      placeholder="Width"
                      className={`w-full px-3 py-3 bg-white border rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all ${formErrors.width ? "border-red-400" : "border-[#E5E5E5]"}`}
                    />
                    <span className="text-[10px] text-[#A8A8A8] mt-0.5 block">Width</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.length}
                      onChange={(e) => updateField("length", e.target.value)}
                      placeholder="Length"
                      className={`w-full px-3 py-3 bg-white border rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all ${formErrors.length ? "border-red-400" : "border-[#E5E5E5]"}`}
                    />
                    <span className="text-[10px] text-[#A8A8A8] mt-0.5 block">Length</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      placeholder="Height"
                      className={`w-full px-3 py-3 bg-white border rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all ${formErrors.height ? "border-red-400" : "border-[#E5E5E5]"}`}
                    />
                    <span className="text-[10px] text-[#A8A8A8] mt-0.5 block">Height</span>
                  </div>
                </div>
              </div>

              {/* Preview Image URL */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-1.5">
                  Preview Image URL
                </label>
                <input
                  type="text"
                  value={form.previewImage}
                  onChange={(e) => updateField("previewImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 transition-all"
                />
                {form.previewImage && (
                  <div className="mt-2 h-24 rounded-lg bg-[#F5F1E8] border border-[#E5E5E5] overflow-hidden">
                    <img
                      src={form.previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E5E5]/60 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => setIsFormOpen(false)}
                disabled={isSaving}
                className="px-4 py-2.5 text-[13px] font-bold text-[#1C1C1C] bg-transparent border border-[#E5E5E5] rounded-xl hover:bg-[#F5F1E8] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-[#663F23] rounded-xl hover:bg-[#4A2D19] transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : editingTemplate ? "Update Template" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Template"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toastConfig && (
        <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />
      )}
    </div>
  );
}
