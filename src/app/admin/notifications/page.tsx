"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useNotifications, Notification } from "@/context/NotificationContext";
import {
    Bell,
    CheckCheck,
    Trash2,
    ArrowLeft,
    Filter,
} from "lucide-react";
import Link from "next/link";

function getTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getNotificationIcon(type: string): string {
    switch (type) {
        case "consultation_request": return "📋";
        case "consultation_status_update": return "🔄";
        case "consultation_response": return "💬";
        case "new_review": return "⭐";
        case "design_shared": return "🎨";
        case "new_user_registered": return "👤";
        case "order_placed": return "🛒";
        default: return "🔔";
    }
}

function getTypeLabel(type: string): string {
    switch (type) {
        case "consultation_request": return "Consultation";
        case "consultation_status_update": return "Status Update";
        case "consultation_response": return "Message";
        case "new_review": return "Review";
        case "design_shared": return "Design";
        case "new_user_registered": return "New User";
        case "order_placed": return "Order";
        default: return "General";
    }
}

function getNotificationLink(notification: Notification): string | null {
    switch (notification.type) {
        case "consultation_request": return "/admin/consultations";
        case "new_review": return "/user-panel/review-and-ratings";
        default: return null;
    }
}

type FilterType = "all" | "unread" | "consultation_request" | "new_review" | "new_user_registered" | "design_shared";

export default function AdminNotificationsPage() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllRead,
    } = useNotifications();

    const [filter, setFilter] = useState<FilterType>("all");

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
    });

    const handleClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification._id);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-[#F5F1E8]">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#F5F1E8] px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between border-b border-[#E5E5E5]/30 pl-14 md:pl-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors">
                            <ArrowLeft size={18} className="text-[#1C1C1C]" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-[#1C1C1C]">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#663F23] bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F5F1E8] transition-colors"
                            >
                                <CheckCheck size={14} />
                                <span className="hidden sm:inline">Mark all read</span>
                            </button>
                        )}
                        {notifications.some((n) => n.read) && (
                            <button
                                onClick={clearAllRead}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Clear read</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    {/* Filters */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {([
                            { key: "all", label: "All" },
                            { key: "unread", label: "Unread" },
                            { key: "consultation_request", label: "Consultations" },
                            { key: "new_review", label: "Reviews" },
                            { key: "new_user_registered", label: "New Users" },
                            { key: "design_shared", label: "Designs" },
                        ] as { key: FilterType; label: string }[]).map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                    filter === f.key
                                        ? "bg-[#663F23] text-white"
                                        : "bg-white border border-[#E5E5E5] text-[#1C1C1C]/60 hover:border-[#663F23] hover:text-[#663F23]"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Notification List */}
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                                <Bell size={28} className="text-[#C6A75E]" />
                            </div>
                            <p className="text-sm font-medium text-[#1C1C1C]/50">
                                {filter === "unread" ? "No unread notifications" : "No notifications found"}
                            </p>
                            <p className="text-xs text-[#1C1C1C]/30 mt-1">
                                {filter !== "all" ? "Try a different filter" : "Notifications will appear here when there's activity"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredNotifications.map((notification) => {
                                const link = getNotificationLink(notification);
                                const inner = (
                                    <div
                                        className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl transition-all cursor-pointer ${
                                            notification.read
                                                ? "bg-white hover:bg-gray-50 border border-[#E5E5E5]/50"
                                                : "bg-white border-l-4 border-l-[#663F23] border border-[#E5E5E5]/50 shadow-sm"
                                        }`}
                                        onClick={() => handleClick(notification)}
                                    >
                                        <div className="text-2xl mt-0.5 shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className={`text-sm ${notification.read ? "text-[#1C1C1C]/70" : "text-[#1C1C1C] font-bold"}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-[10px] font-bold text-[#1C1C1C]/30 uppercase tracking-wider hidden sm:inline">
                                                        {getTypeLabel(notification.type)}
                                                    </span>
                                                    {!notification.read && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#663F23]" />
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#1C1C1C]/50 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-[#1C1C1C]/30 mt-2 font-medium">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteNotification(notification._id);
                                            }}
                                            className="text-[#1C1C1C]/20 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                                            title="Delete notification"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );

                                if (link) {
                                    return (
                                        <Link key={notification._id} href={link}>
                                            {inner}
                                        </Link>
                                    );
                                }
                                return <div key={notification._id}>{inner}</div>;
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
