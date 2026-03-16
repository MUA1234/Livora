"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  AlertCircle,
  Inbox,
  Package,
  AlertTriangle,
  XCircle,
  Check,
  X,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  BarChart3,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  category?: string;
  price?: number;
  image?: string;
}

interface InventoryStats {
  total: number;
  lowStock: number;
  outOfStock: number;
}

interface ParsedCSVRow {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
}

interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
}

type FilterTab = "all" | "lowStock" | "outOfStock";

export default function InventoryManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
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

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvData, setCsvData] = useState<ParsedCSVRow[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchInventory = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, string | number> = { page, limit: 15 };
        if (filterTab === "lowStock") params.filter = "lowStock";
        if (filterTab === "outOfStock") params.filter = "outOfStock";
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const response = await api.get("/api/inventory", { params });
        const { data, stats: apiStats, pagination } = response.data;

        setProducts(data || []);
        if (apiStats) setStats(apiStats);
        setCurrentPage(pagination?.page || 1);
        setTotalPages(pagination?.pages || 1);
        setTotalCount(pagination?.total || 0);
      } catch (err: unknown) {
        console.error("Fetch inventory error:", err);
        setError("Failed to load inventory. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    [filterTab, searchQuery]
  );

  useEffect(() => {
    fetchInventory(1);
  }, [filterTab, fetchInventory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInventory(1);
  };

  const startEditing = (product: Product) => {
    setEditingId(product._id);
    setEditStock(product.stock);
    setEditThreshold(product.lowStockThreshold);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSaveStock = async (productId: string) => {
    try {
      setIsSaving(true);
      await api.put(`/api/inventory/${productId}/stock`, {
        stock: editStock,
        lowStockThreshold: editThreshold,
      });
      setToastConfig({ message: "Stock updated successfully.", type: "success" });
      setEditingId(null);
      fetchInventory(currentPage);
    } catch {
      setToastConfig({ message: "Failed to update stock.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0)
      return { color: "bg-red-500", label: "Out of Stock", textColor: "text-red-700" };
    if (product.stock <= product.lowStockThreshold)
      return { color: "bg-yellow-500", label: "Low Stock", textColor: "text-yellow-700" };
    return { color: "bg-green-500", label: "In Stock", textColor: "text-green-700" };
  };

  // CSV Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        setToastConfig({ message: "CSV file is empty or has no data rows.", type: "error" });
        return;
      }

      // Skip header row
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        return {
          name: cols[0] || "",
          sku: cols[1] || "",
          category: cols[2] || "",
          price: cols[3] || "0",
          stock: cols[4] || "0",
        };
      });

      setCsvData(rows);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (csvData.length === 0) return;

    try {
      setIsImporting(true);
      const payload = {
        products: csvData.map((row) => ({
          name: row.name,
          sku: row.sku,
          category: row.category,
          price: parseFloat(row.price) || 0,
          stock: parseInt(row.stock) || 0,
        })),
      };

      const response = await api.post("/api/inventory/bulk-import", payload);
      const result = response.data;
      setImportResult({
        created: result.created || 0,
        updated: result.updated || 0,
        errors: result.errors || [],
      });
      setToastConfig({
        message: `Import complete: ${result.created || 0} created, ${result.updated || 0} updated.`,
        type: "success",
      });
      fetchInventory(1);
    } catch {
      setToastConfig({ message: "Bulk import failed.", type: "error" });
    } finally {
      setIsImporting(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setCsvData([]);
    setCsvFileName("");
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const statCards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: <Package className="w-6 h-6" />,
      color: "text-[#6E421E]",
      bg: "bg-[#6E421E]/10",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: <XCircle className="w-6 h-6" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-['Poppins',_sans-serif] text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">
                Inventory Management
              </h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">
                Monitor stock levels and manage product inventory
              </p>
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Import</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-[24px] font-bold text-[#1C1C1C]">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {(
              [
                { value: "all", label: "All Products", icon: <Package className="w-4 h-4" /> },
                { value: "lowStock", label: "Low Stock", icon: <AlertTriangle className="w-4 h-4" /> },
                { value: "outOfStock", label: "Out of Stock", icon: <XCircle className="w-4 h-4" /> },
              ] as { value: FilterTab; label: string; icon: React.ReactNode }[]
            ).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filterTab === tab.value
                    ? "bg-[#6E421E] text-white shadow-sm"
                    : "bg-[#F4F1ED] text-[#8C8C8C] hover:bg-[#EBE7DF]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

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
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchInventory(1)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </form>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            {/* Desktop Header */}
            <div className="hidden lg:grid grid-cols-[1.5fr_0.8fr_0.7fr_0.7fr_0.7fr_0.5fr] items-center px-8 py-4 bg-white border-b border-[#E5E5E5]">
              {[
                "Product",
                "SKU",
                "Stock",
                "Threshold",
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
                    Loading inventory...
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
                    onClick={() => fetchInventory(currentPage)}
                    className="px-6 py-2 bg-[#6E421E] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Inbox className="w-12 h-12 text-[#EBE7DF]" />
                  <p className="text-[#A8A8A8] font-semibold">
                    No products found
                  </p>
                </div>
              ) : (
                products.map((product, idx, arr) => {
                  const stockStatus = getStockStatus(product);
                  const isEditing = editingId === product._id;

                  return (
                    <React.Fragment key={product._id}>
                      {/* Desktop Row */}
                      <div
                        className={`hidden lg:grid grid-cols-[1.5fr_0.8fr_0.7fr_0.7fr_0.7fr_0.5fr] items-center px-8 py-4 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-[#F5F1E8] rounded-lg flex items-center justify-center shrink-0 border border-[#EBE7DF]">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-[#A8A8A8]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[#1C1C1C] truncate">
                              {product.name}
                            </p>
                            {product.category && (
                              <p className="text-[11px] text-[#A8A8A8]">
                                {product.category}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-[14px] font-medium text-[#6C6C6C]">
                          {product.sku}
                        </div>
                        <div>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={editStock}
                              onChange={(e) =>
                                setEditStock(parseInt(e.target.value) || 0)
                              }
                              className="w-20 px-2 py-1.5 text-[14px] bg-[#F8F6F0] border border-[#D4C3A3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                            />
                          ) : (
                            <span className="text-[14px] font-bold text-[#1C1C1C]">
                              {product.stock}
                            </span>
                          )}
                        </div>
                        <div>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={editThreshold}
                              onChange={(e) =>
                                setEditThreshold(parseInt(e.target.value) || 0)
                              }
                              className="w-20 px-2 py-1.5 text-[14px] bg-[#F8F6F0] border border-[#D4C3A3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50"
                            />
                          ) : (
                            <span className="text-[14px] font-medium text-[#6C6C6C]">
                              {product.lowStockThreshold}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${stockStatus.color}`}
                          />
                          <span
                            className={`text-[12px] font-bold ${stockStatus.textColor}`}
                          >
                            {stockStatus.label}
                          </span>
                        </div>
                        <div className="flex justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveStock(product._id)}
                                disabled={isSaving}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                              >
                                {isSaving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditing(product)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#D4C3A3]/20 text-[#A8A8A8] hover:text-[#6E421E] transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div
                        className={`lg:hidden p-4 border-b border-[#E5E5E5] ${
                          idx === arr.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold text-[#1C1C1C] truncate">
                              {product.name}
                            </p>
                            <p className="text-[12px] text-[#A8A8A8]">
                              SKU: {product.sku}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${stockStatus.color}`}
                            />
                            <span
                              className={`text-[12px] font-bold ${stockStatus.textColor}`}
                            >
                              {stockStatus.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-[13px] text-[#6C6C6C]">
                            <span>
                              Stock:{" "}
                              <strong className="text-[#1C1C1C]">
                                {product.stock}
                              </strong>
                            </span>
                            <span>
                              Threshold:{" "}
                              <strong>{product.lowStockThreshold}</strong>
                            </span>
                          </div>
                          <button
                            onClick={() => startEditing(product)}
                            className="px-3 py-1.5 text-[12px] font-bold text-[#6E421E] bg-[#F4F1ED] rounded-lg hover:bg-[#EBE7DF] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        {isEditing && (
                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={editStock}
                              onChange={(e) =>
                                setEditStock(parseInt(e.target.value) || 0)
                              }
                              placeholder="Stock"
                              className="flex-1 px-3 py-2 text-[13px] bg-[#F8F6F0] border border-[#D4C3A3] rounded-lg focus:outline-none"
                            />
                            <input
                              type="number"
                              min={0}
                              value={editThreshold}
                              onChange={(e) =>
                                setEditThreshold(parseInt(e.target.value) || 0)
                              }
                              placeholder="Threshold"
                              className="flex-1 px-3 py-2 text-[13px] bg-[#F8F6F0] border border-[#D4C3A3] rounded-lg focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveStock(product._id)}
                              disabled={isSaving}
                              className="px-3 py-2 bg-[#6E421E] text-white rounded-lg text-[13px] font-bold disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-[13px] font-bold"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && !error && products.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-[13px] font-semibold text-[#8C8C8C]">
                Showing{" "}
                <span className="text-[#1C1C1C]">{products.length}</span> of{" "}
                <span className="text-[#1C1C1C]">{totalCount}</span> products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchInventory(currentPage - 1)}
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
                          onClick={() => fetchInventory(page)}
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
                  onClick={() => fetchInventory(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm"
              onClick={closeImportModal}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1C1C1C]">
                    Bulk Import Products
                  </h2>
                  <p className="text-[13px] text-[#A8A8A8]">
                    Upload a CSV file to import products in bulk
                  </p>
                </div>
                <button
                  onClick={closeImportModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* CSV Format Info */}
                <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E5E5E5]/60">
                  <p className="text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-2">
                    CSV Format
                  </p>
                  <code className="block text-[12px] text-[#1C1C1C] bg-white p-3 rounded-lg border border-[#E5E5E5] font-mono">
                    name, sku, category, price, stock
                    <br />
                    Oak Dining Table, ODT-001, Furniture, 599.99, 25
                    <br />
                    Velvet Sofa, VS-002, Furniture, 1299.99, 12
                  </code>
                </div>

                {/* File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-[#D4C3A3] rounded-xl bg-[#F8F6F0] hover:bg-[#F4F1ED] transition-colors cursor-pointer"
                  >
                    <FileText className="w-8 h-8 text-[#A8A8A8]" />
                    <div className="text-center">
                      <p className="text-[14px] font-bold text-[#6C6C6C]">
                        {csvFileName || "Click to upload CSV file"}
                      </p>
                      <p className="text-[12px] text-[#A8A8A8] mt-1">
                        Supports .csv files
                      </p>
                    </div>
                  </button>
                </div>

                {/* Preview Table */}
                {csvData.length > 0 && (
                  <div>
                    <p className="text-[12px] font-bold text-[#6C6C6C] uppercase tracking-wider mb-3">
                      Preview ({csvData.length} rows)
                    </p>
                    <div className="overflow-x-auto border border-[#E5E5E5] rounded-xl">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="bg-[#F8F6F0] border-b border-[#E5E5E5]">
                            <th className="text-left px-4 py-3 font-bold text-[#A8A8A8] text-[11px] uppercase">
                              Name
                            </th>
                            <th className="text-left px-4 py-3 font-bold text-[#A8A8A8] text-[11px] uppercase">
                              SKU
                            </th>
                            <th className="text-left px-4 py-3 font-bold text-[#A8A8A8] text-[11px] uppercase">
                              Category
                            </th>
                            <th className="text-right px-4 py-3 font-bold text-[#A8A8A8] text-[11px] uppercase">
                              Price
                            </th>
                            <th className="text-right px-4 py-3 font-bold text-[#A8A8A8] text-[11px] uppercase">
                              Stock
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.slice(0, 10).map((row, i) => (
                            <tr
                              key={i}
                              className="border-b border-[#E5E5E5] last:border-b-0"
                            >
                              <td className="px-4 py-2.5 font-medium">
                                {row.name}
                              </td>
                              <td className="px-4 py-2.5 text-[#6C6C6C]">
                                {row.sku}
                              </td>
                              <td className="px-4 py-2.5 text-[#6C6C6C]">
                                {row.category}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                ${row.price}
                              </td>
                              <td className="px-4 py-2.5 text-right font-bold">
                                {row.stock}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {csvData.length > 10 && (
                        <div className="px-4 py-2 text-center text-[12px] text-[#A8A8A8] bg-[#F8F6F0] border-t border-[#E5E5E5]">
                          ...and {csvData.length - 10} more rows
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E5E5E5]/60 space-y-2">
                    <p className="text-[14px] font-bold text-[#1C1C1C]">
                      Import Results
                    </p>
                    <div className="flex gap-4">
                      <span className="text-[13px] text-green-700">
                        <strong>{importResult.created}</strong> created
                      </span>
                      <span className="text-[13px] text-blue-700">
                        <strong>{importResult.updated}</strong> updated
                      </span>
                      {importResult.errors.length > 0 && (
                        <span className="text-[13px] text-red-700">
                          <strong>{importResult.errors.length}</strong> errors
                        </span>
                      )}
                    </div>
                    {importResult.errors.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {importResult.errors.map((err, i) => (
                          <p
                            key={i}
                            className="text-[12px] text-red-600"
                          >
                            {err}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#E5E5E5] flex justify-end gap-3">
                <button
                  onClick={closeImportModal}
                  className="px-5 py-2.5 text-[13px] font-bold text-[#6C6C6C] bg-transparent border border-[#E5E5E5] rounded-xl hover:bg-[#F4F1ED] transition-colors"
                >
                  Close
                </button>
                {csvData.length > 0 && !importResult && (
                  <button
                    onClick={handleBulkImport}
                    disabled={isImporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6E421E] text-white rounded-xl text-[13px] font-bold hover:bg-[#5A3518] disabled:opacity-50 transition-all"
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Import {csvData.length} Products
                  </button>
                )}
              </div>
            </div>
          </div>
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
