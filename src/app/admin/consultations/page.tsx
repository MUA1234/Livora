"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  User as UserIcon,
  Home,
  Calendar,
  AlertCircle,
  Inbox,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Check,
  Ban,
  LogOut,
  Loader2,
  RefreshCw,
  LayoutDashboard,
  Monitor,
  Sofa,
  LayoutTemplate,
  FileText,
  Users,
  ScrollText,
  Settings
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Status = "pending" | "confirmed" | "completed" | "rejected";

interface Message {
  sender: "user" | "admin" | "system";
  message: string;
  timestamp: string;
}

interface ConsultationRequest {
  id: string;
  _id: string; // Real DB ID
  customerName: string;
  email: string;
  phone: string;
  roomSize: string;
  roomType: string;
  preferredDate: string;
  submittedDate: string;
  message: string;
  status: Status;
  avatar: string;
  messageThread?: Message[];
}

const statusConfig: Record<Status, { label: string; bgColor: string; textColor: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", bgColor: "bg-[#FFF3E0]", textColor: "text-[#E65100]", icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: "Confirmed", bgColor: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", bgColor: "bg-[#E3F2FD]", textColor: "text-[#1565C0]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", bgColor: "bg-[#FFEBEE]", textColor: "text-[#C62828]", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ConsultationManagementPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Loading & Pagination States
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({ all: 0, pending: 0, confirmed: 0, completed: 0, rejected: 0 });

  const mapBackendStatus = (status: string): Status => {
    if (status === "accepted") return "confirmed";
    return status as Status;
  };

  const mapFrontendStatus = (status: Status): string => {
    if (status === "confirmed") return "accepted";
    return status;
  };

  const fetchConsultations = useCallback(async (page: number, status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = { page, limit: 10 };
      if (status !== "all") {
        params.status = mapFrontendStatus(status as Status);
      }

      const response = await api.get("/api/admin/consultations", { params });
      const { data, pagination } = response.data;

      const formatted = data.map((item: any) => ({
        id: item._id.substring(item._id.length - 6).toUpperCase(),
        _id: item._id,
        customerName: item.userId?.name || "Unknown Customer",
        email: item.userId?.email || "N/A",
        phone: item.userId?.phone || "N/A",
        roomSize: "N/A", // Not in schema, but kept for UI consistency
        roomType: item.designId?.name || "Consultation Request",
        preferredDate: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        submittedDate: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        message: item.messageThread?.[0]?.message || "No initial message.",
        status: mapBackendStatus(item.status),
        avatar: (item.userId?.name || "U").substring(0, 2).toUpperCase()
      }));

      setRequests(formatted);
      setCurrentPage(pagination.page);
      setTotalPages(pagination.pages);
      setTotalCount(pagination.total);
      
      // Update counts for tabs (this is a bit expensive if we don't have a dedicated endpoint, 
      // but let's assume 'all' count is enough or we'd need another call)
      // For now, let's just update the 'all' count and current tab count
      setCounts(prev => ({ ...prev, all: pagination.total, [status]: pagination.total }));

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load consultations. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations(1, statusFilter);
  }, [statusFilter, fetchConsultations]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const handleOpenDrawer = async (request: ConsultationRequest) => {
    setIsDrawerOpen(true);
    setIsDetailLoading(true);
    setResponseMessage("");
    
    try {
      const response = await api.get(`/api/admin/consultations/${request._id}`);
      const item = response.data;
      
      const fullDetail: ConsultationRequest = {
        ...request,
        messageThread: item.messageThread || [],
        message: item.messageThread?.[0]?.message || request.message
      };
      
      setSelectedRequest(fullDetail);
    } catch (err: any) {
      console.error("Detail fetch error:", err);
      setToastConfig({ message: "Failed to load request details.", type: "error" });
      setSelectedRequest(request); // Still show basic info
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleStatusUpdate = async (newStatus: Status) => {
    if (!selectedRequest) return;
    
    try {
      setIsActionLoading(true);
      const backendStatus = mapFrontendStatus(newStatus);
      await api.put(`/api/admin/consultations/${selectedRequest._id}/status`, { status: backendStatus });
      
      setToastConfig({ 
        message: `Consultation ${newStatus === "confirmed" ? "accepted" : newStatus}.`, 
        type: newStatus === "rejected" ? "error" : "success" 
      });
      
      // Refresh list and detail
      fetchConsultations(currentPage, statusFilter);
      handleOpenDrawer(selectedRequest);
      setIsConfirmRejectOpen(false);
    } catch (err: any) {
      console.error("Status update error:", err);
      setToastConfig({ message: "Failed to update status.", type: "error" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedRequest || !responseMessage.trim()) return;
    
    try {
      setIsActionLoading(true);
      await api.post(`/api/admin/consultations/${selectedRequest._id}/respond`, { message: responseMessage });
      
      setToastConfig({ message: "Response sent to customer successfully.", type: "success" });
      setResponseMessage("");
      
      // Refresh detail view
      handleOpenDrawer(selectedRequest);
    } catch (err: any) {
      console.error("Response error:", err);
      setToastConfig({ message: "Failed to send response.", type: "error" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex overflow-hidden">
      <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden bg-white">
                <Image
                  src="/logo.png"
                  alt="LIVORA"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <LayoutDashboard size={20} />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
            <Link href="/admin/room-setup" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <Monitor size={20} />
              <span className="font-medium text-sm">Room Setup</span>
            </Link>
            <Link href="/admin/catalogue" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <Sofa size={20} />
              <span className="font-medium text-sm">Catalogue</span>
            </Link>
            <Link href="/admin/compare-designs" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <LayoutTemplate size={20} />
              <span className="font-medium text-sm">Compare Designs</span>
            </Link>
            <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <FileText size={20} />
              <span className="font-medium text-sm">Cost Summary</span>
            </Link>
            <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg">
              <Users size={20} />
              <span className="font-medium text-sm">Consultations</span>
            </Link>
            <Link href="/admin/design-history" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
              <ScrollText size={20} />
              <span className="font-medium text-sm">Design History</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-[#E5E5E5]/50 shrink-0">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors mb-4 focus:outline-none cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#E5E5E5]/50">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#1C1C1C]">Sara Samarasinghe</span>
              <span className="text-[10px] text-[#1C1C1C]/50">Lead Designer</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="bg-white">
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E5E5]/60 w-full">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">Consultation Management</h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">Manage and respond to design consultation requests</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-5 flex items-center gap-3 w-full border-b border-[#E5E5E5]/60 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
          {(["all", "pending", "confirmed", "completed", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${statusFilter === status ? "bg-[#6E421E] text-white shadow-sm" : "bg-[#F4F1ED] text-[#8C8C8C] hover:bg-[#EBE7DF]"}`}
            >
              {status === "all" ? <Inbox className="w-4 h-4" /> : status === "pending" ? <Clock className="w-4 h-4" /> : status === "confirmed" ? <CheckCircle2 className="w-4 h-4" /> : status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span className="capitalize">{status}</span>
              {statusFilter === status && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5A2B]/40 text-white">
                  {totalCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-[800px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#A8A8A8]" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => fetchConsultations(1, statusFilter)}
            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Table / Error / Loading */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-4 bg-white border-b border-[#E5E5E5] min-w-[900px]">
            {[{ icon: <UserIcon className="w-3.5 h-3.5" />, label: "Customer" }, { icon: <Home className="w-3.5 h-3.5" />, label: "Room Details" }, { icon: <Calendar className="w-3.5 h-3.5" />, label: "Date" }, { icon: <Clock className="w-3.5 h-3.5" />, label: "Submitted" }, { icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Status" }].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                {icon}{label}
              </div>
            ))}
            <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">Actions</div>
          </div>

          <div className="flex flex-col min-w-[900px]">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#6E421E] animate-spin" />
                <p className="text-[#A8A8A8] font-medium">Loading consultations...</p>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-4">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-[#1C1C1C]">Something went wrong</h3>
                  <p className="text-[#A8A8A8] mt-1">{error}</p>
                </div>
                <button 
                  onClick={() => fetchConsultations(currentPage, statusFilter)}
                  className="px-6 py-2 bg-[#6E421E] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  Try Again
                </button>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Inbox className="w-12 h-12 text-[#EBE7DF]" />
                <p className="text-[#A8A8A8] font-semibold">No requests found matching your criteria</p>
              </div>
            ) : (
              filteredRequests.map((request, idx, arr) => {
                const statusInfo = statusConfig[request.status];
                return (
                  <div key={request._id} className={`grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-5 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${idx === arr.length - 1 ? "border-b-0" : ""}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F5F1E8] flex items-center justify-center shrink-0 border border-[#EBE7DF]">
                        <span className="text-[13px] font-bold text-[#1C1C1C]">{request.avatar}</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[14px] font-bold text-[#1C1C1C] truncate">{request.customerName}</p>
                        <p className="text-[12px] font-medium text-[#A8A8A8] truncate">{request.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#6C6C6C] truncate">{request.roomType}</p>
                      <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-tighter">ID: {request.id}</p>
                    </div>
                    <div className="text-[14px] font-semibold text-[#6C6C6C]">{request.preferredDate}</div>
                    <div className="text-[14px] font-semibold text-[#6C6C6C]">{request.submittedDate}</div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${statusInfo?.bgColor} ${statusInfo?.textColor}`}>
                        {statusInfo?.icon}{statusInfo?.label}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => handleOpenDrawer(request)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#D4C3A3]/20 text-[#A8A8A8] hover:text-[#6E421E] transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && !error && filteredRequests.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-[13px] font-semibold text-[#8C8C8C]">
              Showing <span className="text-[#1C1C1C]">{filteredRequests.length}</span> of <span className="text-[#1C1C1C]">{totalCount}</span> requests
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchConsultations(currentPage - 1, statusFilter)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Simple page bubble logic */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E5E5] shadow-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p}
                    onClick={() => fetchConsultations(p, statusFilter)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${currentPage === p ? 'bg-[#6E421E] text-white shadow-md' : 'text-[#6C6C6C] hover:bg-[#F4F1ED]'}`}
                  >
                    {p}
                  </button>
                )).slice(0, 5)} {/* Limit to first 5 for now */}
              </div>

              <button 
                onClick={() => fetchConsultations(currentPage + 1, statusFilter)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl hover:bg-white text-[#A8A8A8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#1C1C1C]/40 backdrop-blur-sm" onClick={handleCloseDrawer} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-300 ease-in-out transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedRequest && (
            <>
              <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-[18px] font-bold text-[#1C1C1C]">Consultation Details</h2>
                <button onClick={handleCloseDrawer} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto relative">
                {isDetailLoading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#6E421E] animate-spin" />
                  </div>
                )}
                
                <div className="p-6 space-y-8">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-[#F5F1E8] flex items-center justify-center shrink-0 border border-[#EBE7DF]">
                      <span className="text-[18px] font-bold text-[#1C1C1C]">{selectedRequest.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#1C1C1C]">{selectedRequest.customerName}</h3>
                      <p className="text-[13px] font-medium text-[#6C6C6C] mt-0.5">{selectedRequest.email}</p>
                      <p className="text-[13px] font-medium text-[#6C6C6C]">{selectedRequest.phone}</p>
                    </div>
                  </div>

                  <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E5E5E5]/60 flex items-center justify-between shadow-inner">
                    <span className="text-[12px] font-bold text-[#8C8C8C] uppercase tracking-wider">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${statusConfig[selectedRequest.status]?.bgColor} ${statusConfig[selectedRequest.status]?.textColor}`}>
                      {statusConfig[selectedRequest.status]?.icon}{statusConfig[selectedRequest.status]?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {[{ label: "Full ID", value: selectedRequest._id.substring(0, 12) + "..." }, { label: "Submitted", value: selectedRequest.submittedDate }, { label: "Design/Room", value: selectedRequest.roomType }].map(({ label, value }) => (
                      <div key={label}>
                        <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1.5">{label}</span>
                        <p className="text-[14px] font-semibold text-[#1C1C1C] break-all">{value}</p>
                      </div>
                    ))}
                    <div>
                      <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1.5">Preferred Date</span>
                      <p className="text-[14px] font-semibold text-[#1C1C1C]">{selectedRequest.preferredDate}</p>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-3">Conversation Log</span>
                    <div className="space-y-4">
                      {selectedRequest.messageThread?.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] ${
                            msg.sender === 'admin' 
                              ? 'bg-[#6E421E] text-white rounded-tr-none shadow-sm' 
                              : msg.sender === 'system'
                                ? 'bg-[#EBE7DF] text-[#8C8C8C] text-[12px] rounded-lg w-full text-center italic border border-dashed border-[#A8A8A8]'
                                : 'bg-[#F4F1ED] text-[#1C1C1C] rounded-tl-none border border-[#E5E5E5]'
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[10px] text-[#A8A8A8] mt-1 font-medium px-1">
                            {msg.sender === 'admin' ? 'You' : msg.sender === 'user' ? selectedRequest.customerName : 'System'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                      {(!selectedRequest.messageThread || selectedRequest.messageThread.length === 0) && (
                        <div className="bg-[#F4F1ED] rounded-xl p-4 text-center">
                          <p className="text-[13px] text-[#A8A8A8] italic">No communication history found.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[#E5E5E5] space-y-6">
                    <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">Management Actions</span>
                    
                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate("confirmed")} 
                            disabled={isActionLoading}
                            className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-3 bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] rounded-xl text-[13px] font-bold hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm group disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button 
                            onClick={() => setIsConfirmRejectOpen(true)} 
                            disabled={isActionLoading}
                            className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-3 bg-[#FFEBEE] border border-[#C62828]/20 text-[#C62828] rounded-xl text-[13px] font-bold hover:bg-[#C62828] hover:text-white transition-all shadow-sm group disabled:opacity-50"
                          >
                            <Ban className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {selectedRequest.status === "confirmed" && (
                        <button 
                          onClick={() => handleStatusUpdate("completed")} 
                          disabled={isActionLoading}
                          className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#E3F2FD] border border-[#1565C0]/20 text-[#1565C0] rounded-xl text-[13px] font-bold hover:bg-[#1565C0] hover:text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    <div className="space-y-3">
                      <label className="block text-[12px] font-bold text-[#6C6C6C] uppercase tracking-tight">Send Reply to Customer</label>
                      <div className="relative">
                        <textarea 
                          value={responseMessage} 
                          onChange={(e) => setResponseMessage(e.target.value)} 
                          placeholder="Type your message here..." 
                          className="w-full h-32 p-4 bg-[#F8F6F0] border border-[#E5E5E5] rounded-2xl text-[14px] text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#6E421E] transition-all resize-none shadow-inner" 
                        />
                        {isActionLoading && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-[#6E421E] animate-spin" />
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={handleSendResponse} 
                        disabled={!responseMessage.trim() || isActionLoading} 
                        className="w-full flex justify-center items-center gap-2 px-4 py-4 bg-[#6E421E] text-white rounded-2xl text-[14px] font-bold hover:bg-[#5A3518] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(110,66,30,0.2)] group"
                      >
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Response
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {toastConfig && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />}
      
      {isConfirmRejectOpen && selectedRequest && (
        <ConfirmModal 
          title="Reject Consultation" 
          message={`Are you sure you want to reject the consultation request from ${selectedRequest.customerName}?`} 
          onConfirm={() => handleStatusUpdate("rejected")} 
          onCancel={() => setIsConfirmRejectOpen(false)} 
        />
      )}

      {isLogoutModalOpen && (
        <ConfirmModal
          title="Confirm Logout"
          message="Are you sure you want to logout from Livora admin panel?"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}
      </div>
    </div>
  );
}