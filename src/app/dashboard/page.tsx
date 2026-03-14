"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import {
    LayoutTemplate,
    FileText,
    Search,
    Bell,
    PenTool,
    Sofa,
    Calendar,
    Users2,
    Plus,
    ArrowUpRight,
    Clock,
    AlertCircle,
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalDesigns: 0,
        totalProducts: 0,
        pendingConsultations: 0,
        totalClients: 0
    });
    const [recentDesigns, setRecentDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        const user = getUser();
        setAdminUser(user);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/admin/dashboard");
            const { totalDesigns, totalProducts, pendingConsultations, totalClients, recentDesigns: designs } = response.data;
            
            setStats({
                totalDesigns,
                totalProducts,
                pendingConsultations,
                totalClients
            });
            setRecentDesigns(designs);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="h-20 bg-[#F5F1E8] px-10 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-[#1C1C1C]">Overview</h1>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#1C1C1C]/70 hover:text-[#1C1C1C] transition-colors">
                            <Search size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#1C1C1C]/70 hover:text-[#1C1C1C] transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="px-10 pb-10">
                    {/* Error State */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                            <button 
                                onClick={fetchDashboardData}
                                className="ml-auto text-xs font-bold uppercase tracking-wider hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mt-4">
                        {/* Stat Card 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5]/50 shadow-sm flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <span className="text-[#1C1C1C]/50 text-sm font-medium">Total Designs</span>
                                <PenTool size={18} className="text-[#1C1C1C]/40" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">{stats.totalDesigns.toLocaleString()}</h3>
                                )}
                                <div className="flex items-center text-[#C6A75E] text-xs font-medium">
                                    <ArrowUpRight size={14} className="mr-1" />
                                    Live data
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5]/50 shadow-sm flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <span className="text-[#1C1C1C]/50 text-sm font-medium">Total Products</span>
                                <Sofa size={18} className="text-[#1C1C1C]/40" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">{stats.totalProducts.toLocaleString()}</h3>
                                )}
                                <div className="flex items-center text-[#1C1C1C]/40 text-xs font-medium">
                                    <Clock size={14} className="mr-1" />
                                    Active inventory
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5]/50 shadow-sm flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <span className="text-[#1C1C1C]/50 text-sm font-medium">Pending Consultations</span>
                                <Calendar size={18} className="text-[#1C1C1C]/40" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">{stats.pendingConsultations.toLocaleString()}</h3>
                                )}
                                <div className={`flex items-center text-xs font-medium ${stats.pendingConsultations > 0 ? "text-red-500" : "text-[#1C1C1C]/40"}`}>
                                    <AlertCircle size={14} className="mr-1" />
                                    {stats.pendingConsultations > 0 ? `${stats.pendingConsultations} require attention` : "No urgent items"}
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5]/50 shadow-sm flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <span className="text-[#1C1C1C]/50 text-sm font-medium">Total Clients</span>
                                <Users2 size={18} className="text-[#1C1C1C]/40" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">{stats.totalClients.toLocaleString()}</h3>
                                )}
                                <div className="flex items-center text-[#C6A75E] text-xs font-medium">
                                    <ArrowUpRight size={14} className="mr-1" />
                                    Registered users
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h2 className="text-xl font-bold text-[#1C1C1C] mt-10 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-4 gap-6">
                        <Link href="/admin/room-setup" className="bg-[#663F23] rounded-2xl p-6 text-white hover:bg-[#4A2D19] transition-colors flex flex-col justify-between h-40">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Plus size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Create New Design</h3>
                                <p className="text-white/60 text-xs text-balance">Start a fresh 2D layout and room setup.</p>
                            </div>
                        </Link>

                        <Link href="/admin/catalogue" className="bg-white border border-[#E5E5E5]/50 rounded-2xl p-6 hover:border-[#C6A75E]/50 transition-colors shadow-sm flex flex-col justify-between h-40 group">
                            <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center group-hover:bg-[#663F23]/10 transition-colors">
                                <Sofa size={20} className="text-[#663F23]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1C1C1C] mb-1">Furniture Catalogue</h3>
                                <p className="text-[#1C1C1C]/50 text-xs text-balance">Add, edit, or remove store products.</p>
                            </div>
                        </Link>

                        <Link href="/admin/compare-designs" className="bg-white border border-[#E5E5E5]/50 rounded-2xl p-6 hover:border-[#C6A75E]/50 transition-colors shadow-sm flex flex-col justify-between h-40 group">
                            <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center group-hover:bg-[#663F23]/10 transition-colors">
                                <LayoutTemplate size={20} className="text-[#663F23]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1C1C1C] mb-1">Design Comparison</h3>
                                <p className="text-[#1C1C1C]/50 text-xs text-balance">Compare two layouts side-by-side.</p>
                            </div>
                        </Link>

                        <Link href="/admin/cost-summary" className="bg-white border border-[#E5E5E5]/50 rounded-2xl p-6 hover:border-[#C6A75E]/50 transition-colors shadow-sm flex flex-col justify-between h-40 group">
                            <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center group-hover:bg-[#663F23]/10 transition-colors">
                                <FileText size={20} className="text-[#663F23]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1C1C1C] mb-1">Cost Reports</h3>
                                <p className="text-[#1C1C1C]/50 text-xs text-balance">View and export project estimates.</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Designs */}
                    <div className="flex items-center justify-between mt-10 mb-4">
                        <h2 className="text-xl font-bold text-[#1C1C1C]">Recent Designs</h2>
                        <Link href="#" className="text-sm font-medium text-[#663F23] hover:underline">View all</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-48 w-full bg-gray-200"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            ))
                        ) : recentDesigns.length > 0 ? (
                            recentDesigns.map((design: any) => (
                                <div key={design.id} className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                                    <div className="relative h-48 w-full bg-gray-200">
                                        <Image
                                            src={design.thumbnail && design.thumbnail !== "placeholder_thumbnail_url" ? design.thumbnail : "/logo.png"}
                                            alt={design.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-[#1C1C1C] text-lg leading-tight truncate">{design.name}</h3>
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                design.status === 'published' ? 'bg-green-50 text-green-600' : 
                                                design.status === 'draft' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                                {design.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-[#1C1C1C]/40">
                                            <div className="flex items-center gap-1.5 cursor-default">
                                                <Calendar size={12} />
                                                <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 cursor-default">
                                                <Users2 size={12} />
                                                <span>{adminUser?.name || "Admin"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-dashed border-[#E5E5E5]">
                                <p className="text-[#1C1C1C]/40">No recent designs found.</p>
                                <Link href="/admin/room-setup" className="text-[#663F23] font-semibold mt-2 inline-block">Create your first design</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

        </div>
    );
}