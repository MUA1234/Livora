"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ChevronLeft,
    ChevronDown,
    Repeat,
    Loader2,
    AlertCircle,
    Inbox,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import api from "@/lib/api";

interface DesignOption {
    _id: string;
    name: string;
}

interface CostItem {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface DesignSide {
    _id?: string;
    id?: string;
    name: string;
    status: string;
    roomId: any;
    layoutData: any;
    costSummary: {
        itemizedList: CostItem[];
        grandTotal: number;
    };
}

interface ComparisonData {
    designA: DesignSide;
    designB: DesignSide;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function CompareDesigns() {
    const [designs, setDesigns] = useState<DesignOption[]>([]);
    const [selectedA, setSelectedA] = useState("");
    const [selectedB, setSelectedB] = useState("");
    const [swapped, setSwapped] = useState(false);
    const [comparison, setComparison] = useState<ComparisonData | null>(null);
    const [isListLoading, setIsListLoading] = useState(true);
    const [isCompareLoading, setIsCompareLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDropdownA, setShowDropdownA] = useState(false);
    const [showDropdownB, setShowDropdownB] = useState(false);

    // Fetch design list
    useEffect(() => {
        (async () => {
            try {
                setIsListLoading(true);
                const res = await api.get("/api/designs");
                const list = Array.isArray(res.data) ? res.data : res.data.data || [];
                setDesigns(list);
            } catch {
                setError("Failed to load designs.");
            } finally {
                setIsListLoading(false);
            }
        })();
    }, []);

    // Fetch comparison when both selected
    const fetchComparison = useCallback(async (idA: string, idB: string) => {
        if (!idA || !idB) return;
        try {
            setIsCompareLoading(true);
            setError(null);
            const res = await api.get("/api/designs/compare", { params: { designA: idA, designB: idB } });
            setComparison(res.data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Could not compare designs.";
            setError(msg);
            setComparison(null);
        } finally {
            setIsCompareLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedA && selectedB) {
            fetchComparison(selectedA, selectedB);
        }
    }, [selectedA, selectedB, fetchComparison]);

    const nameA = designs.find(d => d._id === selectedA)?.name || "Select Design A";
    const nameB = designs.find(d => d._id === selectedB)?.name || "Select Design B";

    const dA = swapped ? comparison?.designB : comparison?.designA;
    const dB = swapped ? comparison?.designA : comparison?.designB;

    const buildBarRows = () => {
        if (!dA || !dB) return [];
        const costA = dA.costSummary.grandTotal;
        const costB = dB.costSummary.grandTotal;
        const maxCost = Math.max(costA, costB, 1);
        return [{
            title: "Total Estimated Cost",
            leftVal: costA,
            rightVal: costB,
            leftHigher: costA > costB,
            diff: Math.abs(costA - costB),
            leftPct: `${Math.round((costA / maxCost) * 100)}%`,
            rightPct: `${Math.round((costB / maxCost) * 100)}%`
        }];
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4 sm:p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Design Comparison</h1>
                <p className="text-[#1C1C1C]/60 text-sm">Compare layouts, furniture lists &amp; costs side-by-side.</p>
            </div>

            {/* Selectors */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white rounded-xl p-2 mb-8 shadow-sm gap-2 sm:gap-0">
                {/* Design A Dropdown */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => { setShowDropdownA(!showDropdownA); setShowDropdownB(false); }}
                        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-left border border-transparent hover:border-gray-100"
                    >
                        <span className={`font-semibold ${selectedA ? "text-[#1C1C1C]" : "text-[#A8A8A8]"}`}>
                            {swapped ? nameB : nameA}
                        </span>
                        <ChevronDown size={18} className="text-[#1C1C1C]/50" />
                    </button>
                    {showDropdownA && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                            {isListLoading ? (
                                <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#663F23]" /></div>
                            ) : designs.filter(d => d._id !== selectedB).map(d => (
                                <button
                                    key={d._id}
                                    onClick={() => { setSelectedA(d._id); setShowDropdownA(false); }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-[#F5F1E8] transition-colors ${selectedA === d._id ? "bg-[#F5F1E8] text-[#663F23] font-bold" : "text-[#1C1C1C]"}`}
                                >
                                    {d.name}
                                </button>
                            ))}
                            {!isListLoading && designs.filter(d => d._id !== selectedB).length === 0 && (
                                <p className="p-4 text-sm text-[#A8A8A8] text-center">No designs available</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 flex flex-col items-center justify-center">
                    <button onClick={() => setSwapped(!swapped)} className="bg-[#FAF8F5] p-3 rounded-full hover:bg-[#F0EBE1] transition-colors border border-[#E8E1D3]">
                        <Repeat size={18} className="text-[#663F23]" />
                    </button>
                    <span className="text-xs font-semibold text-[#663F23] mt-2">Swap</span>
                </div>

                {/* Design B Dropdown */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => { setShowDropdownB(!showDropdownB); setShowDropdownA(false); }}
                        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-left border border-transparent hover:border-gray-100"
                    >
                        <span className={`font-semibold ${selectedB ? "text-[#1C1C1C]" : "text-[#A8A8A8]"}`}>
                            {swapped ? nameA : nameB}
                        </span>
                        <ChevronDown size={18} className="text-[#1C1C1C]/50" />
                    </button>
                    {showDropdownB && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                            {isListLoading ? (
                                <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#663F23]" /></div>
                            ) : designs.filter(d => d._id !== selectedA).map(d => (
                                <button
                                    key={d._id}
                                    onClick={() => { setSelectedB(d._id); setShowDropdownB(false); }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-[#F5F1E8] transition-colors ${selectedB === d._id ? "bg-[#F5F1E8] text-[#663F23] font-bold" : "text-[#1C1C1C]"}`}
                                >
                                    {d.name}
                                </button>
                            ))}
                            {!isListLoading && designs.filter(d => d._id !== selectedA).length === 0 && (
                                <p className="p-4 text-sm text-[#A8A8A8] text-center">No designs available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* States */}
            {isCompareLoading && (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-12 h-12 text-[#663F23] animate-spin" />
                    <p className="text-[#8C8C8C] font-medium">Generating comparison...</p>
                </div>
            )}

            {!isCompareLoading && error && (
                <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                    <AlertCircle className="w-14 h-14 text-red-400" />
                    <h3 className="text-xl font-bold text-[#1C1C1C]">{error}</h3>
                    <button onClick={() => fetchComparison(selectedA, selectedB)} className="px-6 py-2 bg-[#663F23] text-white rounded-xl text-sm font-bold">Retry</button>
                </div>
            )}

            {!isCompareLoading && !error && !comparison && (!selectedA || !selectedB) && (
                <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
                    <Inbox className="w-14 h-14 text-[#E5E5E5]" />
                    <h3 className="text-xl font-bold text-[#1C1C1C]">Select Two Designs</h3>
                    <p className="text-[#8C8C8C] max-w-sm">Choose a design from each dropdown above to see a side-by-side comparison of layouts, furniture, and costs.</p>
                </div>
            )}

            {/* Comparison Grid */}
            {!isCompareLoading && !error && comparison && dA && dB && (
                <>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12`}>
                        {/* Design A Card */}
                        {[dA, dB].map((side, colIdx) => {
                            const label = colIdx === 0 ? "Design A" : "Design B";
                            const otherSide = colIdx === 0 ? dB : dA;
                            const isLower = side.costSummary.grandTotal < otherSide.costSummary.grandTotal;
                            const diff = Math.abs(side.costSummary.grandTotal - otherSide.costSummary.grandTotal);

                            return (
                                <div key={side._id || side.id || colIdx} className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E5E5]/50 relative">
                                    <div className="absolute top-8 left-8 bg-[#C6A75E] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                                        {label}
                                    </div>

                                    <div className="text-center mt-6 mb-8">
                                        <h2 className="text-xl font-bold">{side.name}</h2>
                                        <p className="text-sm text-[#1C1C1C]/50 mt-1">
                                            {side.roomId?.name || "Room"} • {side.roomId?.dimensions ? `${side.roomId.dimensions.length}×${side.roomId.dimensions.width} ${side.roomId.dimensions.unit || "m"}` : "N/A"}
                                        </p>
                                    </div>

                                    {/* Layout Data Preview */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-semibold">Layout Overview</h3>
                                            {side.layoutData && otherSide.layoutData && JSON.stringify(side.layoutData) !== JSON.stringify(otherSide.layoutData) ? (
                                                <span className="bg-[#C6A75E] text-white text-[10px] font-bold px-3 py-1 rounded-full">≠ Different</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full">= Same</span>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 max-h-48 overflow-auto">
                                            {side.layoutData?.furniture && side.layoutData.furniture.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-[#6C6C6C] font-medium mb-2">{side.layoutData.furniture.length} furniture item(s) placed</p>
                                                    {side.layoutData.furniture.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
                                                            <span className="text-[#1C1C1C] font-medium">{item.name || `Item ${idx + 1}`}</span>
                                                            <span className="text-[#6C6C6C]">
                                                                {item.position ? `(${Number(item.position.x).toFixed(1)}, ${Number(item.position.z ?? item.position.y).toFixed(1)})` : ""}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-[#6C6C6C] italic text-center py-4">No layout data available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Furniture Selection */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                                            <h3 className="text-xs font-bold text-[#C6A75E] uppercase tracking-wider">Furniture<br />Selection</h3>
                                            <p className="text-xs text-gray-500">
                                                {side.costSummary.itemizedList.length} items • {fmt(side.costSummary.grandTotal)}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            {side.costSummary.itemizedList.length === 0 ? (
                                                <p className="text-sm text-[#A8A8A8] italic py-4 text-center">No furniture items in this design.</p>
                                            ) : (
                                                side.costSummary.itemizedList.map((item, i) => (
                                                    <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 border-dotted">
                                                        <span className="text-[#1C1C1C]/70">{item.name} ×{item.quantity}</span>
                                                        <span className="font-bold text-[#663F23]">{fmt(item.subtotal)}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className={`rounded-xl p-5 flex justify-between items-center ${isLower && diff > 0 ? "bg-white border-2 border-green-500" : "bg-[#F5F1E8]"}`}>
                                        {isLower && diff > 0 && (
                                            <div className="absolute -mt-14 left-0 right-0 text-center">
                                                <p className="text-[10px] text-green-600 font-medium inline-flex items-center gap-1 bg-white px-2">
                                                    ↓ You save {fmt(diff)} with this design
                                                </p>
                                            </div>
                                        )}
                                        <span className="font-bold text-sm">Total Estimated<br />Cost</span>
                                        <span className={`text-2xl font-bold ${isLower && diff > 0 ? "text-green-600" : ""}`}>
                                            {fmt(side.costSummary.grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cost Comparison Bars */}
                    <h2 className="text-2xl font-bold mb-2">Cost Comparison</h2>
                    <p className="text-[#1C1C1C]/60 text-sm mb-6">Visual cost breakdown between designs</p>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {buildBarRows().map((row, i) => (
                            <div key={i} className="flex items-end gap-4 text-sm relative">
                                <div className="w-[45%]">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="font-semibold">{row.title}</p>
                                            <p className="text-[#1C1C1C]/60 text-xs">{fmt(row.leftVal)}</p>
                                        </div>
                                        {row.leftHigher ? (
                                            <span className="text-red-500 border border-red-200 bg-red-50 text-[10px] font-bold px-2 py-0.5 rounded-full">↑ Higher</span>
                                        ) : (
                                            <span className="text-green-600 border border-green-200 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full">↓ Lower</span>
                                        )}
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full flex justify-end overflow-hidden">
                                        <div className={`h-full rounded-l-full ${row.leftHigher ? 'bg-[#AFA18A]' : 'bg-green-500'}`} style={{ width: row.leftPct }}></div>
                                    </div>
                                </div>

                                <div className="w-[10%] text-center text-[10px] font-bold text-gray-400 pb-1">VS</div>

                                <div className="w-[45%]">
                                    <div className="flex justify-between items-end mb-2 relative">
                                        <div className="absolute -top-7 right-0">
                                            <span className="text-green-600 border border-green-600 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                ↓ Save {fmt(row.diff)}
                                            </span>
                                        </div>
                                        <p className={`font-semibold text-xs ${!row.leftHigher ? 'text-[#1C1C1C]/60' : 'text-green-600'}`}>{fmt(row.rightVal)}</p>
                                        {!row.leftHigher ? (
                                            <span className="text-red-500 border border-red-200 bg-red-50 text-[10px] font-bold px-2 py-0.5 rounded-full">↑ Higher</span>
                                        ) : (
                                            <span className="text-green-600 border border-green-200 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full">↓ Lower</span>
                                        )}
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-r-full ${!row.leftHigher ? 'bg-[#AFA18A]' : 'bg-green-500'}`} style={{ width: row.rightPct }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            </main>
        </div>
    );
}