"use client";

import React from 'react';
import Link from 'next/link';
import {
    Box, Maximize2, RotateCw, ZoomIn, ZoomOut,
    Sun, Sunset, Moon, Lightbulb,
    Eye, ChevronDown, ChevronRight, Check,
    Sofa, Table2, Lamp, Library,
    X, Compass, Palette, Ruler, Package, ChevronLeft
} from 'lucide-react';

export default function ThreeDViewer() {
    return (
        <div className="flex h-screen w-full bg-[#f8f6f0] font-sans text-[#1C1C1C] overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[300px] bg-[#fdfbf6] border-r border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.02)] h-full overflow-y-auto hidden-scrollbar">
                {/* Brand Header */}
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#7B4B29] rounded-lg flex items-center justify-center text-white shrink-0">
                        <Box size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#1C1C1C] leading-none">3D Viewer</h1>
                        <p className="text-xs text-[#8C8C8C] mt-1 font-medium">Livora Studio</p>
                    </div>
                </div>

                {/* Camera Controls */}
                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-4">Camera Controls</h2>
                    <div className="flex gap-2 mb-6">
                        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 h-[72px] bg-[#F4F1ED] rounded-xl text-[#1C1C1C] hover:bg-[#EBE7DF] transition-colors border border-[#EBE7DF]">
                            <RotateCw size={18} className="text-[#6C6C6C]" />
                            <span className="text-[11px] font-semibold">Rotate</span>
                        </button>
                        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 h-[72px] bg-[#F4F1ED] rounded-xl text-[#1C1C1C] hover:bg-[#EBE7DF] transition-colors border border-[#EBE7DF]">
                            <ZoomIn size={18} className="text-[#6C6C6C]" />
                            <span className="text-[11px] font-semibold">Zoom In</span>
                        </button>
                        <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 h-[72px] bg-[#F4F1ED] rounded-xl text-[#1C1C1C] hover:bg-[#EBE7DF] transition-colors border border-[#EBE7DF]">
                            <ZoomOut size={18} className="text-[#6C6C6C]" />
                            <span className="text-[11px] font-semibold">Zoom Out</span>
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-[#8C8C8C]">Zoom Level</span>
                            <span className="text-xs font-bold text-[#1C1C1C]">100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                            <div className="absolute left-0 top-0 h-full w-full bg-[#D4C3A3] rounded-full"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#7B4B29] rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"></div>
                        </div>
                    </div>
                </div>

                {/* Lighting */}
                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-4">Lighting</h2>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <button className="flex items-center gap-2 py-2.5 px-3 bg-[#7B4B29] rounded-lg text-white font-medium text-xs justify-center shadow-sm">
                            <Sun size={14} /> Daylight
                        </button>
                        <button className="flex items-center gap-2 py-2.5 px-3 bg-[#F4F1ED] rounded-lg text-[#1C1C1C] font-medium text-xs justify-center hover:bg-[#EBE7DF] transition-colors">
                            <Sunset size={14} className="text-[#6C6C6C]" /> Sunset
                        </button>
                        <button className="flex items-center gap-2 py-2.5 px-3 bg-[#F4F1ED] rounded-lg text-[#1C1C1C] font-medium text-xs justify-center hover:bg-[#EBE7DF] transition-colors">
                            <Moon size={14} className="text-[#6C6C6C]" /> Night
                        </button>
                        <button className="flex items-center gap-2 py-2.5 px-3 bg-[#F4F1ED] rounded-lg text-[#1C1C1C] font-medium text-xs justify-center hover:bg-[#EBE7DF] transition-colors">
                            <Lightbulb size={14} className="text-[#6C6C6C]" /> Studio
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-[#8C8C8C]">Intensity</span>
                            <span className="text-xs font-bold text-[#1C1C1C]">75%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                            <div className="absolute left-0 top-0 h-full w-[75%] bg-[#D4C3A3] rounded-full"></div>
                            <div className="absolute left-[75%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#7B4B29] rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"></div>
                        </div>
                    </div>
                </div>

                {/* Shading */}
                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">Shading</h2>
                        <Eye size={14} className="text-[#A8A8A8]" />
                    </div>
                    <div className="flex bg-[#F4F1ED] rounded-xl p-1">
                        <button className="flex-1 py-2 text-xs font-bold text-white bg-[#D4C3A3] rounded-lg shadow-sm">Smooth</button>
                        <button className="flex-1 py-2 text-xs font-semibold text-[#6C6C6C] hover:text-[#1C1C1C]">Flat</button>
                        <button className="flex-1 py-2 text-xs font-semibold text-[#6C6C6C] hover:text-[#1C1C1C]">Wireframe</button>
                    </div>
                </div>

                {/* Furniture in Scene */}
                <div className="px-6 py-6">
                    <div className="flex justify-between items-center mb-4 cursor-pointer">
                        <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">Furniture in Scene</h2>
                        <ChevronDown size={14} className="text-[#A8A8A8]" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 p-3 bg-[#F4F1ED] rounded-xl border border-[#EBE7DF]">
                            <div className="w-8 h-8 rounded-lg bg-white bg-opacity-50 flex items-center justify-center shrink-0">
                                <Sofa size={16} className="text-[#7B4B29]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#1C1C1C]">Modern Sofa</h3>
                                <p className="text-[10px] text-[#8C8C8C] mt-0.5">200 × 85 × 90 cm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent hover:border-[#EBE7DF] transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-[#F4F1ED] flex items-center justify-center shrink-0">
                                <Package size={16} className="text-[#6C6C6C]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#1C1C1C]">Coffee Table</h3>
                                <p className="text-[10px] text-[#8C8C8C] mt-0.5">120 × 45 × 60 cm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent hover:border-[#EBE7DF] transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-[#F4F1ED] flex items-center justify-center shrink-0">
                                <Lamp size={16} className="text-[#6C6C6C]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#1C1C1C]">Floor Lamp</h3>
                                <p className="text-[10px] text-[#8C8C8C] mt-0.5">40 × 160 × 40 cm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent hover:border-[#EBE7DF] transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-[#F4F1ED] flex items-center justify-center shrink-0">
                                <Library size={16} className="text-[#6C6C6C]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#1C1C1C]">Bookshelf</h3>
                                <p className="text-[10px] text-[#8C8C8C] mt-0.5">80 × 180 × 35 cm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#EFEBE0] relative">
                {/* Header */}
                <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 border-b border-transparent z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/2d-layout" className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1C1C1C] hover:bg-gray-100 shadow-sm transition-colors">
                            <ChevronLeft size={18} />
                        </Link>
                        <h1 className="text-[17px] font-bold text-[#1C1C1C]">Living Room Design</h1>
                        <span className="px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-full">Auto-saved</span>
                    </div>
                    <button className="text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors">
                        <Maximize2 size={18} />
                    </button>
                </header>

                {/* Floating controls in 3D view */}
                <div className="absolute top-20 left-8 flex flex-col gap-2 z-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-[#A8A8A8] uppercase">ENV:</span>
                        <span className="text-[11px] font-bold text-[#1C1C1C]">Daylight</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-[#A8A8A8] uppercase">SHADE:</span>
                        <span className="text-[11px] font-bold text-[#1C1C1C]">smooth</span>
                    </div>
                </div>

                <div className="absolute top-20 right-8 z-10">
                    <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center relative">
                        <div className="absolute top-1 text-[8px] font-bold text-[#1C1C1C]">N</div>
                        <div className="absolute right-1 text-[8px] font-bold text-[#A8A8A8]">E</div>
                        <div className="absolute bottom-1 text-[8px] font-bold text-[#A8A8A8]">S</div>
                        <div className="absolute left-1 text-[8px] font-bold text-[#A8A8A8]">W</div>
                        <div className="w-2.5 h-2.5 rotate-45 border-t-2 border-r-2 border-[#1C1C1C] -translate-y-0.5 -translate-x-0.5"></div>
                    </div>
                </div>

                {/* 3D Scene Mockup */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Scene Container */}
                    <div className="relative w-[600px] h-[400px] flex items-end justify-center perspective-[1000px] transform-gpu scale-110">
                        {/* Bookshelf */}
                        <div className="absolute left-[5%] bottom-[15%] w-16 h-48 bg-[#C8A27B] rounded-sm flex flex-col">
                            {/* Shelves */}
                            <div className="w-full h-1/4 border-b-2 border-[#A37B52]"></div>
                            <div className="w-full h-1/4 border-b-2 border-[#A37B52]"></div>
                            <div className="w-full h-1/4 border-b-2 border-[#A37B52]"></div>
                            {/* Books */}
                            <div className="w-full h-1/4 relative flex items-end pb-1 px-2 gap-1">
                                <div className="w-2 h-6 bg-[#A37B52]"></div>
                                <div className="w-2 h-8 bg-[#8B5A2B]"></div>
                            </div>
                            <div className="absolute -left-1 w-1 h-full bg-[#A37B52] rounded-l-sm skew-y-[45deg] origin-right"></div>
                        </div>

                        {/* Modern Sofa */}
                        <div className="absolute bottom-[10%] w-[320px] h-32 relative z-10">
                            {/* Backrest */}
                            <div className="absolute bottom-6 left-0 w-full h-24 bg-[#8B5A2B] rounded-t-3xl border-4 border-[#A37B52] shadow-inner"></div>
                            {/* Cushions */}
                            <div className="absolute bottom-6 left-[10%] w-[38%] h-12 bg-[#6E421E] rounded-md shadow-inner"></div>
                            <div className="absolute bottom-6 right-[10%] w-[38%] h-12 bg-[#6E421E] rounded-md shadow-inner"></div>
                            {/* Seating */}
                            <div className="absolute bottom-2 left-0 w-full h-12 bg-[#A37B52] rounded-xl shadow-lg border-b-4 border-[#8B5A2B]"></div>
                            {/* Legs */}
                            <div className="absolute -bottom-2 left-8 w-1.5 h-4 bg-[#4A2D13] rounded-b-sm"></div>
                            <div className="absolute -bottom-2 right-8 w-1.5 h-4 bg-[#4A2D13] rounded-b-sm"></div>
                        </div>

                        {/* Coffee Table */}
                        <div className="absolute bottom-[5%] right-[20%] w-28 h-12 z-20">
                            <div className="absolute top-0 left-0 w-full h-3 bg-[#A37B52] rounded-full shadow-sm"></div>
                            <div className="absolute top-3 left-[20%] w-2 h-9 bg-[#6E421E] rounded-b-sm"></div>
                            <div className="absolute top-3 right-[20%] w-2 h-9 bg-[#6E421E] rounded-b-sm"></div>
                        </div>

                        {/* Floor Lamp */}
                        <div className="absolute right-[10%] bottom-[15%] flex flex-col items-center">
                            {/* Shade */}
                            <div className="w-16 h-10 bg-[#F4D03F] rounded-t-2xl rounded-b-sm opacity-90 shadow-lg relative z-10"></div>
                            {/* Pole */}
                            <div className="w-1.5 h-40 bg-[#A8A8A8]"></div>
                            {/* Base */}
                            <div className="w-12 h-1.5 bg-[#A8A8A8] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] bg-[#fdfbf6] border-l border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)] h-full overflow-y-auto hidden-scrollbar">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4F1ED] rounded-lg flex items-center justify-center shrink-0">
                            <Palette size={18} className="text-[#8B5A2B]" />
                        </div>
                        <div>
                            <h2 className="text-[13px] font-bold text-[#1C1C1C] leading-none">Customize</h2>
                            <p className="text-[11px] text-[#8C8C8C] mt-1 font-medium">Sofa Selected</p>
                        </div>
                    </div>
                    <button className="text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Dimensions */}
                <div className="p-6 border-b border-[#E5E5E5]">
                    <div className="flex justify-between items-center mb-6 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Ruler size={14} className="text-[#A8A8A8]" />
                            <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">Dimensions</h3>
                        </div>
                        <ChevronDown size={14} className="text-[#A8A8A8]" />
                    </div>

                    <div className="space-y-5">
                        {/* Width */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-[#8C8C8C]">Width</span>
                                <span className="text-xs font-bold text-[#1C1C1C]">200 cm</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                                <div className="absolute left-0 top-0 h-full w-full bg-[#D4C3A3] rounded-full"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#7B4B29] rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"></div>
                            </div>
                        </div>
                        {/* Height */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-[#8C8C8C]">Height</span>
                                <span className="text-xs font-bold text-[#1C1C1C]">85 cm</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                                <div className="absolute left-0 top-0 h-full w-[40%] bg-[#D4C3A3] rounded-full"></div>
                                <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#7B4B29] rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"></div>
                            </div>
                        </div>
                        {/* Depth */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-[#8C8C8C]">Depth</span>
                                <span className="text-xs font-bold text-[#1C1C1C]">90 cm</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                                <div className="absolute left-0 top-0 h-full w-[80%] bg-[#D4C3A3] rounded-full"></div>
                                <div className="absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#7B4B29] rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color */}
                <div className="p-6 border-b border-[#E5E5E5]">
                    <div className="flex justify-between items-center mb-5 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Palette size={14} className="text-[#A8A8A8]" />
                            <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">Color</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-y-3 gap-x-2 mb-6">
                        <div className="aspect-square rounded-lg bg-[#6E421E] border-2 border-[#1C1C1C] ring-2 ring-transparent ring-offset-1 flex items-center justify-center"></div>
                        <div className="aspect-square rounded-lg bg-[#1C1C1C]"></div>
                        <div className="aspect-square rounded-lg bg-[#F8F6F0] border border-[#E5E5E5]"></div>
                        <div className="aspect-square rounded-lg bg-[#C8A27B]"></div>
                        <div className="aspect-square rounded-lg bg-[#8B4513]"></div>
                        <div className="aspect-square rounded-lg bg-[#2F4F4F]"></div>
                        <div className="aspect-square rounded-lg bg-[#800000]"></div>
                        <div className="aspect-square rounded-lg bg-[#D2B48C]"></div>
                        <div className="aspect-square rounded-lg bg-[#556B2F]"></div>
                        <div className="aspect-square rounded-lg bg-[#3E2723]"></div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[#8C8C8C]">Custom:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-[#6E421E]"></div>
                            <span className="text-[11px] font-bold text-[#A8A8A8]">#663F23</span>
                        </div>
                    </div>
                </div>

                {/* Texture */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Box size={14} className="text-[#A8A8A8]" />
                            <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">Texture</h3>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between p-3 bg-white border border-[#D4C3A3] rounded-xl shadow-sm cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4C3A3]"></div>
                            <div className="flex items-center gap-3 relative z-10 pl-2">
                                <div className="w-5 h-5 rounded shrink-0 bg-[#6E421E] bg-opacity-80"></div>
                                <span className="text-[13px] font-bold text-[#1C1C1C]">Leather</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#D4C3A3]">Active</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#F8F6F0] rounded-xl cursor-pointer hover:bg-[#F4F1ED] transition-colors border border-transparent">
                            <div className="w-5 h-5 rounded shrink-0 bg-[#A8A8A8]"></div>
                            <span className="text-[13px] font-bold text-[#1C1C1C]">Fabric</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#F8F6F0] rounded-xl cursor-pointer hover:bg-[#F4F1ED] transition-colors border border-transparent">
                            <div className="w-5 h-5 rounded shrink-0 bg-[#C8A27B]"></div>
                            <span className="text-[13px] font-bold text-[#1C1C1C]">Wood</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#F8F6F0] rounded-xl cursor-pointer hover:bg-[#F4F1ED] transition-colors border border-transparent">
                            <div className="w-5 h-5 rounded shrink-0 bg-[#8C8C8C]"></div>
                            <span className="text-[13px] font-bold text-[#1C1C1C]">Metal</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#F8F6F0] rounded-xl cursor-pointer hover:bg-[#F4F1ED] transition-colors border border-transparent">
                            <div className="w-5 h-5 rounded shrink-0 bg-[#4B0082]"></div>
                            <span className="text-[13px] font-bold text-[#1C1C1C]">Velvet</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hidden-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hidden-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </div>
    );
}
