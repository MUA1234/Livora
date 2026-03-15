"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import {
    FileText,
    ScrollText,
    Eye,
    RotateCcw,
    Loader2,
    ChevronDown,
    Search
} from "lucide-react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

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

interface DesignOption {
    _id: string;
    name: string;
    status?: string;
}

export default function DesignHistoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <DesignHistory />
        </Suspense>
    );
}

function DesignHistory() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialDesignId = searchParams.get("designId") || searchParams.get("id") || "";

    const [designId, setDesignId] = useState(initialDesignId);
    const [designs, setDesigns] = useState<DesignOption[]>([]);
    const [isListLoading, setIsListLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [designSearch, setDesignSearch] = useState("");

    const [versionsList, setVersionsList] = useState<Version[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

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

    const selectDesign = (id: string) => {
        setDesignId(id);
        setVersionsList([]);
        setSelectedVersion(null);
        setError(null);
        setShowDropdown(false);
        setDesignSearch("");
        router.replace(`/admin/design-history?designId=${id}`, { scroll: false });
    };

    const fetchVersions = useCallback(async () => {
        if (!designId) return;

        try {
            setIsLoading(true);
            const response = await api.get(`/api/designs/${designId}/versions`);

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
                    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
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
        if (designId) fetchVersions();
    }, [designId, fetchVersions]);

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

    const selectedDesignName = designs.find(d => d._id === designId)?.name;
    const filteredDesigns = designs.filter(d =>
        d.name.toLowerCase().includes(designSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] p-8 md:p-12">
                <div className="max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#663F23] mb-1">Design History & Version Control</h1>
                        <p className="text-sm text-[#1C1C1C]/50">Track, compare, and restore previous design versions.</p>
                    </div>

                    {/* Design Selector */}
                    <div className="mb-8 relative">
                        <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-2">Select Design</label>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full flex justify-between items-center px-5 py-4 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#663F23]/30 transition-colors text-left shadow-sm"
                        >
                            <span className={`font-semibold ${designId ? "text-[#1C1C1C]" : "text-[#A8A8A8]"}`}>
                                {selectedDesignName || "Choose a design to view history..."}
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

                    {/* No design selected */}
                    {!designId && !isLoading && (
                        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E5E5]/50 shadow-sm p-8 text-center">
                            <div className="w-12 h-12 bg-[#F5F1E8] text-[#663F23] rounded-full flex items-center justify-center mb-4">
                                <ScrollText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No Design Selected</h3>
                            <p className="text-[#1C1C1C]/50">Choose a design from the dropdown above to view its version history.</p>
                        </div>
                    )}

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
                                <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Full Historical Log</h2>

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