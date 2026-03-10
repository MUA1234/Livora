"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    LogOut,
    Loader2,
    AlertCircle,
    Download,
    ArrowLeft,
    RefreshCw
} from "lucide-react";
import Image from "next/image";

interface CostItem {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface CostData {
    designId: string;
    designName: string;
    roomDetails: any;
    itemizedList: CostItem[];
    grandTotal: number;
}

export default function CostSummary() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get("designId") || "";

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [costData, setCostData] = useState<CostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    const fetchCostSummary = useCallback(async () => {
        if (!designId) {
            setError("No design ID provided. Please select a design first.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get(`/api/designs/${designId}/cost-summary`);
            setCostData(response.data);
        } catch (err: any) {
            console.error("Cost summary fetch error:", err);
            const msg = err?.response?.status === 404
                ? "Design not found. It may have been deleted."
                : "Failed to load cost summary. Please try again.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [designId]);

    useEffect(() => {
        fetchCostSummary();
    }, [fetchCostSummary]);

    const handleExportPdf = async () => {
        if (!designId) return;
        try {
            setIsPdfLoading(true);
            const response = await api.get(`/api/designs/${designId}/cost-report/pdf`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Cost-Report-${costData?.designName?.replace(/\s+/g, "-") || designId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setToastConfig({ message: "PDF downloaded successfully!", type: "success" });
        } catch (err: any) {
            console.error("PDF export error:", err);
            setToastConfig({ message: "Failed to export PDF. Please try again.", type: "error" });
        } finally {
            setIsPdfLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#663F23] flex items-center justify-center">
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
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Sofa size={20} />
                            <span className="font-medium text-sm">Catalogue</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutTemplate size={20} />
                            <span className="font-medium text-sm">Compare Designs</span>
                        </Link>
                        <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors">
                            <FileText size={20} />
                            <span className="font-medium text-sm">Cost Summary</span>
                        </Link>
                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
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
                            <span className="text-white text-xs font-bold">AD</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C]">Livora Admin</span>
                            <span className="text-[10px] text-[#1C1C1C]/50">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] p-8 md:p-12">
                <div className="max-w-4xl ml-0 h-full">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 text-[#663F23] animate-spin" />
                            <p className="text-[#8C8C8C] font-medium">Calculating cost summary...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                            <AlertCircle className="w-14 h-14 text-red-400" />
                            <div>
                                <h3 className="text-xl font-bold text-[#1C1C1C]">Unable to Load Cost Data</h3>
                                <p className="text-[#8C8C8C] mt-2 max-w-md">{error}</p>
                            </div>
                            <button
                                onClick={fetchCostSummary}
                                className="flex items-center gap-2 px-6 py-3 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#533520] transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> Retry
                            </button>
                        </div>
                    )}

                    {/* Data Loaded */}
                    {!isLoading && !error && costData && (
                        <>
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-[#2A2A2A] mb-2">Cost Summary</h1>
                                <p className="text-lg text-[#6C6C6C]">
                                    Design: <span className="font-semibold text-[#2A2A2A]">{costData.designName}</span>
                                </p>
                                {costData.roomDetails?.name && (
                                    <p className="text-sm text-[#8C8C8C] mt-1">
                                        Room: {costData.roomDetails.name}
                                        {costData.roomDetails.dimensions && ` (${costData.roomDetails.dimensions.length}×${costData.roomDetails.dimensions.width} ${costData.roomDetails.dimensions.unit})`}
                                    </p>
                                )}
                            </div>

                            {/* Table */}
                            <div className="mb-8 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                                <table className="w-full text-left table-fixed">
                                    <thead>
                                        <tr className="border-b border-[#E5E5E5] bg-[#FAFAF7]">
                                            <th className="p-5 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest w-[40%]">Item</th>
                                            <th className="p-5 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-center w-[15%]">Qty</th>
                                            <th className="p-5 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right w-[22%]">Unit Price</th>
                                            <th className="p-5 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right w-[23%]">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#2A2A2A]">
                                        {costData.itemizedList.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-[#A8A8A8] italic">
                                                    No items found in this design&apos;s layout.
                                                </td>
                                            </tr>
                                        ) : (
                                            costData.itemizedList.map((item, idx) => (
                                                <tr
                                                    key={item.productId}
                                                    className={`border-b border-[#E5E5E5]/60 hover:bg-[#F5F1E8]/30 transition-colors ${idx === costData.itemizedList.length - 1 ? "border-b-0" : ""}`}
                                                >
                                                    <td className="p-5">
                                                        <span className="font-semibold text-[14px]">{item.name}</span>
                                                        <span className="block text-[11px] text-[#A8A8A8] mt-0.5">SKU: {item.sku}</span>
                                                    </td>
                                                    <td className="p-5 text-center font-medium text-[14px]">{item.quantity}</td>
                                                    <td className="p-5 text-right font-medium text-[14px]">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="p-5 text-right font-bold text-[14px]">{formatCurrency(item.subtotal)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Totals */}
                            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6 mb-10">
                                <div className="flex justify-between items-center py-3 border-b border-dashed border-[#E5E5E5]">
                                    <span className="text-[15px] text-[#6C6C6C] font-medium">Subtotal</span>
                                    <span className="text-[15px] text-[#2A2A2A] font-semibold">{formatCurrency(costData.grandTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-dashed border-[#E5E5E5]">
                                    <span className="text-[15px] text-[#6C6C6C] font-medium">Tax</span>
                                    <span className="text-[15px] text-[#A8A8A8] italic">—</span>
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <span className="text-[17px] text-[#2A2A2A] font-bold">Grand Total</span>
                                    <span className="text-[20px] text-[#663F23] font-bold">{formatCurrency(costData.grandTotal)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleExportPdf}
                                    disabled={isPdfLoading}
                                    className="flex items-center gap-2 px-8 py-3.5 bg-[#663F23] text-white font-semibold rounded-xl hover:bg-[#533520] transition-all shadow-[0_4px_12px_rgba(102,63,35,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPdfLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                    {isPdfLoading ? "Generating..." : "Export PDF"}
                                </button>
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#2A2A2A] font-semibold rounded-xl border border-[#E0E0E0] hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back to Editor
                                </button>
                            </div>
                        </>
                    )}

                    {/* Empty state when no designId */}
                    {!isLoading && !error && !costData && (
                        <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                            <FileText className="w-14 h-14 text-[#E5E5E5]" />
                            <div>
                                <h3 className="text-xl font-bold text-[#1C1C1C]">No Design Selected</h3>
                                <p className="text-[#8C8C8C] mt-2">Navigate here from a design to view its cost breakdown.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {toastConfig && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />}

            {isLogoutModalOpen && (
                <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout from Livora admin panel?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
            )}
        </div>
    );
}
