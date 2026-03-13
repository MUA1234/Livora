"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    ScrollText,
    Eye,
    RotateCcw,
    LogOut,
    Loader2
} from "lucide-react";
import Image from "next/image";

interface Version {
    id: string;
    version: string;
    date: string;
    time: string;
    description: string;
    image: string;
    savedBy: string;
    saveType: string;
}

export default function DesignHistoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <DesignHistory />
        </Suspense>
    );
}

function DesignHistory() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get("designId") || searchParams.get("id"); // Handle both common variants

    const [versionsList, setVersionsList] = useState<Version[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        setAdminUser(getUser());
    }, []);

    const fetchVersions = useCallback(async () => {
        if (!designId) {
            setError("No Design ID provided in the URL.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.get(`/api/designs/${designId}/versions`);
            
            // Backend returns an array directly, but let's be safe
            const rawVersions = Array.isArray(response.data) ? response.data : response.data.data || [];

            const formattedVersions: Version[] = rawVersions.map((v: any) => {
                const dateObj = new Date(v.createdAt || v.updatedAt || Date.now());
                const isValidDate = !isNaN(dateObj.getTime());

                return {
                    id: v._id || v.id,
                    version: v.label || "Versioned Snapshot",
                    date: isValidDate 
                        ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Date Unavailable",
                    time: isValidDate 
                        ? dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                        : "Time Unavailable",
                    description: v.description || "Design state captured during editing.",
                    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800", // Placeholder for now
                    savedBy: v.createdBy || "Admin",
                    saveType: v.label?.toLowerCase().includes("auto") ? "Auto" : "Manual",
                };
            });

            setVersionsList(formattedVersions);
            if (formattedVersions.length > 0) {
                setSelectedVersion(formattedVersions[0]);
            }
            setError(null);
        } catch (err: any) {
            console.error("Error fetching versions:", err);
            setError("Failed to load design history. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [designId]);

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    const handleRestore = async (versionId: string) => {
        if (!designId) return;

        try {
            setIsSaving(true);
            await api.post(`/api/designs/${designId}/versions/${versionId}/restore`);
            setToast({ message: "Design version restored successfully!", type: "success" });
            fetchVersions(); // Refresh timeline
        } catch (err: any) {
            console.error("Error restoring version:", err);
            setToast({ message: "Failed to restore version. Please try again.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompare = async () => {
        if (!designId || !selectedVersion || versionsList.length < 2) {
            alert("Need at least two versions to compare.");
            return;
        }

        const v1 = selectedVersion.id;
        const v2 = versionsList[0].id; // Compare with the latest version

        if (v1 === v2) {
            alert("This is already the latest version.");
            return;
        }

        try {
            setIsSaving(true);
            const response = await api.get(`/api/designs/${designId}/versions/${v1}/compare/${v2}`);
            console.log("Comparison data:", response.data);
            alert(`Comparison complete between ${selectedVersion.version} and Latest. Check console for details.`);
        } catch (err: any) {
            console.error("Error comparing versions:", err);
            setToast({ message: "Failed to compare versions.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                                <span className="text-[#663F23] text-xs font-bold">LV</span>
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

                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
                        </Link>

                        <Link href="/admin/design-history" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors">
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
                        <div className="w-8 h-8 rounded-full bg-[#663F23] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{adminUser?.name?.charAt(0) || "A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C] truncate max-w-[120px]">{adminUser?.name || "Admin"}</span>
                            <span className="text-[10px] text-[#1C1C1C]/50 uppercase tracking-wider">{adminUser?.role || "admin"}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] p-8 md:p-12">
                <div className="max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#663F23] mb-1">Design History & Version Control</h1>
                        <p className="text-sm text-[#1C1C1C]/50">Track, compare, and restore previous design versions.</p>
                    </div>

                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm">
                            <Loader2 className="w-8 h-8 text-[#663F23] animate-spin mb-4" />
                            <p className="text-[#1C1C1C]/50 font-medium">Loading history...</p>
                        </div>
                    ) : error ? (
                        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm p-8 text-center">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">Error Loading Design</h3>
                            <p className="text-[#1C1C1C]/50 mb-6">{error}</p>
                            <button 
                                onClick={fetchVersions}
                                className="px-6 py-2 bg-[#663F23] text-white rounded-full hover:bg-[#4A2D19] transition-colors font-medium text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : versionsList.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm p-8 text-center">
                            <div className="w-12 h-12 bg-[#F5F1E8] text-[#663F23] rounded-full flex items-center justify-center mb-4">
                                <ScrollText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No Version History</h3>
                            <p className="text-[#1C1C1C]/50 mb-1">We couldn't find any historical versions for this design.</p>
                            <p className="text-xs text-[#1C1C1C]/30 mb-6 italic">Snapshots are created automatically when you save changes in the editor.</p>
                            <Link href="/dashboard" className="text-[#663F23] font-semibold text-sm hover:underline">
                                Return to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Version Timeline + Preview */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                {/* Version Timeline */}
                                <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm overflow-y-auto max-h-[600px]">
                                    <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Version Timeline</h2>

                                    <div className="space-y-0">
                                        {versionsList.map((v, index) => (
                                            <div key={v.id} className="relative flex gap-4">
                                                {/* Timeline line */}
                                                {index < versionsList.length - 1 && (
                                                    <div className="absolute left-[9px] top-6 w-[2px] h-full bg-[#E5E5E5]"></div>
                                                )}

                                                {/* Timeline dot */}
                                                <div className="relative z-10 mt-1.5">
                                                    <div className={`w-5 h-5 rounded-full border-2 ${selectedVersion?.id === v.id ? "bg-[#C6A75E] border-[#C6A75E]" : "bg-[#E5E5E5] border-[#E5E5E5]"}`}></div>
                                                </div>

                                                {/* Content */}
                                                <button
                                                    onClick={() => setSelectedVersion(v)}
                                                    className={`flex-1 text-left p-4 rounded-xl mb-4 transition-all ${selectedVersion?.id === v.id ? "bg-[#F5F1E8] border border-[#E5E5E5]/50 shadow-sm" : "hover:bg-[#F5F1E8]/50"}`}
                                                >
                                                    <h3 className="font-bold text-[#1C1C1C] text-sm">{v.version}</h3>
                                                    <div className="flex gap-4 mt-1">
                                                        <span className="text-xs text-[#1C1C1C]/50">{v.date}</span>
                                                        <span className="text-xs text-[#1C1C1C]/50">{v.time}</span>
                                                    </div>
                                                    <p className="text-xs text-[#1C1C1C]/40 mt-1 line-clamp-2">{v.description}</p>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Version Preview */}
                                <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm h-fit sticky top-8">
                                    <h2 className="text-lg font-bold text-[#1C1C1C] mb-1">Version Preview</h2>
                                    <p className="text-sm text-[#1C1C1C]/50 mb-4">
                                        {selectedVersion?.version} — {selectedVersion?.date.replace(",", ", ")}
                                    </p>

                                    {/* Preview Image */}
                                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-6">
                                        {selectedVersion && (
                                            <Image
                                                src={selectedVersion.image}
                                                alt={selectedVersion.version}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => selectedVersion && handleRestore(selectedVersion.id)}
                                            disabled={isSaving}
                                            className="flex-1 px-6 py-3 bg-[#663F23] text-white text-sm font-medium rounded-full hover:bg-[#4A2D19] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                                            Restore Version
                                        </button>
                                        <button
                                            onClick={handleCompare}
                                            disabled={isSaving || versionsList.length < 2}
                                            className="flex-1 px-6 py-3 bg-white text-[#1C1C1C] text-sm font-medium rounded-full border border-[#E5E5E5] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Compare with latest
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Auto-Save History Log */}
                            <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Full Historcial Log</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#E5E5E5]/50">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Version Ref</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Saved By</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Type</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Timestamp</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {versionsList.map((v, index) => (
                                                <tr key={v.id} className={`border-b border-[#E5E5E5]/30 hover:bg-[#F5F1E8]/30 transition-colors ${selectedVersion?.id === v.id ? "bg-[#F5F1E8]/20" : ""}`}>
                                                    <td className="py-4 px-4 text-sm font-semibold text-[#1C1C1C]">{v.id.substring(v.id.length - 6).toUpperCase()}</td>
                                                    <td className="py-4 px-4 text-sm text-[#1C1C1C]">{v.savedBy}</td>
                                                    <td className="py-4 px-4 text-sm text-[#1C1C1C]">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${v.saveType === "Auto" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                                                            {v.saveType}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-[#1C1C1C]">
                                                        {v.date} <span className="text-[#1C1C1C]/40 ml-1">{v.time}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {index === 0 ? (
                                                            <span className="text-[10px] font-bold text-[#C6A75E] bg-[#C6A75E]/10 px-2 py-1 rounded">Latest</span>
                                                        ) : (
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => setSelectedVersion(v)}
                                                                    title="Preview"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E5E5] text-[#1C1C1C]/40 hover:text-[#663F23] hover:border-[#663F23] transition-colors"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRestore(v.id)}
                                                                    title="Restore"
                                                                    disabled={isSaving}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E5E5] text-[#1C1C1C]/40 hover:text-[#C6A75E] hover:border-[#C6A75E] transition-colors"
                                                                >
                                                                    <RotateCcw size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {isLogoutModalOpen && (
                <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout from Livora admin panel?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
            )}

            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
}