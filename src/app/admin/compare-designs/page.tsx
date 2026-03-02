"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Repeat, Check, ArrowRight, ArrowDown, ArrowUp } from "lucide-react";

export default function CompareDesigns() {
    const [swapped, setSwapped] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F1E8] p-8 font-sans text-[#1C1C1C]">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Design Comparison</h1>
                    <p className="text-[#1C1C1C]/60 text-sm">Compare layouts, palettes, furniture & costs side-by-side.</p>
                </div>
                <Link href="/dashboard" className="flex items-center gap-2 bg-[#663F23]/80 hover:bg-[#663F23] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    <ChevronLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>

            {/* Selectors */}
            <div className="flex items-center justify-between bg-white rounded-xl p-2 mb-8 shadow-sm">
                <button className="flex-1 flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-left border border-transparent hover:border-gray-100">
                    <span className="font-semibold text-[#1C1C1C]">{swapped ? "Scandinavian Comfort — Living Room" : "Modern Minimalist — Living Room"}</span>
                    <ChevronDown size={18} className="text-[#1C1C1C]/50" />
                </button>

                <div className="px-6 flex flex-col items-center justify-center">
                    <button onClick={() => setSwapped(!swapped)} className="bg-[#FAF8F5] p-3 rounded-full hover:bg-[#F0EBE1] transition-colors border border-[#E8E1D3]">
                        <Repeat size={18} className="text-[#663F23]" />
                    </button>
                    <span className="text-xs font-semibold text-[#663F23] mt-2">Swap Designs</span>
                </div>

                <button className="flex-1 flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-left border border-transparent hover:border-gray-100">
                    <span className="font-semibold text-[#1C1C1C]">{swapped ? "Modern Minimalist — Living Room" : "Scandinavian Comfort — Living Room"}</span>
                    <ChevronDown size={18} className="text-[#1C1C1C]/50" />
                </button>
            </div>

            {/* Comparison Grid */}
            <div className={`grid grid-cols-2 gap-8 mb-12 ${swapped ? "direction-rtl" : ""}`}>
                {/* Design A (or B if swapped) */}
                <div className={`bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E5E5]/50 relative ${swapped ? "order-2" : "order-1"}`}>
                    <div className="absolute top-8 left-8 bg-[#C6A75E] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        Design A
                    </div>

                    <div className="text-center mt-6 mb-8">
                        <h2 className="text-xl font-bold">Modern Minimalist</h2>
                        <p className="text-sm text-[#1C1C1C]/50 mt-1">Living Room • 20.8 m²</p>
                    </div>

                    {/* Layout Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Layout</h3>
                            <span className="bg-[#C6A75E] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                ≠ Different
                            </span>
                        </div>
                        <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/modern-minimalist.jpg"
                                alt="Modern Minimalist Layout"
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                    </div>

                    {/* Color Scheme */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Color Scheme</h3>
                            <span className="bg-gray-200 text-[#1C1C1C] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                ≠ Different
                            </span>
                        </div>
                        <div className="flex gap-4">
                            {[{ c: '#F4F4F0', n: 'Ivory' }, { c: '#2A2A2A', n: 'Charcoal' }, { c: '#B89C5A', n: 'Gold' }, { c: '#8B5A2B', n: 'Walnut' }, { c: '#E5E5E5', n: 'Mist' }].map((color, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.c }}></div>
                                    <span className="text-[10px] text-gray-500">{color.n}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Materials */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#Fdfbf7] border border-[#E8E1D3] rounded-2xl p-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Wall Finish</p>
                            <h4 className="font-bold text-[#1C1C1C] text-lg leading-tight mb-3">Smooth Matte<br />Paint</h4>
                            <p className="text-[#C6A75E] font-medium text-sm">Rs. 96,000</p>
                        </div>
                        <div className="bg-[#FCF9F2] border border-[#E8E1D3] rounded-2xl p-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Flooring</p>
                            <h4 className="font-bold text-[#1C1C1C] text-lg leading-tight mb-3">Oak Hardwood</h4>
                            <p className="text-[#C6A75E] font-medium text-sm mt-auto">Rs. 555,000</p>
                        </div>
                    </div>

                    {/* Furniture Selection */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                            <h3 className="text-xs font-bold text-[#C6A75E] uppercase tracking-wider">Furniture<br />Selection</h3>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">5 items • Rs. 1,572,000</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Sectional Sofa', price: '720,000' },
                                { name: 'Coffee Table (Walnut)', price: '204,000' },
                                { name: 'Arc Floor Lamp ×2', price: '210,000' },
                                { name: 'TV Console Unit', price: '276,000' },
                                { name: 'Wool Area Rug', price: '162,000' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 border-dotted">
                                    <span className="text-[#1C1C1C]/70">{item.name}</span>
                                    <span className="font-bold text-[#663F23]">Rs. {item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-[#F5F1E8] rounded-xl p-5 flex justify-between items-center">
                        <span className="font-bold text-sm">Total Estimated<br />Cost</span>
                        <span className="text-2xl font-bold">Rs. 2,223,000</span>
                    </div>
                </div>

                {/* Design B (or A if swapped) */}
                <div className={`bg-white rounded-[2rem] p-8 shadow-sm border border-[#E5E5E5]/50 relative ${swapped ? "order-1" : "order-2"}`}>
                    <div className="absolute top-8 left-8 bg-[#C6A75E] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        Design B
                    </div>

                    <div className="text-center mt-6 mb-8">
                        <h2 className="text-xl font-bold">Scandinavian Comfort</h2>
                        <p className="text-sm text-[#1C1C1C]/50 mt-1">Living Room • 20.8 m²</p>
                    </div>

                    {/* Layout Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Layout</h3>
                            <span className="bg-[#C6A75E] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                ≠ Different
                            </span>
                        </div>
                        <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/scandinavian.jpg"
                                alt="Scandinavian Layout"
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                    </div>

                    {/* Color Scheme */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Color Scheme</h3>
                        </div>
                        <div className="flex gap-4">
                            {[{ c: '#FFFFFF', n: 'White' }, { c: '#D2B48C', n: 'Sand' }, { c: '#A8C3B8', n: 'Nordic' }, { c: '#4A3C31', n: 'Espresso' }, { c: '#8FBC8F', n: 'Sage' }].map((color, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.c }}></div>
                                    <span className="text-[10px] text-gray-500">{color.n}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Materials */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#F8F6EF] border border-[#E8E1D3] rounded-2xl p-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Flooring</p>
                            <h4 className="font-bold text-[#1C1C1C] text-lg leading-tight mb-3">Birch Laminate</h4>
                            <p className="text-[#C6A75E] font-medium text-sm">Rs. 366,000</p>
                        </div>
                        <div className="bg-[#FAF8F3] border border-[#E8E1D3] rounded-2xl p-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Wall Finish</p>
                            <h4 className="font-bold text-[#1C1C1C] text-lg leading-tight mb-3">Textured Stucco</h4>
                            <p className="text-[#C6A75E] font-medium text-sm mt-auto">Rs. 144,000</p>
                        </div>
                    </div>

                    {/* Furniture Selection */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                            <h3 className="text-xs font-bold text-[#C6A75E] uppercase tracking-wider">Furniture<br />Selection</h3>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">6 items • Rs. 1,452,000</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Linen 3-Seater Sofa', price: '540,000' },
                                { name: 'Round Coffee Table', price: '126,000' },
                                { name: 'Pendant Light ×3', price: '252,000' },
                                { name: 'Birch Bookshelf', price: '228,000' },
                                { name: 'Sheepskin Rug ×2', price: '192,000' },
                                { name: 'Side Table ×2', price: '114,000' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 border-dotted">
                                    <span className="text-[#1C1C1C]/70">{item.name}</span>
                                    <span className="font-bold text-[#C6A75E]">Rs. {item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center relative">
                        <div className="absolute -top-3 left-0 w-full text-center">
                            <p className="text-[10px] text-green-600 font-medium inline-flex items-center gap-1 bg-white px-2">
                                <ArrowDown size={10} /> You save Rs. 261,000 with this design
                            </p>
                        </div>
                        <div className="bg-white border-2 border-green-500 rounded-xl p-5 flex-1 flex justify-between items-center mt-2">
                            <span className="font-bold text-sm">Total Estimated<br />Cost</span>
                            <span className="text-2xl font-bold text-green-600">Rs. 1,962,000</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost Comparison Detail */}
            <h2 className="text-2xl font-bold mb-2">Cost Comparison</h2>
            <p className="text-[#1C1C1C]/60 text-sm mb-6">Visual breakdown by category with radial indicators</p>

            <div className={`grid grid-cols-2 gap-8 mb-8`}>
                {/* Radial Modern Minimalist */}
                <div className={`bg-white rounded-3xl p-8 flex justify-between items-center shadow-sm relative ${swapped ? "order-2" : "order-1"}`}>
                    <div className="absolute top-4 left-0 right-0 text-center"><p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Modern Minimalist</p></div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex items-center justify-center mb-2">
                            <span className="text-[10px] font-bold">Rs. 1,572,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Furniture</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center mb-2 relative">
                            <span className="text-[10px] font-bold">Rs. 96,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Wall Finish</span>
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            ↓ Lower
                        </span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex items-center justify-center mb-2">
                            <span className="text-[10px] font-bold">Rs. 555,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Flooring</span>
                    </div>
                </div>

                {/* Radial Scandinavian Comfort */}
                <div className={`bg-white rounded-3xl p-8 flex justify-between items-center shadow-sm relative ${swapped ? "order-1" : "order-2"}`}>
                    <div className="absolute top-4 left-0 right-0 text-center"><p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Scandinavian Comfort</p></div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-green-600 flex items-center justify-center mb-2">
                            <span className="text-[10px] font-bold text-green-700">Rs. 1,452,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Furniture</span>
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            ↓ Lower
                        </span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex items-center justify-center mb-2">
                            <span className="text-[10px] font-bold">Rs. 144,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Wall Finish</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 mt-6">
                        <div className="w-24 h-24 rounded-full border-4 border-green-600 flex items-center justify-center mb-2">
                            <span className="text-[10px] font-bold text-green-700">Rs. 366,000</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Flooring</span>
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            ↓ Lower
                        </span>
                    </div>
                </div>
            </div>

            {/* Bar charts comparison */}
            <div className="max-w-4xl mx-auto space-y-6">
                {[
                    {
                        title: "Furniture Cost",
                        leftVal: "1,572,000", rightVal: "1,452,000",
                        leftHigher: true, saveAmount: "120,000",
                        leftPercent: "80%", rightPercent: "70%"
                    },
                    {
                        title: "Wall Finish",
                        leftVal: "96,000", rightVal: "144,000",
                        leftHigher: false, saveAmount: "48,000",
                        leftPercent: "40%", rightPercent: "60%"
                    },
                    {
                        title: "Flooring",
                        leftVal: "555,000", rightVal: "366,000",
                        leftHigher: true, saveAmount: "189,000",
                        leftPercent: "75%", rightPercent: "50%"
                    },
                    {
                        title: "Total Estimated Cost",
                        leftVal: "2,223,000", rightVal: "1,962,000",
                        leftHigher: true, saveAmount: "261,000",
                        leftPercent: "90%", rightPercent: "80%"
                    }
                ].map((row, i) => {
                    const leftVal = swapped ? row.rightVal : row.leftVal;
                    const rightVal = swapped ? row.leftVal : row.rightVal;
                    const leftHigher = swapped ? !row.leftHigher : row.leftHigher;
                    const leftPercent = swapped ? row.rightPercent : row.leftPercent;
                    const rightPercent = swapped ? row.leftPercent : row.rightPercent;

                    return (
                        <div key={i} className="flex items-end gap-4 text-sm relative">
                            <div className="w-[45%]">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="font-semibold">{row.title}</p>
                                        <p className="text-[#1C1C1C]/60 text-xs">Rs. {leftVal}</p>
                                    </div>
                                    {leftHigher ?
                                        <span className="text-red-500 border border-red-200 bg-red-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">↑ Higher</span>
                                        :
                                        <span className="text-green-600 border border-green-200 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">↓ Lower</span>
                                    }
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full flex justify-end overflow-hidden">
                                    <div className={`h-full rounded-l-full ${leftHigher ? 'bg-[#AFA18A]' : 'bg-green-500'}`} style={{ width: leftPercent }}></div>
                                </div>
                            </div>

                            <div className="w-[10%] text-center text-[10px] font-bold text-gray-400 pb-1">
                                VS
                            </div>

                            <div className="w-[45%]">
                                <div className="flex justify-between items-end mb-2 relative">
                                    <div className="absolute -top-7 right-0">
                                        <span className="text-green-600 border border-green-600 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">↓ Save Rs. {row.saveAmount}</span>
                                    </div>
                                    <p className={`font-semibold text-xs ${leftHigher ? 'text-green-600' : 'text-[#1C1C1C]/60'}`}>Rs. {rightVal}</p>
                                    {!leftHigher ?
                                        <span className="text-red-500 border border-red-200 bg-red-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">↑ Higher</span>
                                        :
                                        <span className="text-green-600 border border-green-200 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">↓ Lower</span>
                                    }
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-r-full ${!leftHigher ? 'bg-[#AFA18A]' : 'bg-green-500'}`} style={{ width: rightPercent }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}