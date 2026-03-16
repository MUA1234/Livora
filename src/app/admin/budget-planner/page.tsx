"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
    DollarSign,
    Loader2,
    AlertCircle,
    ChevronDown,
    BarChart3,
    TrendingUp,
    Package,
    Eye,
    EyeOff,
    Copy,
    Check,
    Search,
    AlertTriangle,
} from "lucide-react";

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

export default function BudgetPlannerPage() {
    const [budget, setBudget] = useState<number>(0);
    const [budgetInput, setBudgetInput] = useState("");
    const [designs, setDesigns] = useState<DesignOption[]>([]);
    const [selectedDesignId, setSelectedDesignId] = useState("");
    const [costData, setCostData] = useState<CostData | null>(null);
    const [loading, setLoading] = useState(false);
    const [designsLoading, setDesignsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [excludedItems, setExcludedItems] = useState<Set<string>>(new Set());
    const [copied, setCopied] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [designSearch, setDesignSearch] = useState("");

    // Fetch designs
    useEffect(() => {
        (async () => {
            try {
                setDesignsLoading(true);
                const res = await api.get("/api/designs");
                const list = Array.isArray(res.data) ? res.data : res.data.data || [];
                setDesigns(list);
            } catch {
                setToast({ message: "Failed to load designs", type: "error" });
            } finally {
                setDesignsLoading(false);
            }
        })();
    }, []);

    // Fetch cost data when design selected
    useEffect(() => {
        if (!selectedDesignId) { setCostData(null); return; }
        (async () => {
            try {
                setLoading(true);
                setExcludedItems(new Set());
                const res = await api.get(`/api/designs/${selectedDesignId}/cost-summary`);
                setCostData(res.data.data || res.data);
            } catch {
                setToast({ message: "Failed to load cost data", type: "error" });
                setCostData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedDesignId]);

    const handleBudgetSet = () => {
        const val = parseFloat(budgetInput);
        if (!isNaN(val) && val > 0) {
            setBudget(val);
        }
    };

    const toggleItem = (productId: string) => {
        setExcludedItems(prev => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    // Calculate active total
    const { activeTotal, activeItems, excludedTotal } = useMemo(() => {
        if (!costData) return { activeTotal: 0, activeItems: 0, excludedTotal: 0 };
        let active = 0, excluded = 0, count = 0;
        costData.itemizedList.forEach(item => {
            if (excludedItems.has(item.productId)) {
                excluded += item.subtotal;
            } else {
                active += item.subtotal;
                count++;
            }
        });
        return { activeTotal: active, activeItems: count, excludedTotal: excluded };
    }, [costData, excludedItems]);

    const budgetUtilization = budget > 0 ? (activeTotal / budget) * 100 : 0;
    const remaining = budget - activeTotal;
    const isOverBudget = remaining < 0;
    const isNearBudget = budgetUtilization >= 75 && budgetUtilization < 100;

    const barColor = budgetUtilization >= 100 ? "bg-red-500" : budgetUtilization >= 75 ? "bg-yellow-500" : "bg-green-500";
    const barTextColor = budgetUtilization >= 100 ? "text-red-600" : budgetUtilization >= 75 ? "text-yellow-600" : "text-green-600";

    const averagePrice = activeItems > 0 ? activeTotal / activeItems : 0;

    const handleCopySummary = () => {
        const lines = [
            `Budget Planner Summary`,
            `─────────────────────`,
            `Design: ${costData?.designName || "N/A"}`,
            `Budget: $${budget.toFixed(2)}`,
            `Total Cost: $${activeTotal.toFixed(2)}`,
            `Remaining: $${remaining.toFixed(2)}`,
            `Utilization: ${budgetUtilization.toFixed(1)}%`,
            `Items: ${activeItems}`,
            `Average Price: $${averagePrice.toFixed(2)}`,
            ``,
            `Itemized List:`,
            ...(costData?.itemizedList.filter(i => !excludedItems.has(i.productId)).map(i =>
                `  ${i.name} (x${i.quantity}) - $${i.subtotal.toFixed(2)}`
            ) || []),
        ];
        navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredDesigns = designs.filter(d =>
        d.name.toLowerCase().includes(designSearch.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F5F1E8] overflow-hidden">
            <AdminSidebar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">Budget Planner</h1>
                        <p className="text-sm text-[#1C1C1C]/50 mt-1">Set a budget and track design costs in real-time</p>
                    </div>

                    {/* Budget Input + Design Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Budget */}
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                            <label className="text-sm font-semibold text-[#1C1C1C]/70 uppercase tracking-wider block mb-3">
                                Maximum Budget
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" />
                                    <input
                                        type="number"
                                        value={budgetInput}
                                        onChange={(e) => setBudgetInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleBudgetSet()}
                                        placeholder="Enter budget amount..."
                                        className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#663F23] focus:ring-1 focus:ring-[#663F23]"
                                    />
                                </div>
                                <button
                                    onClick={handleBudgetSet}
                                    className="px-5 py-2.5 bg-[#663F23] text-white rounded-lg text-sm font-medium hover:bg-[#52321A] transition-colors"
                                >
                                    Set
                                </button>
                            </div>
                            {budget > 0 && (
                                <p className="text-xs text-[#1C1C1C]/50 mt-2">
                                    Current budget: <span className="font-semibold text-[#663F23]">${budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                                </p>
                            )}
                        </div>

                        {/* Design Selector */}
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                            <label className="text-sm font-semibold text-[#1C1C1C]/70 uppercase tracking-wider block mb-3">
                                Select Design
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 border border-[#E5E5E5] rounded-lg text-sm text-left hover:border-[#663F23] transition-colors"
                                >
                                    <span className={selectedDesignId ? "text-[#1C1C1C]" : "text-[#1C1C1C]/40"}>
                                        {designs.find(d => d._id === selectedDesignId)?.name || "Choose a design..."}
                                    </span>
                                    {designsLoading ? (
                                        <Loader2 size={14} className="animate-spin text-[#663F23]" />
                                    ) : (
                                        <ChevronDown size={14} className="text-[#1C1C1C]/40" />
                                    )}
                                </button>
                                {showDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-20 max-h-60 overflow-hidden">
                                        <div className="p-2 border-b border-[#E5E5E5]">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" />
                                                <input
                                                    type="text"
                                                    value={designSearch}
                                                    onChange={(e) => setDesignSearch(e.target.value)}
                                                    placeholder="Search designs..."
                                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#E5E5E5] rounded focus:outline-none focus:border-[#663F23]"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto max-h-48">
                                            {filteredDesigns.map(d => (
                                                <button
                                                    key={d._id}
                                                    onClick={() => {
                                                        setSelectedDesignId(d._id);
                                                        setShowDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F1E8] transition-colors ${
                                                        d._id === selectedDesignId ? "bg-[#F5F1E8] text-[#663F23] font-medium" : "text-[#1C1C1C]"
                                                    }`}
                                                >
                                                    {d.name}
                                                </button>
                                            ))}
                                            {filteredDesigns.length === 0 && (
                                                <p className="px-4 py-3 text-sm text-[#1C1C1C]/40 text-center">No designs found</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-[#663F23]" size={32} />
                        </div>
                    )}

                    {!loading && costData && (
                        <>
                            {/* Budget Warning Banners */}
                            {budget > 0 && isOverBudget && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-red-700">Over Budget!</p>
                                        <p className="text-sm text-red-600">You are ${Math.abs(remaining).toFixed(2)} over your budget. Consider removing some items.</p>
                                    </div>
                                </div>
                            )}
                            {budget > 0 && isNearBudget && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-yellow-700">Approaching Budget Limit</p>
                                        <p className="text-sm text-yellow-600">You've used {budgetUtilization.toFixed(1)}% of your budget. ${remaining.toFixed(2)} remaining.</p>
                                    </div>
                                </div>
                            )}

                            {/* Budget Bar */}
                            {budget > 0 && (
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-[#1C1C1C]/70">Budget Utilization</span>
                                        <span className={`text-sm font-bold ${barTextColor}`}>
                                            {budgetUtilization.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-4 bg-[#F5F1E8] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                            style={{ width: `${Math.min(100, budgetUtilization)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-[#1C1C1C]/50">
                                        <span>${activeTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} spent</span>
                                        <span>${budget.toLocaleString("en-US", { minimumFractionDigits: 2 })} budget</span>
                                    </div>
                                </div>
                            )}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign size={16} className="text-[#663F23]" />
                                        <span className="text-xs text-[#1C1C1C]/50 uppercase tracking-wider">Total Cost</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1C1C1C]">${activeTotal.toFixed(2)}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp size={16} className={remaining >= 0 ? "text-green-500" : "text-red-500"} />
                                        <span className="text-xs text-[#1C1C1C]/50 uppercase tracking-wider">Remaining</span>
                                    </div>
                                    <p className={`text-xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {budget > 0 ? `$${remaining.toFixed(2)}` : "N/A"}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package size={16} className="text-[#663F23]" />
                                        <span className="text-xs text-[#1C1C1C]/50 uppercase tracking-wider">Items</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1C1C1C]">{activeItems}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 size={16} className="text-[#663F23]" />
                                        <span className="text-xs text-[#1C1C1C]/50 uppercase tracking-wider">Avg Price</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1C1C1C]">${averagePrice.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Itemized List - "What if" mode */}
                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-[#1C1C1C]/70 uppercase tracking-wider">
                                            Itemized Cost Breakdown
                                        </h2>
                                        <p className="text-xs text-[#1C1C1C]/40 mt-0.5">Toggle items on/off to see how changes affect the total</p>
                                    </div>
                                    <button
                                        onClick={handleCopySummary}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#663F23] border border-[#663F23]/30 rounded-lg hover:bg-[#F5F1E8] transition-colors"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied!" : "Copy Summary"}
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[#E5E5E5]">
                                                <th className="text-left py-3 px-2 text-xs text-[#1C1C1C]/50 uppercase tracking-wider font-semibold w-10">Inc.</th>
                                                <th className="text-left py-3 px-2 text-xs text-[#1C1C1C]/50 uppercase tracking-wider font-semibold">Product</th>
                                                <th className="text-center py-3 px-2 text-xs text-[#1C1C1C]/50 uppercase tracking-wider font-semibold">Qty</th>
                                                <th className="text-right py-3 px-2 text-xs text-[#1C1C1C]/50 uppercase tracking-wider font-semibold">Unit Price</th>
                                                <th className="text-right py-3 px-2 text-xs text-[#1C1C1C]/50 uppercase tracking-wider font-semibold">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {costData.itemizedList.map((item) => {
                                                const isExcluded = excludedItems.has(item.productId);
                                                return (
                                                    <tr
                                                        key={item.productId}
                                                        className={`border-b border-[#E5E5E5]/50 transition-colors ${isExcluded ? "opacity-40" : "hover:bg-[#FAF8F5]"}`}
                                                    >
                                                        <td className="py-3 px-2">
                                                            <button
                                                                onClick={() => toggleItem(item.productId)}
                                                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                                                    isExcluded
                                                                        ? "bg-[#E5E5E5] text-[#1C1C1C]/40"
                                                                        : "bg-[#663F23]/10 text-[#663F23]"
                                                                }`}
                                                            >
                                                                {isExcluded ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <p className={`font-medium ${isExcluded ? "line-through" : ""}`}>{item.name}</p>
                                                            <p className="text-xs text-[#1C1C1C]/40">{item.sku}</p>
                                                        </td>
                                                        <td className="py-3 px-2 text-center">{item.quantity}</td>
                                                        <td className="py-3 px-2 text-right">${item.unitPrice.toFixed(2)}</td>
                                                        <td className="py-3 px-2 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            {excludedTotal > 0 && (
                                                <tr className="border-t border-[#E5E5E5]">
                                                    <td colSpan={4} className="py-2 px-2 text-right text-xs text-[#1C1C1C]/40">Excluded items total:</td>
                                                    <td className="py-2 px-2 text-right text-xs text-[#1C1C1C]/40 line-through">${excludedTotal.toFixed(2)}</td>
                                                </tr>
                                            )}
                                            <tr className="border-t-2 border-[#663F23]/20">
                                                <td colSpan={4} className="py-3 px-2 text-right font-bold text-[#1C1C1C]">Grand Total</td>
                                                <td className="py-3 px-2 text-right text-lg font-bold text-[#663F23]">${activeTotal.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {!loading && !costData && !selectedDesignId && (
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center">
                            <DollarSign size={48} className="mx-auto text-[#663F23]/20 mb-4" />
                            <h3 className="text-lg font-semibold text-[#1C1C1C]/60">Select a design to start planning</h3>
                            <p className="text-sm text-[#1C1C1C]/40 mt-2">Choose a design above and set your budget to see the cost breakdown</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
