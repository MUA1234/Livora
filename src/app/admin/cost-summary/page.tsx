"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import {
    FileText,
    Loader2,
    AlertCircle,
    Download,
    ArrowLeft,
    RefreshCw,
    ChevronDown,
    Search
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

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

interface DesignOption {
    _id: string;
    name: string;
    status?: string;
}

export default function CostSummaryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <CostSummary />
        </Suspense>
    );
}

function CostSummary() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialDesignId = searchParams.get("designId") || "";

    const [designId, setDesignId] = useState(initialDesignId);
    const [designs, setDesigns] = useState<DesignOption[]>([]);
    const [isListLoading, setIsListLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [designSearch, setDesignSearch] = useState("");

    const [costData, setCostData] = useState<CostData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

    // Fetch designs list
    useEffect(() => {
        (async () => {
            try {
                setIsListLoading(true);
                const res = await api.get("/api/designs");
                const list = Array.isArray(res.data) ? res.data : res.data.data || [];
                setDesigns(list);
            } catch {
                console.error("Failed to load designs list");
            } finally {
                setIsListLoading(false);
            }
        })();
    }, []);

    const fetchCostSummary = useCallback(async () => {
        if (!designId) return;
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
        if (designId) fetchCostSummary();
    }, [designId, fetchCostSummary]);

    const selectDesign = (id: string) => {
        setDesignId(id);
        setCostData(null);
        setError(null);
        setShowDropdown(false);
        setDesignSearch("");
        router.replace(`/admin/cost-summary?designId=${id}`, { scroll: false });
    };

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

    const selectedDesignName = designs.find(d => d._id === designId)?.name;
    const filteredDesigns = designs.filter(d =>
        d.name.toLowerCase().includes(designSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] p-8 md:p-12">
                <div className="max-w-4xl ml-0 h-full">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#663F23] mb-1">Cost Summary</h1>
                        <p className="text-sm text-[#1C1C1C]/50">View itemized cost breakdowns for your designs.</p>
                    </div>

                    {/* Design Selector */}
                    <div className="mb-8 relative">
                        <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-2">Select Design</label>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full flex justify-between items-center px-5 py-4 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#663F23]/30 transition-colors text-left shadow-sm"
                        >
                            <span className={`font-semibold ${designId ? "text-[#1C1C1C]" : "text-[#A8A8A8]"}`}>
                                {selectedDesignName || "Choose a design to view costs..."}
                            </span>
                            <ChevronDown size={18} className={`text-[#1C1C1C]/40 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="p-3 border-b border-[#E5E5E5]/50">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/30" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search designs..."
                                            value={designSearch}
                                            onChange={(e) => setDesignSearch(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#663F23]"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {isListLoading ? (
                                        <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#663F23]" /></div>
                                    ) : filteredDesigns.length === 0 ? (
                                        <p className="p-6 text-sm text-[#A8A8A8] text-center">No designs found</p>
                                    ) : (
                                        filteredDesigns.map(d => (
                                            <button
                                                key={d._id}
                                                onClick={() => selectDesign(d._id)}
                                                className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-[#F5F1E8] transition-colors flex justify-between items-center ${designId === d._id ? "bg-[#F5F1E8] text-[#663F23] font-bold" : "text-[#1C1C1C]"}`}
                                            >
                                                <span>{d.name}</span>
                                                {d.status && (
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${d.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                                        {d.status}
                                                    </span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* No design selected state */}
                    {!designId && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm">
                            <FileText className="w-14 h-14 text-[#E5E5E5]" />
                            <div>
                                <h3 className="text-xl font-bold text-[#1C1C1C]">No Design Selected</h3>
                                <p className="text-[#8C8C8C] mt-2">Choose a design from the dropdown above to view its cost breakdown.</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 text-[#663F23] animate-spin" />
                            <p className="text-[#8C8C8C] font-medium">Calculating cost summary...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm">
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
                            {/* Design Info */}
                            <div className="mb-8">
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
                </div>
            </main>

            {toastConfig && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />}

        </div>
    );
}
