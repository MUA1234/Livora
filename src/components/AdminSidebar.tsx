"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Monitor,
    Sofa,
    Settings,
    LayoutTemplate,
    FileText,
    Users,
    ScrollText,
    LogOut,
} from "lucide-react";
import { getUser, AuthUser } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/room-setup", label: "Room Setup", icon: Monitor },
    { href: "/admin/catalogue", label: "Catalogue", icon: Sofa },
    { href: "/admin/catalogue-management", label: "Catalogue Management", icon: Settings, nested: true },
    { href: "/admin/compare-designs", label: "Compare Designs", icon: LayoutTemplate },
    { href: "/admin/cost-summary", label: "Cost Summary", icon: FileText },
    { href: "/admin/consultations", label: "Consultations", icon: Users },
    { href: "/admin/design-history", label: "Design History", icon: ScrollText },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        setAdminUser(getUser());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "livora-token=; path=/; max-age=0";
        router.push("/admin/login");
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        // For admin routes, check exact match or if it's a sub-path (e.g. /admin/2d-layout starts with /admin/room-setup is NOT a match)
        return pathname === href || pathname.startsWith(href + "/");
    };

    // Also highlight "Room Setup" for 2d-layout, 3d-view, 3d-visualization
    const isRoomSetupActive = () => {
        return pathname === "/admin/room-setup" ||
            pathname.startsWith("/admin/2d-layout") ||
            pathname.startsWith("/admin/3d-view") ||
            pathname.startsWith("/admin/3d-visualization");
    };

    return (
        <>
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    {/* Logo */}
                    <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                                <span className="text-[#663F23] text-xs font-bold">LV</span>
                            </div>
                            <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1 mt-4">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = item.href === "/admin/room-setup"
                                ? isRoomSetupActive()
                                : isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        item.nested ? "pl-8" : ""
                                    } ${
                                        active
                                            ? "bg-[#663F23] text-white"
                                            : "text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C]"
                                    }`}
                                >
                                    <Icon size={item.nested ? 16 : 20} />
                                    <span className={`font-medium ${item.nested ? "text-xs" : "text-sm"}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-[#E5E5E5]/50 shrink-0">
                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                            isActive("/admin/settings")
                                ? "bg-[#663F23] text-white"
                                : "text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C]"
                        }`}
                    >
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

                    {/* User Card */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#E5E5E5]/50">
                        <div className="w-8 h-8 rounded-full bg-[#663F23] flex items-center justify-center text-white text-xs font-bold">
                            {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C] truncate max-w-[120px]">
                                {adminUser?.name || "Admin"}
                            </span>
                            <span className="text-[10px] text-[#1C1C1C]/50 uppercase tracking-wider">
                                {adminUser?.role === "admin" ? "Lead Designer" : adminUser?.role || "admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {isLogoutModalOpen && (
                <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout from Livora admin panel?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
            )}
        </>
    );
}
