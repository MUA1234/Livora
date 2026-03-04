import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Save, ArrowLeft, ArrowRight, ArrowLeftRight, ArrowUpDown, MoveVertical } from "lucide-react";

export default function RoomSetup() {
    return (
        <div className="min-h-screen bg-[#F5F1E8] flex flex-col font-sans text-[#1C1C1C] py-10 px-6 sm:px-12 md:px-20 lg:px-40 xl:px-60">
            {/* Back Navigation */}
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#663F23] hover:text-[#4A2D19] transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1C1C1C]">Room Setup</h1>
                    <p className="text-[#1C1C1C]/50 mt-1">Configure your room before entering the 2D layout editor.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] text-[#1C1C1C] font-semibold rounded-xl hover:bg-[#F9F9F9] transition-colors shadow-sm">
                    <Save size={18} />
                    Save Draft
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
                            className="bg-[#E5E5E5]/50 border-none rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#C6A75E] w-full"
                            placeholder=""
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
                                <button className="bg-[#663F23] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                                    Meters
                                </button>
                                <button className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] px-6 py-2 rounded-full text-sm font-medium transition-colors">
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
                                        type="text"
                                        defaultValue="0.00"
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        m
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
                                        type="text"
                                        defaultValue="0.00"
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        m
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
                                        type="text"
                                        defaultValue="0.00"
                                        className="bg-[#C6A75E] text-[#663F23] border border-transparent rounded-full px-4 py-3 w-full text-left font-medium outline-none focus:border-[#663F23]"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#663F23] font-medium">
                                        m
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
                        <button className="bg-[#C6A75E] hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]">
                            <div className="w-16 h-8 border-2 border-[#663F23] bg-white"></div>
                            <span className="text-sm font-semibold">Rectangle</span>
                        </button>
                        <button className="bg-[#C6A75E] hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]">
                            <div className="w-10 h-10 border-2 border-[#663F23] bg-white"></div>
                            <span className="text-sm font-semibold">Square</span>
                        </button>
                        <button className="bg-[#C6A75E] hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]">
                            <div className="w-12 h-12 border-2 border-[#663F23] bg-white relative">
                                <div className="absolute top-0 right-0 w-6 h-6 bg-[#C6A75E] border-l-2 border-b-2 border-[#663F23]"></div>
                            </div>
                            <span className="text-sm font-semibold">L - shape</span>
                        </button>
                        <button className="bg-[#C6A75E] hover:bg-[#b09452] transition-colors rounded-lg flex flex-col items-center justify-center p-6 gap-3 text-[#663F23]">
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
                            <div key={i} className={`relative pt-[100%] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${tex.bg}`}>
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
                            <div key={i} className={`relative pt-[100%] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${tex.bg}`}>
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
                            <div className="w-12 h-12 bg-[#E1C699] rounded-lg"></div>
                            <div className="w-12 h-12 bg-[#F6F5CA] rounded-lg"></div>
                            <div className="bg-[#1C1C1C]/5 px-4 py-2.5 rounded-lg flex items-center justify-center font-medium text-[#1C1C1C]">
                                #F5F1E8
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 justify-between">
                        {[
                            "bg-orange-500", "bg-[#4B5320]", "bg-pink-400", "bg-lime-300",
                            "bg-green-600", "bg-blue-600", "bg-[#0A3622]", "bg-[#900D2D]",
                            "bg-[#E1C699]", "bg-[#6495ED]", "bg-yellow-400"
                        ].map((colorClass, i) => (
                            <button key={i} className={`w-10 h-10 rounded-xl ${colorClass} hover:scale-110 transition-transform shadow-sm`}></button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 bg-white p-4 rounded-2xl shadow-sm border border-[#E5E5E5]/50">
                <Link href="/admin/2d-layout" className="w-full sm:w-auto px-8 py-3.5 bg-[#663F23] text-white font-semibold rounded-xl hover:bg-[#52321c] transition-colors flex items-center justify-center gap-2">
                    Continue to 2D Layout
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
