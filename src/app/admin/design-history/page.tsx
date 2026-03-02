"use client";

import { useState } from "react";
import Link from "next/link";
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
    RotateCcw
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

const versions: Version[] = [
    {
        id: "v3.0",
        version: "Version 3.0",
        date: "Feb 20,2025",
        time: "2:32P.M",
        description: "Updated wall color to stage green",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
        savedBy: "Admin",
        saveType: "Manual",
    },
    {
        id: "v2.0",
        version: "Version 2.0",
        date: "Feb 20,2025",
        time: "2:32P.M",
        description: "Updated wall color to stage green",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
        savedBy: "Admin",
        saveType: "Auto",
    },
    {
        id: "v1.1",
        version: "Version 1.1",
        date: "Feb 20,2025",
        time: "2:32P.M",
        description: "Updated wall color to stage green",
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800",
        savedBy: "System",
        saveType: "Manual",
    },
    {
        id: "v1.0",
        version: "Version 1.0",
        date: "Feb 20,2025",
        time: "2:32P.M",
        description: "Updated wall color to stage green",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
        savedBy: "Admin",
        saveType: "Auto",
    },
];

export default function DesignHistory() {
    const [selectedVersion, setSelectedVersion] = useState<Version>(versions[0]);

    const handleRestore = () => {
        alert(`Restoring ${selectedVersion.version}...`);
    };

    const handleCompare = () => {
        alert(`Comparing ${selectedVersion.version} with current version...`);
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

                <div className="p-4 border-t border-[#E5E5E5]/50">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
                        <Settings size={20} />
                        <span className="font-medium text-sm">Settings</span>
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#E5E5E5]/50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C]">Sara Samarasinghe</span>
                            <span className="text-[10px] text-[#1C1C1C]/50">Lead Designer</span>
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

                    {/* Version Timeline + Preview */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Version Timeline */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Version Timeline</h2>

                            <div className="space-y-0">
                                {versions.map((v, index) => (
                                    <div key={v.id} className="relative flex gap-4">
                                        {/* Timeline line */}
                                        {index < versions.length - 1 && (
                                            <div className="absolute left-[9px] top-6 w-[2px] h-full bg-[#E5E5E5]"></div>
                                        )}

                                        {/* Timeline dot */}
                                        <div className="relative z-10 mt-1.5">
                                            <div className={`w-5 h-5 rounded-full border-2 ${selectedVersion.id === v.id ? "bg-[#C6A75E] border-[#C6A75E]" : "bg-[#E5E5E5] border-[#E5E5E5]"}`}></div>
                                        </div>

                                        {/* Content */}
                                        <button
                                            onClick={() => setSelectedVersion(v)}
                                            className={`flex-1 text-left p-4 rounded-xl mb-4 transition-all ${selectedVersion.id === v.id ? "bg-[#F5F1E8] border border-[#E5E5E5]/50 shadow-sm" : "hover:bg-[#F5F1E8]/50"}`}
                                        >
                                            <h3 className="font-bold text-[#1C1C1C] text-sm">{v.version}</h3>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-xs text-[#1C1C1C]/50">{v.date}</span>
                                                <span className="text-xs text-[#1C1C1C]/50">{v.time}</span>
                                            </div>
                                            <p className="text-xs text-[#1C1C1C]/40 mt-1">{v.description}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Version Preview */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1C1C1C] mb-1">Version Preview</h2>
                            <p className="text-sm text-[#1C1C1C]/50 mb-4">
                                {selectedVersion.version} — {selectedVersion.date.replace(",", ", ")}
                            </p>

                            {/* Preview Image */}
                            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-6">
                                <Image
                                    src={selectedVersion.image}
                                    alt={selectedVersion.version}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleRestore}
                                    className="px-6 py-3 bg-[#663F23] text-white text-sm font-medium rounded-full hover:bg-[#4A2D19] transition-colors"
                                >
                                    Restore Version
                                </button>
                                <button
                                    onClick={handleCompare}
                                    className="px-6 py-3 bg-white text-[#1C1C1C] text-sm font-medium rounded-full border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                                >
                                    Compare with current
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auto-Save History Log */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Auto-Save History Log</h2>

                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E5E5]/50">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Version ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Saved By</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Save Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Timestamp</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#663F23]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {versions.map((v, index) => (
                                    <tr key={v.id} className="border-b border-[#E5E5E5]/30 hover:bg-[#F5F1E8]/30 transition-colors">
                                        <td className="py-4 px-4 text-sm font-semibold text-[#1C1C1C]">{v.id.toUpperCase().replace("V", "V")}</td>
                                        <td className="py-4 px-4 text-sm text-[#1C1C1C]">{v.savedBy}</td>
                                        <td className="py-4 px-4 text-sm text-[#1C1C1C]">{v.saveType}</td>
                                        <td className="py-4 px-4 text-sm text-[#1C1C1C]">
                                            {v.date.replace(",", "-").replace(" ", "")} {v.time.replace("P.M", "").replace(":", ":")}
                                        </td>
                                        <td className="py-4 px-4">
                                            {index === 0 ? (
                                                <span className="text-xs text-[#1C1C1C]/30">Current</span>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setSelectedVersion(v)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E5E5] text-[#1C1C1C]/40 hover:text-[#663F23] hover:border-[#663F23] transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => alert(`Restoring ${v.version}...`)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E5E5] text-[#1C1C1C]/40 hover:text-[#663F23] hover:border-[#663F23] transition-colors"
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
            </main>
        </div>
    );
}