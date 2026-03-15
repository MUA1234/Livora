"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import api from "@/lib/api";

export interface Notification {
    _id: string;
    recipientId: string;
    recipientRole: "admin" | "user";
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    relatedModel?: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return;

            setLoading(true);
            const res = await api.get("/api/notifications", { params: { limit: 50 } });
            if (res.data.success) {
                setNotifications(res.data.data.notifications);
                setUnreadCount(res.data.data.unreadCount);
            }
        } catch {
            // Silently fail - user might not be logged in
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return;

            const res = await api.get("/api/notifications/unread-count");
            if (res.data.success) {
                setUnreadCount(res.data.count);
            }
        } catch {
            // Silently fail
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // Silently fail
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await api.put("/api/notifications/mark-all-read");
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch {
            // Silently fail
        }
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications((prev) => {
                const target = prev.find((n) => n._id === id);
                if (target && !target.read) {
                    setUnreadCount((c) => Math.max(0, c - 1));
                }
                return prev.filter((n) => n._id !== id);
            });
        } catch {
            // Silently fail
        }
    }, []);

    const clearAllRead = useCallback(async () => {
        try {
            await api.delete("/api/notifications/clear-all-read");
            setNotifications((prev) => prev.filter((n) => !n.read));
        } catch {
            // Silently fail
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        fetchNotifications();

        // Poll for unread count every 30 seconds
        intervalRef.current = setInterval(fetchUnreadCount, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchNotifications, fetchUnreadCount]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAllRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
