import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Save,
    Box,
    Undo2,
    Redo2,
    RotateCw,
    Palette,
    Maximize2,
    Trash2,
    ChevronLeft
} from "lucide-react";

export default function RoomSetup() {
    return (
        <div className="min-h-screen bg-[#D9D9D9] flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="h-[72px] bg-white flex items-center justify-between px-6 border-b border-[#E5E5E5] shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-normal text-[#1C1C1C]">2D Layout Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] text-[#1C1C1C] font-semibold rounded-md hover:bg-[#F9F9F9] transition-colors shadow-sm">
                        <Save size={18} />
                        Save
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#663F23] text-white font-semibold rounded-md hover:bg-[#52321c] transition-colors shadow-sm">
                        <Box size={18} />
                        3D view
                    </button>
                </div>
            </header>

            {/* Secondary Toolbar */}
            <div className="h-12 bg-[#C6A75E] flex items-center px-6 gap-6 shrink-0 text-[#1C1C1C] text-sm font-medium">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Undo2 size={16} />
                    Undo
                </button>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Redo2 size={16} />
                    Redo
                </button>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <RotateCw size={16} />
                    Rotate
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Canvas Area (Grid) */}
                <div className="flex-1 relative overflow-auto bg-[#F5F1E8]">
                    {/* SVG Grid Background */}
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, #C6A75E40 1px, transparent 1px),
                                linear-gradient(to bottom, #C6A75E40 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                            backgroundPosition: 'center center'
                        }}
                    >
                        {/* Dashed secondary grid */}
                        <div className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, #C6A75E40 1px, transparent 1px),
                                    linear-gradient(to bottom, #C6A75E40 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: 'center center',
                                opacity: 0.3,
                                strokeDasharray: "2,2"
                            }}
                        />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="w-[360px] bg-white flex flex-col shrink-0 border-l border-[#E5E5E5] relative z-10">
                    {/* Tabs */}
                    <div className="flex border-b border-[#E5E5E5] shrink-0">
                        <button className="flex-1 py-4 text-center font-bold text-[#663F23] border-b-4 border-[#663F23]">
                            Tools
                        </button>
                        <button className="flex-1 py-4 text-center font-medium text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">
                            Properties
                        </button>
                    </div>

                    {/* Sidebar Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {/* Furniture Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Item 1 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1517228224578-84224dbb027b?q=80&w=200&auto=format&fit=crop" alt="Wall" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add wall
                                </button>
                            </div>

                            {/* Item 2 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1595515106969-1ce2956661d1?q=80&w=200&auto=format&fit=crop" alt="Wardrobe" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add wardrobe
                                </button>
                            </div>

                            {/* Item 3 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=200&auto=format&fit=crop" alt="Bed" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add bed
                                </button>
                            </div>

                            {/* Item 4 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=200&auto=format&fit=crop" alt="TV" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add TV
                                </button>
                            </div>

                            {/* Item 5 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=200&auto=format&fit=crop" alt="Chair" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add Chair
                                </button>
                            </div>

                            {/* Item 6 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=200&auto=format&fit=crop" alt="Refrigerator" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add refrigerator
                                </button>
                            </div>

                            {/* Item 7 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=200&auto=format&fit=crop" alt="Table" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add table
                                </button>
                            </div>

                            {/* Item 8 */}
                            <div className="flex flex-col gap-2">
                                <div className="h-[100px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                                    <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop" alt="Sofa" fill className="object-cover" />
                                </div>
                                <button className="w-full py-1.5 px-2 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-xs font-semibold rounded hover:bg-[#F5F1E8] transition-colors">
                                    Add sofa
                                </button>
                            </div>
                        </div>

                        {/* Action Tools */}
                        <div className="mt-4 flex flex-col gap-2">
                            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded hover:bg-[#F5F1E8] transition-colors">
                                <Palette size={16} className="text-orange-500" />
                                Change Color
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded hover:bg-[#F5F1E8] transition-colors">
                                <Maximize2 size={16} className="text-blue-500" />
                                Scale Tool
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-[#663F23] text-[#1C1C1C] text-sm font-medium rounded hover:bg-[#F5F1E8] transition-colors">
                                <Trash2 size={16} className="text-gray-500" />
                                Delete Item
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
