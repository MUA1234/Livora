"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Clock,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  LogIn,
  Download,
  Upload,
  ShieldCheck,
  Layers,
  AlertCircle,
  Activity,
  X,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

interface AuditChange {
  before?: Record<string, any>;
  after?: Record<string, any>;
  summary?: string;
}

interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  targetModel: string;
  targetId: string;
  targetName: string;
  changes: AuditChange;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ACTION_TYPES = [
  "create",
  "update",
  "delete",
  "status_change",
  "login",
  "export",
  "import",
  "role_change",
  "bulk_update",
] as const;

const TARGET_MODELS = [
  "Product",
  "Order",
  "User",
  "Design",
  "Consultation",
  "PromoCode",
  "RoomTemplate",
] as const;

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  create: {
    label: "Created",
    icon: <Plus className="w-3.5 h-3.5" />,
    color: "text-green-700",
    bg: "bg-green-50",
  },
  update: {
    label: "Updated",
    icon: <Pencil className="w-3.5 h-3.5" />,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  delete: {
    label: "Deleted",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "text-red-700",
    bg: "bg-red-50",
  },
  status_change: {
    label: "Status Changed",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  login: {
    label: "Logged In",
    icon: <LogIn className="w-3.5 h-3.5" />,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  export: {
    label: "Exported",
    icon: <Download className="w-3.5 h-3.5" />,
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  import: {
    label: "Imported",
    icon: <Upload className="w-3.5 h-3.5" />,
    color: "text-cyan-700",
    bg: "bg-cyan-50",
  },
  role_change: {
    label: "Role Changed",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  bulk_update: {
    label: "Bulk Updated",
    icon: <Layers className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
};

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getActionDescription(log: AuditLog): string {
  const config = ACTION_CONFIG[log.action];
  const label = config?.label || log.action;
  const target = log.targetName || log.targetId || "";
  const model = log.targetModel || "";

  if (log.action === "login") return `${label}`;
  if (target) return `${label} ${model} "${target}"`;
  return `${label} ${model}`;
}

export default function AuditLogPage() {
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, any> = { page, limit: 20 };
        if (actionFilter !== "all") params.action = actionFilter;
        if (modelFilter !== "all") params.targetModel = modelFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await api.get("/api/audit-logs", { params });
        setLogs(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        setError("Failed to load audit logs");
        setToastConfig({ message: "Failed to load audit logs", type: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [actionFilter, modelFilter, searchQuery]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    fetchLogs(page);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setModelFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    actionFilter !== "all" ||
    modelFilter !== "all";

  const renderChanges = (changes: AuditChange) => {
    if (!changes) return null;

    if (changes.summary) {
      return (
        <p className="text-xs text-[#555] bg-[#F8F6F0] rounded-lg p-3 mt-2">
          {changes.summary}
        </p>
      );
    }

    const beforeKeys = changes.before ? Object.keys(changes.before) : [];
    const afterKeys = changes.after ? Object.keys(changes.after) : [];
    const allKeys = [...new Set([...beforeKeys, ...afterKeys])];

    if (allKeys.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {changes.before && Object.keys(changes.before).length > 0 && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-2">
                Before
              </p>
              <div className="space-y-1">
                {Object.entries(changes.before).map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-[11px] text-red-500 font-medium min-w-[80px]">
                      {key}:
                    </span>
                    <span className="text-[11px] text-red-700 break-all">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {changes.after && Object.keys(changes.after).length > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-2">
                After
              </p>
              <div className="space-y-1">
                {Object.entries(changes.after).map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-[11px] text-green-500 font-medium min-w-[80px]">
                      {key}:
                    </span>
                    <span className="text-[11px] text-green-700 break-all">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, pages: totalPages } = pagination;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-[#663F23]" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                  Activity Log
                </h1>
                <p className="text-xs sm:text-sm text-[#888] mt-0.5">
                  Track all system activities and changes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden p-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-[#663F23] text-white"
                  : "hover:bg-[#F5F1E8] text-[#666]"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div
          className={`bg-white border-b border-[#E5E5E5]/60 transition-all ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="px-4 sm:px-6 md:px-10 py-3 pl-14 md:pl-10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                <input
                  type="text"
                  placeholder="Search by user or target name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#663F23]/20 focus:border-[#663F23] transition-all placeholder:text-[#aaa]"
                />
              </div>

              {/* Action Filter */}
              <div className="relative">
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#663F23]/20 focus:border-[#663F23] transition-all cursor-pointer"
                >
                  <option value="all">All Actions</option>
                  {ACTION_TYPES.map((a) => (
                    <option key={a} value={a}>
                      {ACTION_CONFIG[a]?.label || a}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999] pointer-events-none" />
              </div>

              {/* Model Filter */}
              <div className="relative">
                <select
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#663F23]/20 focus:border-[#663F23] transition-all cursor-pointer"
                >
                  <option value="all">All Models</option>
                  {TARGET_MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999] pointer-events-none" />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#663F23] hover:bg-[#F5F1E8] rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 sm:mx-6 md:mx-10 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => fetchLogs(1)}
              className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-10 py-6 pl-14 md:pl-10 flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5]/40 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-64 bg-gray-200 rounded" />
                      <div className="h-2 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#888]">
              <Activity className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-base font-medium mb-1">No activity found</p>
              <p className="text-sm">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Activity logs will appear here"}
              </p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-[#888]">
                  Showing {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} entries
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#E5E5E5] hidden sm:block" />

                <div className="space-y-3">
                  {logs.map((log) => {
                    const config = ACTION_CONFIG[log.action] || {
                      label: log.action,
                      icon: <Clock className="w-3.5 h-3.5" />,
                      color: "text-gray-700",
                      bg: "bg-gray-50",
                    };
                    const isExpanded = expandedId === log._id;
                    const hasChanges =
                      log.changes &&
                      (log.changes.summary ||
                        (log.changes.before &&
                          Object.keys(log.changes.before).length > 0) ||
                        (log.changes.after &&
                          Object.keys(log.changes.after).length > 0));

                    return (
                      <div
                        key={log._id}
                        className="relative sm:pl-10"
                      >
                        {/* Timeline dot */}
                        <div
                          className={`absolute left-[11px] top-5 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm hidden sm:flex items-center justify-center ${config.bg}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              log.action === "create"
                                ? "bg-green-500"
                                : log.action === "delete"
                                ? "bg-red-500"
                                : log.action === "update"
                                ? "bg-blue-500"
                                : log.action === "login"
                                ? "bg-purple-500"
                                : "bg-[#663F23]"
                            }`}
                          />
                        </div>

                        <div
                          className={`bg-white rounded-xl shadow-sm border transition-all ${
                            isExpanded
                              ? "border-[#663F23]/30 shadow-md"
                              : "border-[#E5E5E5]/40 hover:shadow-md"
                          }`}
                        >
                          <div
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              hasChanges &&
                              setExpandedId(isExpanded ? null : log._id)
                            }
                          >
                            <div className="flex items-start gap-3">
                              {/* User Avatar */}
                              <div className="w-9 h-9 rounded-full bg-[#663F23] flex-shrink-0 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {(log.userName || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-[#1C1C1C]">
                                    {log.userName || "Unknown User"}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}
                                  >
                                    {config.icon}
                                    {config.label}
                                  </span>
                                  {log.targetModel && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F5F1E8] text-[#663F23]">
                                      {log.targetModel}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#555] mb-1">
                                  {getActionDescription(log)}
                                </p>
                                {log.changes?.summary && !isExpanded && (
                                  <p className="text-xs text-[#888] truncate max-w-md">
                                    {log.changes.summary}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[11px] text-[#aaa] flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {getRelativeTime(log.createdAt)}
                                  </span>
                                  {hasChanges && (
                                    <button
                                      className="text-[11px] text-[#663F23] font-medium flex items-center gap-0.5 hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedId(
                                          isExpanded ? null : log._id
                                        );
                                      }}
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-3 h-3" />
                                          Hide details
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3" />
                                          View details
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded changes */}
                            {isExpanded && hasChanges && (
                              <div className="mt-3 ml-12">
                                {renderChanges(log.changes)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg text-[#666] hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {generatePageNumbers().map((p, idx) =>
                    typeof p === "string" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1 text-xs text-[#999]"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all ${
                          p === pagination.page
                            ? "bg-[#663F23] text-white shadow-sm"
                            : "text-[#666] hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-lg text-[#666] hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
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
  );
}
