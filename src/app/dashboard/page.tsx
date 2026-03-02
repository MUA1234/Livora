import Link from "next/link";
import {
    LayoutDashboard,
    Monitor,
    ShoppingBag,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Search,
    Bell,
    PenTool,
    Sofa,
    Calendar,
    Users2,
    Plus,
    ArrowUpRight,
    Clock,
    AlertCircle
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#F5F1E8] flex overflow-hidden font-sans text-[#1C1C1C]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0">
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
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg">
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
                    </nav>
                </div>

                <div className="p-4 border-t border-[#E5E5E5]/50">
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
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
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mt-4">
                        {/* Stat Card 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5]/50 shadow-sm flex flex-col justify-between h-36">
                            <div className="flex justify-between items-start">
                                <span className="text-[#1C1C1C]/50 text-sm font-medium">Total Designs</span>
                                <PenTool size={18} className="text-[#1C1C1C]/40" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">1,248</h3>
                                <div className="flex items-center text-[#C6A75E] text-xs font-medium">
                                    <ArrowUpRight size={14} className="mr-1" />
                                    +12% this month
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
                                <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">843</h3>
                                <div className="flex items-center text-[#1C1C1C]/40 text-xs font-medium">
                                    <Clock size={14} className="mr-1" />
                                    Updated 2 days ago
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
                                <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">12</h3>
                                <div className="flex items-center text-red-500 text-xs font-medium">
                                    <AlertCircle size={14} className="mr-1" />
                                    4 require attention
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
                                <h3 className="text-3xl font-bold text-[#1C1C1C] mb-1">342</h3>
                                <div className="flex items-center text-[#C6A75E] text-xs font-medium">
                                    <ArrowUpRight size={14} className="mr-1" />
                                    +5 new this week
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

                        <Link href="#" className="bg-white border border-[#E5E5E5]/50 rounded-2xl p-6 hover:border-[#C6A75E]/50 transition-colors shadow-sm flex flex-col justify-between h-40 group">
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

                        <Link href="#" className="bg-white border border-[#E5E5E5]/50 rounded-2xl p-6 hover:border-[#C6A75E]/50 transition-colors shadow-sm flex flex-col justify-between h-40 group">
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
                        {/* Design Card 1 */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                            <div className="relative h-48 w-full bg-gray-200">
                                <Image
                                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"
                                    alt="Living Room"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#1C1C1C] text-lg leading-tight">Smith Residence<br />Living Room</h3>
                                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Completed</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-[#1C1C1C]/40">
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Calendar size={12} />
                                        <span>Oct 24, 2025</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Users2 size={12} />
                                        <span>Sara Samarasinghe</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Design Card 2 */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                            <div className="relative h-48 w-full bg-gray-200">
                                <Image
                                    src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800"
                                    alt="Dining Room"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#1C1C1C] text-lg leading-tight">Oakwood Villa<br />Dining Area</h3>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">In Progress</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-[#1C1C1C]/40">
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Calendar size={12} />
                                        <span>Oct 22, 2025</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Users2 size={12} />
                                        <span>Anjali Hettiarachchi</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Design Card 3 */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                            <div className="relative h-48 w-full bg-gray-200">
                                <Image
                                    src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800"
                                    alt="Master Bedroom"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#1C1C1C] text-lg leading-tight">Penthouse Suite<br />Master Bedroom</h3>
                                    <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Under Review</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-[#1C1C1C]/40">
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Calendar size={12} />
                                        <span>Oct 20, 2025</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        <Users2 size={12} />
                                        <span>Thilina Kulasekara</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

