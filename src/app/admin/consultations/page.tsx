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
  Leaf
} from "lucide-react";
import Image from "next/image";

type Status = "pending" | "confirmed" | "completed" | "rejected";

interface ConsultationRequest {
  id: string;
  customerName: string;
  roomSize: string;
  roomType: string;
  preferredDate: string;
  submittedDate: string;
  status: Status;
  avatar: string;
}

const mockRequests: ConsultationRequest[] = [
  {
    id: "CR-001",
    customerName: "Sarah Anderson",
    roomSize: "5.5m x 4.2m",
    roomType: "Living Room",
    preferredDate: "Mar 15, 2026",
    submittedDate: "Feb 18",
    status: "pending",
    avatar: "SA",
  },
  {
    id: "CR-002",
    customerName: "Michael Chen",
    roomSize: "4.0m x 3.5m",
    roomType: "Bedroom",
    preferredDate: "Mar 20, 2026",
    submittedDate: "Feb 17",
    status: "confirmed",
    avatar: "MC",
  },
  {
    id: "CR-003",
    customerName: "Emily Rodriguez",
    roomSize: "3.0m x 3.0m",
    roomType: "Home Office",
    preferredDate: "Mar 10, 2026",
    submittedDate: "Feb 15",
    status: "completed",
    avatar: "ER",
  },
  {
    id: "CR-004",
    customerName: "James Wilson",
    roomSize: "6.0m x 5.0m",
    roomType: "Dining Room",
    preferredDate: "Mar 25, 2026",
    submittedDate: "Feb 19",
    status: "pending",
    avatar: "JW",
  },
  {
    id: "CR-005",
    customerName: "Olivia Kim",
    roomSize: "4.5m x 4.0m",
    roomType: "Living Room",
    preferredDate: "Mar 12, 2026",
    submittedDate: "Feb 16",
    status: "rejected",
    avatar: "OK",
  },
  {
    id: "CR-006",
    customerName: "David Thompson",
    roomSize: "5.0m x 4.5m",
    roomType: "Bedroom",
    preferredDate: "Apr 1, 2026",
    submittedDate: "Feb 20",
    status: "pending",
    avatar: "DT",
  },
  {
    id: "CR-007",
    customerName: "Sophia Patel",
    roomSize: "3.5m x 3.0m",
    roomType: "Kids Room",
    preferredDate: "Mar 18, 2026",
    submittedDate: "Feb 19",
    status: "confirmed",
    avatar: "SP",
  },
];

const statusConfig: Record<Status, { label: string; bgColor: string; textColor: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", bgColor: "bg-[#FFF3E0]", textColor: "text-[#E65100]", icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: "Confirmed", bgColor: "bg-[#E8F5E9]", textColor: "text-[#2E7D32]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", bgColor: "bg-[#E3F2FD]", textColor: "text-[#1565C0]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", bgColor: "bg-[#FFEBEE]", textColor: "text-[#C62828]", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ConsultationManagementPage() {
  const [requests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

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

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex flex-col">
      {/* Header Area */}
      <div className="bg-white">
        {/* Top Navbar Component */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E5E5]/60 block w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#D4C3A3] flex items-center justify-center relative overflow-hidden bg-white shrink-0">
              <Image
                src="/logo.png"
                alt="LIVORA"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">Consultation Management</h1>
              <p className="text-[13px] font-medium text-[#8C8C8C]">Manage and respond to design consultation requests</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#8C8C8C]">Livora Admin</span>
            <div className="w-10 h-10 bg-[#6E421E] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[13px] text-white font-bold">AD</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-10 py-5 flex items-center gap-3 w-full border-b border-[#E5E5E5]/60 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
          {(["all", "pending", "confirmed", "completed", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${statusFilter === status
                ? "bg-[#6E421E] text-white shadow-sm"
                : "bg-[#F4F1ED] text-[#8C8C8C] hover:bg-[#EBE7DF]"
                }`}
            >
              {status === "all" ? (
                <Inbox className="w-4 h-4 ml-0.5" />
              ) : status === "pending" ? (
                <Clock className="w-4 h-4 ml-0.5" />
              ) : status === "confirmed" ? (
                <CheckCircle2 className="w-4 h-4 ml-0.5" />
              ) : status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 ml-0.5" />
              ) : (
                <XCircle className="w-4 h-4 ml-0.5" />
              )}
              <span className="capitalize">{status}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusFilter === status
                ? "bg-[#8B5A2B]/40 text-white"
                : "bg-[#E5E5E5] text-[#8C8C8C]"
                }`}>
                {counts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 w-full max-w-[1400px] mx-auto">
        {/* Search Bar & Sort */}
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

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-4 bg-white border-b border-[#E5E5E5] min-w-[900px]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
              <User className="w-3.5 h-3.5" />
              Customer
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
              <Home className="w-3.5 h-3.5" />
              Room Details
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              Preferred Date
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              Submitted
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
              <AlertCircle className="w-3.5 h-3.5" />
              Status
            </div>
            <div className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">
              Actions
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col min-w-[900px]">
            {filteredRequests.map((request, idx, arr) => {
              const statusInfo = statusConfig[request.status];
              return (
                <div
                  key={request.id}
                  className={`grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.5fr] items-center px-8 py-5 border-b border-[#E5E5E5] hover:bg-[#F4F1ED]/50 transition-colors ${idx === arr.length - 1 ? "border-b-0" : ""
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F1E8] flex items-center justify-center shrink-0 border border-[#EBE7DF]">
                      <span className="text-[13px] font-bold text-[#1C1C1C]">{request.avatar}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[14px] font-bold text-[#1C1C1C] leading-snug">{request.customerName}</p>
                      <p className="text-[12px] font-medium text-[#A8A8A8]">{request.id}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-semibold text-[#6C6C6C] leading-snug">{request.roomType}</p>
                    <p className="text-[12px] font-medium text-[#A8A8A8]">{request.roomSize}</p>
                  </div>

                  <div className="text-[14px] font-semibold text-[#6C6C6C]">
                    {request.preferredDate}
                  </div>

                  <div className="text-[14px] font-semibold text-[#6C6C6C]">
                    {request.submittedDate}
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors">
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

        {/* Footer Pagination */}
        <div className="flex items-center justify-between mt-6 max-w-[1400px]">
          <p className="text-[13px] font-semibold text-[#A8A8A8]">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white text-[#A8A8A8] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6E421E] text-white text-[13px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#6C6C6C] text-[13px] font-bold transition-colors">2</button>
            <button className="p-2 rounded-lg hover:bg-white text-[#A8A8A8] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
