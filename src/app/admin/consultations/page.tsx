"use client";

import React, { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  User,
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
  LogOut
} from "lucide-react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type Status = "pending" | "confirmed" | "completed" | "rejected";

interface ConsultationRequest {
  id: string;
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
}

const mockRequests: ConsultationRequest[] = [
  { id: "CR-001", customerName: "Sarah Anderson", email: "sarah.anderson@example.com", phone: "+1 (555) 012-3456", roomSize: "5.5m x 4.2m", roomType: "Living Room", preferredDate: "Mar 15, 2026", submittedDate: "Feb 18", message: "I want to do a modern, airy layout with earthy tones. I have a large window facing South.", status: "pending", avatar: "SA" },
  { id: "CR-002", customerName: "Michael Chen", email: "michael.chen@example.com", phone: "+1 (555) 987-6543", roomSize: "4.0m x 3.5m", roomType: "Bedroom", preferredDate: "Mar 20, 2026", submittedDate: "Feb 17", message: "Minimalist design focusing on improved storage capacity.", status: "confirmed", avatar: "MC" },
  { id: "CR-003", customerName: "Emily Rodriguez", email: "emily.r@example.com", phone: "+1 (555) 456-7890", roomSize: "3.0m x 3.0m", roomType: "Home Office", preferredDate: "Mar 10, 2026", submittedDate: "Feb 15", message: "Need a dual monitor setup with ergonomic focus. Natural light is limited.", status: "completed", avatar: "ER" },
  { id: "CR-004", customerName: "James Wilson", email: "j.wilson@example.com", phone: "+1 (555) 234-5678", roomSize: "6.0m x 5.0m", roomType: "Dining Room", preferredDate: "Mar 25, 2026", submittedDate: "Feb 19", message: "Large dining space meant to host at least 8 people comfortably. Looking for classical elements.", status: "pending", avatar: "JW" },
  { id: "CR-005", customerName: "Olivia Kim", email: "olivia.k@example.com", phone: "+1 (555) 345-6789", roomSize: "4.5m x 4.0m", roomType: "Living Room", preferredDate: "Mar 12, 2026", submittedDate: "Feb 16", message: "Looking for something bright, maybe leaning towards a coastal vibe.", status: "rejected", avatar: "OK" },
  { id: "CR-006", customerName: "David Thompson", email: "david.t@example.com", phone: "+1 (555) 876-5432", roomSize: "5.0m x 4.5m", roomType: "Bedroom", preferredDate: "Apr 1, 2026", submittedDate: "Feb 20", message: "Need a comprehensive design including custom wardrobe.", status: "pending", avatar: "DT" },
  { id: "CR-007", customerName: "Sophia Patel", email: "sophia.p@example.com", phone: "+1 (555) 765-4321", roomSize: "3.5m x 3.0m", roomType: "Kids Room", preferredDate: "Mar 18, 2026", submittedDate: "Feb 19", message: "Fun, playful room for a toddler. Needs to be adaptable as they grow.", status: "confirmed", avatar: "SP" },
];

const statusConfig: Record<Status, { label: string; bgColor: string; textColor: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", bgColor: "bg-[#FFF3E0]", textColor: "text-[#E65100]", icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: "Confirmed", bgColor: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", bgColor: "bg-[#E3F2FD]", textColor: "text-[#1565C0]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", bgColor: "bg-[#FFEBEE]", textColor: "text-[#C62828]", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ConsultationManagementPage() {
  const router = useRouter();
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    confirmed: requests.filter((r) => r.status === "confirmed").length,
    completed: requests.filter((r) => r.status === "completed").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const handleOpenDrawer = (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setResponseMessage("");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const updateRequestStatus = (id: string, newStatus: Status) => {
    setRequests(currentReqs =>
      currentReqs.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const handleAccept = () => {
    if (!selectedRequest) return;
    updateRequestStatus(selectedRequest.id, "confirmed");
    setToastConfig({ message: "Consultation confirmed successfully.", type: "success" });
  };

  const handleRejectClick = () => setIsConfirmRejectOpen(true);

  const confirmReject = () => {
    if (!selectedRequest) return;
    updateRequestStatus(selectedRequest.id, "rejected");
    setIsConfirmRejectOpen(false);
    setToastConfig({ message: "Consultation request rejected.", type: "error" });
  };

  const handleSendResponse = () => {
    if (!selectedRequest || !responseMessage.trim()) return;
    setToastConfig({ message: "Response sent to customer successfully.", type: "success" });
    setResponseMessage("");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex flex-col">
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E5E5]/60 w-full">
          <div className="flex items-center gap-4">

            {/* ===== BACK BUTTON ===== */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F4F1ED] text-[#8C8C8C] hover:text-[#6E421E] transition-colors"
              title="Back to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full border border-[#D4C3A3] flex items-center justify-center relative overflow-hidden bg-white shrink-0">
              <Image src="/logo.png" alt="LIVORA" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">Consultation Management</h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">Manage and respond to design consultation requests</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <span className="text-sm font-semibold text-[#8C8C8C]">Livora Admin</span>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 bg-[#6E421E] rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#5A3518] transition-colors"
            >
              <span className="text-[13px] text-white font-bold">AD</span>
            </button>
            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => { setShowProfileMenu(false); setIsLogoutModalOpen(true); }}
                    className="w-full text-left px-4 py-3 text-[14px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-10 py-5 flex items-center gap-3 w-full border-b border-[#E5E5E5]/60 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
          {(["all", "pending", "confirmed", "completed", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${statusFilter === status ? "bg-[#6E421E] text-white shadow-sm" : "bg-[#F4F1ED] text-[#8C8C8C] hover:bg-[#EBE7DF]"}`}
            >
              {status === "all" ? <Inbox className="w-4 h-4" /> : status === "pending" ? <Clock className="w-4 h-4" /> : status === "confirmed" ? <CheckCircle2 className="w-4 h-4" /> : status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span className="capitalize">{status}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusFilter === status ? "bg-[#8B5A2B]/40 text-white" : "bg-[#E5E5E5] text-[#8C8C8C]"}`}>
                {counts[status]}
              </span>
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
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E5E5E5] rounded-2xl text-[14px] font-bold text-[#6C6C6C] hover:bg-[#F9F9F9] transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Sort
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
          <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-4 bg-white border-b border-[#E5E5E5] min-w-[900px]">
            {[{ icon: <User className="w-3.5 h-3.5" />, label: "Customer" }, { icon: <Home className="w-3.5 h-3.5" />, label: "Room Details" }, { icon: <Calendar className="w-3.5 h-3.5" />, label: "Preferred Date" }, { icon: <Clock className="w-3.5 h-3.5" />, label: "Submitted" }, { icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Status" }].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                {icon}{label}
              </div>
            ))}
            <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">Actions</div>
          </div>

          <div className="flex flex-col min-w-[900px]">
            {filteredRequests.map((request, idx, arr) => {
              const statusInfo = statusConfig[request.status];
              return (
                <div key={request.id} className={`grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-5 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${idx === arr.length - 1 ? "border-b-0" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F1E8] flex items-center justify-center shrink-0 border border-[#EBE7DF]">
                      <span className="text-[13px] font-bold text-[#1C1C1C]">{request.avatar}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1C1C1C]">{request.customerName}</p>
                      <p className="text-[12px] font-medium text-[#A8A8A8]">{request.id}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#6C6C6C]">{request.roomType}</p>
                    <p className="text-[12px] font-medium text-[#A8A8A8]">{request.roomSize}</p>
                  </div>
                  <div className="text-[14px] font-semibold text-[#6C6C6C]">{request.preferredDate}</div>
                  <div className="text-[14px] font-semibold text-[#6C6C6C]">{request.submittedDate}</div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.icon}{statusInfo.label}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => handleOpenDrawer(request)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#D4C3A3]/20 text-[#A8A8A8] hover:text-[#6E421E] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredRequests.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[#A8A8A8] font-semibold">No requests found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-[13px] font-semibold text-[#A8A8A8]">Showing {filteredRequests.length} of {requests.length} requests</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white text-[#A8A8A8] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6E421E] text-white text-[13px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#6C6C6C] text-[13px] font-bold transition-colors">2</button>
            <button className="p-2 rounded-lg hover:bg-white text-[#A8A8A8] transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
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
              <div className="flex-1 overflow-y-auto">
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

                  <div className="bg-[#F8F6F0] rounded-xl p-4 border border-[#E5E5E5]/60 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#8C8C8C]">Current Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${statusConfig[selectedRequest.status].bgColor} ${statusConfig[selectedRequest.status].textColor}`}>
                      {statusConfig[selectedRequest.status].icon}{statusConfig[selectedRequest.status].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {[{ label: "Request ID", value: selectedRequest.id }, { label: "Submitted", value: selectedRequest.submittedDate }, { label: "Room", value: selectedRequest.roomType }, { label: "Dimensions", value: selectedRequest.roomSize }].map(({ label, value }) => (
                      <div key={label}>
                        <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1.5">{label}</span>
                        <p className="text-[14px] font-semibold text-[#1C1C1C]">{value}</p>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1.5">Preferred Date</span>
                      <p className="text-[14px] font-semibold text-[#1C1C1C]">{selectedRequest.preferredDate}</p>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-2">Customer Message</span>
                    <div className="bg-[#F4F1ED] rounded-xl p-4">
                      <p className="text-[14px] text-[#1C1C1C] leading-relaxed italic">"{selectedRequest.message}"</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E5E5E5] space-y-5">
                    <span className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">Admin Actions</span>
                    {selectedRequest.status === "pending" && (
                      <div className="flex gap-3">
                        <button onClick={handleAccept} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] rounded-xl text-[14px] font-bold hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm group">
                          <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />Accept Request
                        </button>
                        <button onClick={handleRejectClick} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-[#FFEBEE] border border-[#C62828]/20 text-[#C62828] rounded-xl text-[14px] font-bold hover:bg-[#C62828] hover:text-white transition-all shadow-sm group">
                          <Ban className="w-4 h-4 group-hover:scale-110 transition-transform" />Reject Request
                        </button>
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="block text-[13px] font-bold text-[#6C6C6C]">Send Response Message</label>
                      <textarea value={responseMessage} onChange={(e) => setResponseMessage(e.target.value)} placeholder="Type your response to the customer here..." className="w-full h-28 p-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all resize-none shadow-sm" />
                      <button onClick={handleSendResponse} disabled={!responseMessage.trim()} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#6E421E] text-white rounded-xl text-[14px] font-bold hover:bg-[#5A3518] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm group">
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />Send Response
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
      {isConfirmRejectOpen && selectedRequest && <ConfirmModal title="Reject Consultation" message={`Are you sure you want to reject the consultation request from ${selectedRequest.customerName}?`} onConfirm={confirmReject} onCancel={() => setIsConfirmRejectOpen(false)} />}
      {isLogoutModalOpen && <ConfirmModal title="Confirm Logout" message="Are you sure you want to logout from Livora admin panel?" onConfirm={handleLogout} onCancel={() => setIsLogoutModalOpen(false)} />}
    </div>
  );
}