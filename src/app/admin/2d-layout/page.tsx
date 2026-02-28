import React from 'react';
import Link from 'next/link';
import { Save, ChevronLeft, ChevronRight, RotateCw, Box, Palette, Ruler, Minus } from 'lucide-react';

export default function TwoDLayoutEditor() {
    const tools = [
        { name: 'Add wall', type: 'wall' },
        { name: 'Add wardrobe', type: 'wardrobe' },
        { name: 'Add bed', type: 'bed' },
        { name: 'Add TV', type: 'tv' },
        { name: 'Add Chair', type: 'chair' },
        { name: 'Add refrigerator', type: 'refrigerator' },
        { name: 'Add table', type: 'table' },
        { name: 'Add sofa', type: 'sofa' },
    ];

    return (
        <div className="flex h-screen w-full bg-white font-sans text-[#1C1C1C] overflow-hidden">

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-[#E5E5E5] bg-white z-10">
                    <h1 className="text-3xl font-medium text-[#1C1C1C]">2D Layout Editor</h1>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#E5E5E5] text-[#1C1C1C] font-semibold rounded-xl hover:bg-[#F9F9F9] transition-colors shadow-sm">
                            <Save size={18} />
                            Save
                        </button>
                        <button className="flex items-center gap-3 px-6 py-2.5 bg-[#663F23] text-white font-semibold rounded-xl hover:bg-[#52321c] transition-colors shadow-sm">
                            <Box size={18} />
                            3D view
                        </button>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="bg-[#C6A75E] px-8 py-3 flex items-center gap-8 z-10">
                    <button className="flex items-center gap-2 text-[#663F23] hover:opacity-80 transition-opacity">
                        <ChevronLeft size={18} />
                        <span className="text-sm font-medium">Undo</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#663F23] hover:opacity-80 transition-opacity">
                        <ChevronRight size={18} />
                        <span className="text-sm font-medium">Redo</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#663F23] hover:opacity-80 transition-opacity ml-4">
                        <RotateCw size={18} />
                        <span className="text-sm font-medium">Rotate</span>
                    </button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Grid Canvas */}
                    <div className="flex-1 relative bg-[#F5F1E8]">
                        {/* Dashed Grid from Design */}
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#CDAF70" strokeWidth="1" strokeDasharray="4 4" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Right Sidebar Tools */}
                    <div className="w-[380px] bg-white border-l border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.05)]">
                        {/* Tabs */}
                        <div className="flex border-b border-[#E5E5E5]">
                            <button className="flex-1 py-4 text-center font-bold text-[#663F23] border-b-2 border-[#663F23]">
                                Tools
                            </button>
                            <button className="flex-1 py-4 text-center font-medium text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">
                                Properties
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
                            {/* Tool Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {tools.map((tool, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="aspect-[4/3] bg-gray-50 rounded-md border border-[#E5E5E5] overflow-hidden flex items-center justify-center p-4">
                                            {/* CSS-based Mockups for the furniture objects */}
                                            {tool.type === 'wall' && (
                                                <div className="w-full h-full bg-white relative overflow-hidden flex flex-wrap gap-1 opacity-50">
                                                    {Array.from({ length: 24 }).map((_, j) => (
                                                        <div key={j} className="h-4 w-[22%] bg-gray-200 border border-gray-300"></div>
                                                    ))}
                                                </div>
                                            )}
                                            {tool.type === 'wardrobe' && (
                                                <div className="w-3/4 h-full bg-orange-200 rounded flex gap-1 p-1">
                                                    <div className="flex-1 bg-orange-300"></div>
                                                    <div className="flex-1 bg-orange-300"></div>
                                                    <div className="flex-1 bg-orange-300"></div>
                                                </div>
                                            )}
                                            {tool.type === 'bed' && (
                                                <div className="w-full h-2/3 bg-gray-200 rounded-lg mt-auto flex items-end p-2 gap-2 relative border border-gray-300">
                                                    <div className="w-full h-1/2 bg-white rounded-t-lg border border-gray-300 absolute bottom-0 left-0"></div>
                                                    <div className="w-1/3 h-1/3 bg-white rounded shadow-sm relative z-10 border border-gray-300"></div>
                                                    <div className="w-1/3 h-1/3 bg-white rounded shadow-sm relative z-10 border border-gray-300"></div>
                                                </div>
                                            )}
                                            {tool.type === 'tv' && (
                                                <div className="w-full h-2/3 bg-neutral-800 rounded-sm border-4 border-neutral-900 shadow-inner flex flex-col mb-2">
                                                    <div className="mt-auto h-2 w-1/4 mx-auto bg-neutral-400 translate-y-2"></div>
                                                    <div className="h-1 w-1/2 mx-auto bg-neutral-400 translate-y-2"></div>
                                                </div>
                                            )}
                                            {tool.type === 'chair' && (
                                                <div className="w-1/2 h-3/4 flex flex-col items-center">
                                                    <div className="w-full h-1/2 bg-[#8b5a2b] border border-[#654321] rounded-t-sm"></div>
                                                    <div className="w-full h-1/4 bg-[#a0522d] border border-[#654321]"></div>
                                                    <div className="w-full flex-1 flex justify-between">
                                                        <div className="w-1 h-full bg-[#654321]"></div>
                                                        <div className="w-1 h-full bg-[#654321]"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tool.type === 'refrigerator' && (
                                                <div className="w-1/2 h-full bg-gray-100 border-2 border-gray-300 rounded flex flex-col p-1 gap-1">
                                                    <div className="flex-1 border border-gray-300 rounded-sm relative">
                                                        <div className="absolute right-1 top-2 w-1 h-1/3 bg-gray-300 rounded-full"></div>
                                                    </div>
                                                    <div className="h-2/5 border border-gray-300 rounded-sm relative">
                                                        <div className="absolute right-1 top-2 w-1 h-1/3 bg-gray-300 rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tool.type === 'table' && (
                                                <div className="w-3/4 h-1/2 flex flex-col items-center relative">
                                                    <div className="w-full h-1/4 bg-[#8b5a2b] border border-[#654321] rounded-sm relative z-10"></div>
                                                    <div className="w-[90%] flex justify-between h-3/4">
                                                        <div className="w-2 h-full bg-[#654321]"></div>
                                                        <div className="w-2 h-full bg-[#654321]"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tool.type === 'sofa' && (
                                                <div className="w-full h-1/2 bg-[#F5F5DC] rounded-lg mt-auto flex items-end p-1 relative border border-[#E3E3C7]">
                                                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#E3E3C7] rounded-l-lg shadow-sm"></div>
                                                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#E3E3C7] rounded-r-lg shadow-sm"></div>
                                                    <div className="flex-1 bg-[#F5F5DC] h-2/3 mx-4 rounded-t-lg border-t border-[#E3E3C7] flex gap-1 z-10">
                                                        <div className="flex-1 border-r border-[#E3E3C7]"></div>
                                                        <div className="flex-1"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button className="w-full py-2 bg-white text-[#1C1C1C] text-sm font-medium rounded-md border border-[#663F23] hover:bg-[#F9F9F9] transition-colors">
                                            {tool.name}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#E5E5E5]">
                                <button className="w-full py-2.5 bg-white border border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded-md hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
                                    <Palette size={16} className="text-orange-500" />
                                    Change Color
                                </button>
                                <button className="w-full py-2.5 bg-white border border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded-md hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
                                    <Ruler size={16} className="text-blue-500" />
                                    Scale Tool
                                </button>
                                <button className="w-full py-2.5 bg-white border border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded-md hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
                                    <Minus size={16} className="text-gray-700 font-bold" />
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
