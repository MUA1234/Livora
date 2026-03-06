"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    ArrowUpRight,
    ArrowDownRight,
    LogOut
} from "lucide-react";
import Image from "next/image";

export default function CostSummary() {
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
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

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Sofa size={20} />
                            <span className="font-medium text-sm">Catalogue</span>
                        </Link>

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutTemplate size={20} />
                            <span className="font-medium text-sm">Compare Designs</span>
                        </Link>

                        <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors">
                            <FileText size={20} />
                            <span className="font-medium text-sm">Cost Summary</span>
                        </Link>

                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-[#E5E5E5]/50 shrink-0">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
                        <Settings size={20} />
                        <span className="font-medium text-sm">Settings</span>
                    </Link>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors mb-4 focus:outline-none cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>

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
                <div className="max-w-4xl ml-0 bg-[#F5F1E8] h-full rounded-sm">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-medium text-[#2A2A2A] mb-4">Cost Summary</h1>
                        <p className="text-center text-lg text-[#2A2A2A]">Design Name: Living Room A</p>
                    </div>

                    {/* Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse border border-[#3E3E3E] text-left table-fixed">
                            <thead>
                                <tr className="border-b border-[#3E3E3E]">
                                    <th className="border-r border-[#3E3E3E] p-4 text-center font-normal text-[#2A2A2A] w-[35%]">Item</th>
                                    <th className="border-r border-[#3E3E3E] p-4 text-center font-normal text-[#2A2A2A] w-[15%]">Qty</th>
                                    <th className="border-r border-[#3E3E3E] p-4 text-center font-normal text-[#2A2A2A] w-[25%]">Unit Price</th>
                                    <th className="p-4 text-center font-normal text-[#2A2A2A] w-[25%]">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#2A2A2A]">
                                <tr className="border-b border-[#3E3E3E] h-20">
                                    <td className="border-r border-[#3E3E3E] p-4 pl-8">Chair</td>
                                    <td className="border-r border-[#3E3E3E] p-4 text-center">2</td>
                                    <td className="border-r border-[#3E3E3E] p-4 text-center">15000</td>
                                    <td className="p-4 text-center">30000</td>
                                </tr>
                                <tr className="border-b border-[#3E3E3E] h-20">
                                    <td className="border-r border-[#3E3E3E] p-4 pl-8">Table</td>
                                    <td className="border-r border-[#3E3E3E] p-4 text-center">1</td>
                                    <td className="border-r border-[#3E3E3E] p-4 text-center">45000</td>
                                    <td className="p-4 text-center">45000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Math */}
                    <div className="w-full flex justify-between px-8 text-[#2A2A2A] mb-12 space-y-3">
                        <div className="flex flex-col gap-3">
                            <span className="text-lg">Subtotal</span>
                            <span className="text-lg">Tax</span>
                            <span className="text-lg">Grand Total</span>
                        </div>
                        <div className="flex flex-col gap-3 items-end pr-8">
                            <span className="text-lg">75000</span>
                            <span className="text-lg">-</span>
                            <span className="text-lg">75000</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-6 mt-8">
                        <button onClick={() => window.print()} className="px-10 py-3 bg-[#66432A] text-white font-medium rounded-md hover:bg-[#533520] transition-colors shadow-sm">
                            Save PDF
                        </button>
                        <button onClick={() => window.history.back()} className="px-10 py-3 bg-white text-[#2A2A2A] font-medium rounded-md border border-[#E0E0E0] hover:bg-gray-50 transition-colors shadow-sm">
                            Back to Editor
                        </button>
                    </div>
                </div>
            </main>

            {isLogoutModalOpen && (
                <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout from Livora admin panel?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
            )}
        </div>
    );
}
