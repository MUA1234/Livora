"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  Send,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  Inbox,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Home,
} from "lucide-react";

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
  status: Status;
  notes: string;
  avatar: string;
}

const mockRequests: ConsultationRequest[] = [
  {
    id: "CR-001",
    customerName: "Sarah Anderson",
    email: "sarah.anderson@email.com",
    phone: "+1 (555) 123-4567",
    roomSize: "5.5m x 4.2m",
    roomType: "Living Room",
    preferredDate: "2026-03-15",
    submittedDate: "2026-02-18",
    status: "pending",
    notes: "Looking to redesign the entire living room with modern furniture. Prefer minimalist style with warm tones.",
    avatar: "SA",
  },
  {
    id: "CR-002",
    customerName: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    roomSize: "4.0m x 3.5m",
    roomType: "Bedroom",
    preferredDate: "2026-03-20",
    submittedDate: "2026-02-17",
    status: "confirmed",
    notes: "Need a complete bedroom setup. Currently have an empty room. Budget is around $5,000.",
    avatar: "MC",
  },
  {
    id: "CR-003",
    customerName: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 345-6789",
    roomSize: "3.0m x 3.0m",
    roomType: "Home Office",
    preferredDate: "2026-03-10",
    submittedDate: "2026-02-15",
    status: "completed",
    notes: "Want an ergonomic home office setup. Need desk, chair, and storage solutions.",
    avatar: "ER",
  },
  {
    id: "CR-004",
    customerName: "James Wilson",
    email: "jwilson@email.com",
    phone: "+1 (555) 456-7890",
    roomSize: "6.0m x 5.0m",
    roomType: "Dining Room",
    preferredDate: "2026-03-25",
    submittedDate: "2026-02-19",
    status: "pending",
    notes: "Looking for a dining set that can seat 8 people. Prefer solid wood furniture.",
    avatar: "JW",
  },
  {
    id: "CR-005",
    customerName: "Olivia Kim",
    email: "olivia.kim@email.com",
    phone: "+1 (555) 567-8901",
    roomSize: "4.5m x 4.0m",
    roomType: "Living Room",
    preferredDate: "2026-03-12",
    submittedDate: "2026-02-16",
    status: "rejected",
    notes: "Interested in Scandinavian style furniture for a small apartment living room.",
    avatar: "OK",
  },
  {
    id: "CR-006",
    customerName: "David Thompson",
    email: "d.thompson@email.com",
    phone: "+1 (555) 678-9012",
    roomSize: "5.0m x 4.5m",
    roomType: "Bedroom",
    preferredDate: "2026-04-01",
    submittedDate: "2026-02-20",
    status: "pending",
    notes: "Planning to furnish a guest bedroom. Need basics - bed, nightstands, and wardrobe.",
    avatar: "DT",
  },
  {
    id: "CR-007",
    customerName: "Sophia Patel",
    email: "sophia.p@email.com",
    phone: "+1 (555) 789-0123",
    roomSize: "3.5m x 3.0m",
    roomType: "Kids Room",
    preferredDate: "2026-03-18",
    submittedDate: "2026-02-19",
    status: "confirmed",
    notes: "Need a fun and functional kids room design for a 7-year-old. Safety is top priority.",
    avatar: "SP",
  },
];

const statusConfig: Record<Status, { label: string; bgColor: string; textColor: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", bgColor: "bg-amber-50", textColor: "text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: "Confirmed", bgColor: "bg-emerald-50", textColor: "text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", bgColor: "bg-blue-50", textColor: "text-blue-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", bgColor: "bg-red-50", textColor: "text-red-600", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ConsultationManagementPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleStatusChange = (id: string, newStatus: Status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedRequest ? "mr-0" : ""}`}>
        {/* Header */}
        <header className="bg-white border-b border-silver/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-brown rounded-xl flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-cream" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-charcoal">Consultation Management</h1>
                  <p className="text-sm text-charcoal/40">Manage and respond to design consultation requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-charcoal/40">Livora Admin</span>
              <div className="w-9 h-9 bg-brown rounded-full flex items-center justify-center">
                <span className="text-xs text-cream font-medium">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="px-8 py-4 bg-white border-b border-silver/30">
          <div className="flex items-center gap-3">
            {(["all", "pending", "confirmed", "completed", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-brown text-cream shadow-sm"
                    : "bg-cream text-charcoal/50 hover:bg-silver/40"
                }`}
              >
                {status === "all" ? (
                  <Inbox className="w-4 h-4" />
                ) : (
                  statusConfig[status].icon
                )}
                <span className="capitalize">{status}</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                  statusFilter === status
                    ? "bg-cream/20 text-cream"
                    : "bg-charcoal/5 text-charcoal/40"
                }`}>
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-silver/50 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-silver/50 text-sm text-charcoal/60 hover:border-gold/50 transition-all"
              >
                <Filter className="w-4 h-4" />
                Sort
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-8 pb-8 overflow-auto">
          <div className="bg-white rounded-2xl border border-silver/40 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.7fr_0.5fr] px-6 py-3.5 bg-cream/50 border-b border-silver/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                Customer
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" />
                Room Details
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                Preferred Date
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                Submitted
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                Status
              </div>
              <div className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider text-right">
                Actions
              </div>
            </div>

            {/* Table Body */}
            {filteredRequests.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Inbox className="w-12 h-12 text-charcoal/15 mx-auto mb-3" />
                <p className="text-sm text-charcoal/40">No consultation requests found</p>
                <p className="text-xs text-charcoal/25 mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredRequests.map((request, index) => {
                const statusInfo = statusConfig[request.status];
                return (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.7fr_0.5fr] px-6 py-4 items-center border-b border-silver/20 last:border-b-0 cursor-pointer transition-colors ${
                      selectedRequest?.id === request.id ? "bg-brown/5" : "hover:bg-cream/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brown/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-brown">{request.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{request.customerName}</p>
                        <p className="text-[11px] text-charcoal/35">{request.id}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/70">{request.roomType}</p>
                      <p className="text-[11px] text-charcoal/35">{request.roomSize}</p>
                    </div>
                    <div className="text-sm text-charcoal/60">
                      {new Date(request.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-sm text-charcoal/40">
                      {new Date(request.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                        className="p-2 rounded-lg hover:bg-cream text-charcoal/30 hover:text-charcoal/60 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-xs text-charcoal/35">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-white text-charcoal/30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-brown text-cream text-xs font-medium">1</button>
              <button className="px-3 py-1.5 rounded-lg hover:bg-white text-charcoal/40 text-xs font-medium">2</button>
              <button className="p-2 rounded-lg hover:bg-white text-charcoal/30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedRequest && (
        <aside className="w-[420px] bg-white border-l border-silver/50 flex flex-col shrink-0">
          {/* Panel Header */}
          <div className="p-5 border-b border-silver/40 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-charcoal">Request Details</h2>
              <p className="text-[11px] text-charcoal/35 mt-0.5">{selectedRequest.id}</p>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="p-1.5 rounded-lg hover:bg-cream text-charcoal/30 hover:text-charcoal transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Customer Info */}
            <div className="p-5 border-b border-silver/30">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-brown/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-brown">{selectedRequest.avatar}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-charcoal">{selectedRequest.customerName}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mt-1 ${statusConfig[selectedRequest.status].bgColor} ${statusConfig[selectedRequest.status].textColor}`}>
                    {statusConfig[selectedRequest.status].icon}
                    {statusConfig[selectedRequest.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-cream rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-charcoal/35" />
                  </div>
                  <div>
                    <p className="text-[10px] text-charcoal/30 uppercase tracking-wider">Email</p>
                    <p className="text-charcoal/70">{selectedRequest.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-cream rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-charcoal/35" />
                  </div>
                  <div>
                    <p className="text-[10px] text-charcoal/30 uppercase tracking-wider">Phone</p>
                    <p className="text-charcoal/70">{selectedRequest.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="p-5 border-b border-silver/30">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-4">Room Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cream rounded-xl p-3.5">
                  <p className="text-[10px] text-charcoal/30 uppercase tracking-wider mb-1">Room Type</p>
                  <p className="text-sm font-medium text-charcoal">{selectedRequest.roomType}</p>
                </div>
                <div className="bg-cream rounded-xl p-3.5">
                  <p className="text-[10px] text-charcoal/30 uppercase tracking-wider mb-1">Room Size</p>
                  <p className="text-sm font-medium text-charcoal">{selectedRequest.roomSize}</p>
                </div>
                <div className="bg-cream rounded-xl p-3.5">
                  <p className="text-[10px] text-charcoal/30 uppercase tracking-wider mb-1">Preferred Date</p>
                  <p className="text-sm font-medium text-charcoal">
                    {new Date(selectedRequest.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-cream rounded-xl p-3.5">
                  <p className="text-[10px] text-charcoal/30 uppercase tracking-wider mb-1">Submitted</p>
                  <p className="text-sm font-medium text-charcoal">
                    {new Date(selectedRequest.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="p-5 border-b border-silver/30">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-3">Customer Notes</h3>
              <div className="bg-cream rounded-xl p-4">
                <p className="text-sm text-charcoal/60 leading-relaxed">{selectedRequest.notes}</p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="p-5 border-b border-silver/30">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-4">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "confirmed")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {selectedRequest.status === "confirmed" && (
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, "completed")}
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}
                {(selectedRequest.status === "completed" || selectedRequest.status === "rejected") && (
                  <div className="col-span-2 text-center py-2 text-xs text-charcoal/30">
                    This request has been {selectedRequest.status}
                  </div>
                )}
              </div>
            </div>

            {/* Send Response */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-3">Send Response</h3>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response to the customer..."
                rows={4}
                className="w-full px-4 py-3 bg-cream rounded-xl border border-silver/40 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all resize-none"
              />
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-brown text-cream py-3 rounded-xl text-sm font-medium hover:bg-brown-dark transition-colors">
                <Send className="w-4 h-4" />
                Send Response
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
