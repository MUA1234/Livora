"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Save,
    ArrowRight,
    ArrowLeftRight,
    ArrowUpDown,
    MoveVertical,
    ChevronDown,
    FolderOpen,
    Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { Toast } from "@/components/ui/Toast";
import { getUser } from "@/lib/auth";

export default function RoomSetup() {
    const router = useRouter();
    const [adminUser, setAdminUser] = useState<any>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        setAdminUser(getUser());
    }, []);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [showDraftsList, setShowDraftsList] = useState(false);
    
    // Form State
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomName, setRoomName] = useState("");
    const [dimensions, setDimensions] = useState({
        length: 5.0,
        width: 4.0,
        height: 2.4,
        unit: "m" as "m" | "ft"
    });
    const [shape, setShape] = useState("rectangle");
    const [wallTexture, setWallTexture] = useState("Plaster");
    const [floorTexture, setFloorTexture] = useState("Hardwood");
    const [wallColor, setWallColor] = useState("#F5F1E8");

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            setIsLoadingDrafts(true);
            const response = await api.get("/api/rooms");
            setDrafts(response.data.data || []);
        } catch (err) {
            console.error("Error fetching drafts:", err);
        } finally {
            setIsLoadingDrafts(false);
        }
    };

    const handleSave = async () => {
        if (!roomName) {
            setToast({ message: "Please enter a room name", type: "error" });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                name: roomName,
                dimensions: {
                    length: Number(dimensions.length),
                    width: Number(dimensions.width),
                    height: Number(dimensions.height),
                    unit: dimensions.unit === "m" ? "m" : "ft" // Backend expects 'm', 'cm', 'inch', 'ft'
                },
                shape,
                walls: {
                    texture: wallTexture,
                    color: wallColor
                },
                flooring: {
                    texture: floorTexture
                }
            };

            if (roomId) {
                await api.put(`/api/rooms/${roomId}`, payload);
                setToast({ message: "Room updated successfully", type: "success" });
            } else {
                const response = await api.post("/api/rooms", payload);
                setRoomId(response.data.data._id);
                setToast({ message: "Room saved as draft", type: "success" });
                fetchDrafts();
            }
        } catch (err: any) {
            console.error("Error saving room:", err);
            setToast({ message: err?.response?.data?.message || "Failed to save room", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const loadDraft = async (id: string) => {
        try {
            const response = await api.get(`/api/rooms/${id}`);
            const room = response.data.data;
            
            setRoomId(room._id);
            setRoomName(room.name);
            setDimensions({
                length: room.dimensions.length,
                width: room.dimensions.width,
                height: room.dimensions.height,
                unit: room.dimensions.unit === "m" || room.dimensions.unit === "ft" ? room.dimensions.unit : "m"
            });
            setShape(room.shape || "rectangle");
            setWallTexture(room.walls?.texture || "Plaster");
            setWallColor(room.walls?.color || "#F5F1E8");
            setFloorTexture(room.flooring?.texture || "Hardwood");
            
            setShowDraftsList(false);
            setToast({ message: "Draft loaded successfully", type: "success" });
        } catch (err) {
            console.error("Error loading draft:", err);
            setToast({ message: "Failed to load draft", type: "error" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto p-10">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-6 flex items-center justify-end">
                <div className="relative">
                    <button
                        onClick={() => setShowDraftsList(!showDraftsList)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white text-sm font-semibold rounded-lg border border-[#E5E5E5] transition-all"
                    >
                        <FolderOpen size={16} />
                        Load saved draft
                        <ChevronDown size={14} className={`transition-transform ${showDraftsList ? "rotate-180" : ""}`} />
                    </button>

                    {showDraftsList && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E5E5E5] z-50 overflow-hidden">
                            <div className="p-3 border-b border-[#E5E5E5] bg-[#F5F1E8]/30">
                                <span className="text-xs font-bold text-[#1C1C1C]/40 uppercase tracking-widest">Saved Rooms</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {isLoadingDrafts ? (
                                    <div className="p-4 flex justify-center text-[#663F23]">
                                        <Loader2 size={24} className="animate-spin" />
                                    </div>
                                ) : drafts.length > 0 ? (
                                    drafts.map((draft) => (
                                        <button
                                            key={draft._id}
                                            onClick={() => loadDraft(draft._id)}
                                            className="w-full text-left px-4 py-3 hover:bg-[#F5F1E8] transition-colors border-b border-[#E5E5E5]/50 last:border-0"
                                        >
                                            <p className="text-sm font-bold text-[#1C1C1C] truncate">{draft.name}</p>
                                            <p className="text-[10px] text-[#1C1C1C]/40 mt-0.5">
                                                {draft.dimensions.length}x{draft.dimensions.width}m • {draft.shape}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-xs text-[#1C1C1C]/40">No saved drafts found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1C1C1C]">Room Setup</h1>
                    <p className="text-[#1C1C1C]/50 mt-1">Configure your room before entering the 2D layout editor.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] text-[#1C1C1C] font-semibold rounded-xl hover:bg-[#F9F9F9] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {roomId ? "Update Room" : "Save Draft"}
                </button>
            </header>

            <div className="flex flex-col gap-6">
                {/* Room Name */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[#1C1C1C] font-medium">Room Name</h2>
                        <p className="text-[#1C1C1C]/50 text-sm">Give your room a descriptive name for easy identification.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#1C1C1C]">Room Name *</label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="bg-[#E5E5E5]/50 border-none rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#C6A75E] w-full"
                            placeholder="e.g. Master Living Room"
                        />
                    </div>
                </section>

                {/* Room Dimensions */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-6">
                    <div>
                        <h2 className="text-[#1C1C1C] font-medium">Room Dimensions</h2>
                        <p className="text-[#1C1C1C]/50 text-sm">Enter the physical dimensions of the room.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="text-sm font-medium text-[#1C1C1C] block mb-2">Measurement Unit</span>
                            <div className="inline-flex bg-[#F5F1E8] rounded-full p-1">
                                <button 
                                    onClick={() => setDimensions({ ...dimensions, unit: "m" })}
                                    className={`${dimensions.unit === "m" ? "bg-[#663F23] text-white" : "text-[#1C1C1C]/60 hover:text-[#1C1C1C]"} px-6 py-2 rounded-full text-sm font-medium transition-colors`}
                                >
                                    Meters
                                </button>
                                <button 
                                    onClick={() => setDimensions({ ...dimensions, unit: "ft" })}
                                    className={`${dimensions.unit === "ft" ? "bg-[#663F23] text-white" : "text-[#1C1C1C]/60 hover:text-[#1C1C1C]"} px-6 py-2 rounded-full text-sm font-medium transition-colors`}
                                >
                                    Feet
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1C1C1C] justify-center">
                                    <ArrowLeftRight size={14} />
                                    Length *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.length}
                                        onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        {dimensions.unit}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1C1C1C] justify-center">
                                    <MoveVertical size={14} />
                                    Width *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.width}
                                        onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        {dimensions.unit}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1C1C1C] justify-center">
                                    <ArrowUpDown size={14} />
                                    Height *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.height}
                                        onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        {dimensions.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Room Shape */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[#1C1C1C] font-medium">Room Shape</h2>
                        <p className="text-[#1C1C1C]/50 text-sm">Select the shape that best matches your room layout.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <button 
                            onClick={() => setShape("rectangle")}
                            className={`${shape === "rectangle" ? "bg-[#b09452] shadow-inner" : "bg-[#C6A75E]"} hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]`}
                        >
                            <div className="w-16 h-8 border-2 border-[#663F23] bg-white"></div>
                            <span className="text-sm font-semibold">Rectangle</span>
                        </button>
                        <button 
                            onClick={() => setShape("square")}
                            className={`${shape === "square" ? "bg-[#b09452] shadow-inner" : "bg-[#C6A75E]"} hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]`}
                        >
                            <div className="w-10 h-10 border-2 border-[#663F23] bg-white"></div>
                            <span className="text-sm font-semibold">Square</span>
                        </button>
                        <button 
                            onClick={() => setShape("l-shape")}
                            className={`${shape === "l-shape" ? "bg-[#b09452] shadow-inner" : "bg-[#C6A75E]"} hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]`}
                        >
                            <div className="w-12 h-12 border-2 border-[#663F23] bg-white relative">
                                <div className="absolute top-0 right-0 w-6 h-6 bg-[#C6A75E] border-l-2 border-b-2 border-[#663F23]"></div>
                            </div>
                            <span className="text-sm font-semibold">L - shape</span>
                        </button>
                        <button 
                            onClick={() => setShape("custom")}
                            className={`${shape === "custom" ? "bg-[#b09452] shadow-inner" : "bg-[#C6A75E]"} hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]`}
                        >
                            <div className="relative w-12 h-10 border-2 border-[#663F23] bg-white flex items-center justify-center" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}>
                                <div className="w-2 h-2 rounded-full border border-[#663F23]"></div>
                            </div>
                            <span className="text-sm font-semibold">Custom</span>
                        </button>
                    </div>
                </section>

                {/* Wall Texture */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[#1C1C1C] font-medium">Wall Texture</h2>
                        <p className="text-[#1C1C1C]/50 text-sm">Choose a wall surface texture for the room.</p>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: "Plaster", bg: "bg-orange-100" },
                            { name: "Wood panel", bg: "bg-orange-200" },
                            { name: "Concrete", bg: "bg-gray-300" },
                            { name: "Brick", bg: "bg-red-400" },
                            { name: "Stucco", bg: "bg-stone-200" },
                            { name: "Exposed Brick", bg: "bg-red-800" },
                        ].map((tex, i) => (
                            <div 
                                key={i} 
                                onClick={() => setWallTexture(tex.name)}
                                className={`relative pt-[100%] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all ${tex.bg} ${wallTexture === tex.name ? "ring-4 ring-[#663F23] ring-inset scale-95" : ""}`}
                            >
                                <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center">
                                    <span className="text-white text-xs font-medium">{tex.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Floor Texture */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[#1C1C1C] font-medium">Floor Texture</h2>
                        <p className="text-[#1C1C1C]/50 text-sm">Select the floor surface material for the room.</p>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: "Laminate", bg: "bg-[#5c3a21]" },
                            { name: "Ceramic", bg: "bg-gray-300" },
                            { name: "Hardwood", bg: "bg-[#e5cda3]" },
                            { name: "Carpet", bg: "bg-emerald-700" },
                            { name: "Marble 1", bg: "bg-stone-200" },
                            { name: "Marble 2", bg: "bg-orange-100" },
                        ].map((tex, i) => (
                            <div 
                                key={i} 
                                onClick={() => setFloorTexture(tex.name)}
                                className={`relative pt-[100%] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all ${tex.bg} ${floorTexture === tex.name ? "ring-4 ring-[#663F23] ring-inset scale-95" : ""}`}
                            >
                                <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center">
                                    <span className="text-white text-xs font-medium">{tex.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Wall Colour */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]/50 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h2 className="text-[#1C1C1C] font-medium">Wall Colour</h2>
                            <p className="text-[#1C1C1C]/50 text-sm">Choose the primary wall colour for this room.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: wallColor }}></div>
                            <div className="bg-[#1C1C1C]/5 px-4 py-2.5 rounded-lg flex items-center justify-center font-bold text-[#1C1C1C] uppercase tracking-wider">
                                {wallColor}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 justify-between">
                        {[
                            "#F5F1E8", "#E1C699", "#4B5320", "#900D2D",
                            "#0A3622", "#6495ED", "#FF8C00", "#FFC0CB",
                            "#ADFF2F", "#008000", "#FFFF00"
                        ].map((color, i) => (
                            <button 
                                key={i} 
                                onClick={() => setWallColor(color)}
                                className={`w-10 h-10 rounded-xl hover:scale-110 transition-transform shadow-sm ${wallColor === color ? "ring-2 ring-[#663F23] ring-offset-2" : ""}`}
                                style={{ backgroundColor: color }}
                            ></button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="flex justify-end mt-8">
                <Link
                    href={roomId ? `/admin/2d-layout?roomId=${roomId}` : "#"}
                    onClick={(e) => {
                        if (!roomId) {
                            e.preventDefault();
                            setToast({ message: "Please save the room configuration first", type: "info" });
                        }
                    }}
                    className={`px-8 py-3.5 bg-[#663F23] text-white font-semibold rounded-xl hover:bg-[#52321c] transition-colors flex items-center justify-center gap-2 ${!roomId ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Continue to 2D Layout
                    <ArrowRight size={18} />
                </Link>
            </div>

            </main>
        </div>
    );
}
