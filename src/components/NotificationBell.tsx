"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { useNotifications, Notification } from "@/context/NotificationContext";
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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

function getNotificationLink(notification: Notification, isAdmin: boolean): string | null {
    switch (notification.type) {
        case "consultation_request":
            return isAdmin ? "/admin/consultations" : null;
        case "consultation_status_update":
        case "consultation_response":
            return isAdmin ? "/admin/consultations" : "/user-panel/my-account";
        case "new_review":
            return isAdmin ? "/user-panel/review-and-ratings" : null;
        case "design_shared":
            return notification.relatedId ? `/preview/${notification.relatedId}` : null;
        case "new_user_registered":
            return isAdmin ? "/admin/settings" : null;
        default:
            return null;
    }
}

interface NotificationBellProps {
    isAdmin?: boolean;
    allNotificationsHref?: string;
}

export default function NotificationBell({ isAdmin = false, allNotificationsHref }: NotificationBellProps) {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllRead, loading } = useNotifications();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const recentNotifications = notifications.slice(0, 8);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification._id);
        }
        setOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors"
            >
                <Bell size={18} className={unreadCount > 0 ? "text-[#663F23]" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-[100]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#1C1C1C]">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-[#663F23] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xs text-[#663F23] hover:text-[#52321c] font-medium px-2 py-1 rounded-lg hover:bg-[#F5F1E8] transition-colors"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={14} />
                                    <span className="hidden sm:inline">Mark all read</span>
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="text-[#1C1C1C]/40 hover:text-[#1C1C1C] p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {recentNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                <div className="w-12 h-12 rounded-full bg-[#F5F1E8] flex items-center justify-center mb-3">
                                    <Bell size={20} className="text-[#C6A75E]" />
                                </div>
                                <p className="text-sm text-[#1C1C1C]/50 font-medium">No notifications yet</p>
                                <p className="text-xs text-[#1C1C1C]/30 mt-1">You&apos;ll see updates here</p>
                            </div>
                        ) : (
                            recentNotifications.map((notification) => {
                                const link = getNotificationLink(notification, isAdmin);
                                const content = (
                                    <div
                                        className={`flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer ${
                                            notification.read
                                                ? "hover:bg-gray-50"
                                                : "bg-[#663F23]/[0.03] hover:bg-[#663F23]/[0.06]"
                                        }`}
                                    >
                                        <div className="text-lg mt-0.5 shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm leading-snug ${notification.read ? "text-[#1C1C1C]/70" : "text-[#1C1C1C] font-semibold"}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-[#663F23] shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-[#1C1C1C]/50 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-[#1C1C1C]/30 mt-1 font-medium">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteNotification(notification._id);
                                            }}
                                            className="text-[#1C1C1C]/20 hover:text-red-500 p-1 rounded transition-colors shrink-0 mt-0.5"
                                            title="Delete"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                );

                                if (link) {
                                    return (
                                        <Link
                                            key={notification._id}
                                            href={link}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {content}
                                        </Link>
                                    );
                                }

                                return (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {content}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-[#E5E5E5] px-5 py-3 flex items-center justify-between">
                            {allNotificationsHref ? (
                                <Link
                                    href={allNotificationsHref}
                                    onClick={() => setOpen(false)}
                                    className="text-xs font-semibold text-[#663F23] hover:text-[#52321c] transition-colors"
                                >
                                    View all notifications
                                </Link>
                            ) : (
                                <span />
                            )}
                            {notifications.some((n) => n.read) && (
                                <button
                                    onClick={clearAllRead}
                                    className="text-xs text-[#1C1C1C]/40 hover:text-red-500 font-medium transition-colors"
                                >
                                    Clear read
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
