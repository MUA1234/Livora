"use client";

import Link from "next/link";
import { User, Send, Heart, Star, LogOut, Eye } from "lucide-react";
import Image from "next/image";

export default function MyAccountPage() {
    return (
        <div className="min-h-screen bg-[#F5F2EC] flex text-[#1C1C1C] font-sans">
            {/* Left Sidebar */}
            <aside className="w-80 bg-white m-6 rounded-[32px] flex flex-col p-8 shadow-sm">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#1C1C1C]">Livora</h1>
                    <p className="text-[#1C1C1C]/60 mt-2">Luxury Living</p>
                </div>

                <nav className="flex flex-col gap-4">
                    <Link href="/user-panel/my-account" className="flex items-center gap-4 px-6 py-4 bg-[#F5F2EC] rounded-xl font-medium text-[#1C1C1C]">
                        <User size={20} className="text-[#1C1C1C]/60" />
                        My Profile
                    </Link>
                    <Link href="/user-panel/consultation-request" className="flex items-center gap-4 px-6 py-4 text-[#1C1C1C]/70 hover:bg-[#F5F2EC]/50 rounded-xl transition-colors">
                        <Send size={20} className="text-[#1C1C1C]/60" />
                        Book Consultations
                    </Link>
                    <Link href="/user-panel/wishlist" className="flex items-center gap-4 px-6 py-4 text-[#1C1C1C]/70 hover:bg-[#F5F2EC]/50 rounded-xl transition-colors">
                        <Heart size={20} className="text-[#1C1C1C]/60" />
                        Wishlist
                    </Link>
                    <Link href="#" className="flex items-center gap-4 px-6 py-4 text-[#1C1C1C]/70 hover:bg-[#F5F2EC]/50 rounded-xl transition-colors">
                        <Star size={20} className="text-[#1C1C1C]/60" />
                        Review and Ratings
                    </Link>
                </nav>

                <div className="mt-auto bg-[#B5A196] p-4 rounded-2xl flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#B5A196] font-bold shrink-0">
                        AJ
                    </div>
                    <div>
                        <div className="font-bold">Alex Janny</div>
                        <div className="text-xs text-white/80">AlexJanny@gmail.com</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 pl-0">
                <div className="max-w-[800px]">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-[#663F23]">My Account</h1>
                        <button className="flex items-center gap-2 px-6 py-2 border border-[#1C1C1C]/20 rounded-full hover:bg-white transition-colors text-sm font-medium">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    {/* Profile Information */}
                    <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold text-[#663F23] mb-6">Profile Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2">Full Name</label>
                                <input type="text" className="w-full bg-[#F5F2EC] rounded-xl px-4 py-3 outline-none" defaultValue="" />
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-[#F5F2EC] rounded-xl px-4 py-3 outline-none" defaultValue="" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm mb-2">Phone Number</label>
                                    <input type="text" className="w-full bg-[#F5F2EC] rounded-xl px-4 py-3 outline-none" defaultValue="" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="px-6 py-2.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Saved Consultation Requests */}
                    <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#663F23]">Saved Consultation Requests</h2>
                            <button className="text-[#D4AF37] text-sm font-medium">View All</button>
                        </div>
                        <div className="w-full text-sm">
                            <div className="flex justify-between font-bold mb-4 px-2">
                                <div className="w-1/4">Room Type</div>
                                <div className="w-1/4">Date</div>
                                <div className="w-1/4">Status</div>
                                <div className="w-1/4 text-center">Action</div>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#F5F2EC] py-4 px-2">
                                <div className="w-1/4">Living Room</div>
                                <div className="w-1/4">Feb 14, 2026</div>
                                <div className="w-1/4"><span className="px-3 py-1 bg-[#F5F2EC] rounded-md text-xs">Pending</span></div>
                                <div className="w-1/4 flex justify-center"><button className="flex items-center gap-1 text-[#D4AF37]"><Eye size={14} /> view</button></div>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#F5F2EC] py-4 px-2">
                                <div className="w-1/4">Master Bedroom</div>
                                <div className="w-1/4">Feb 2, 2026</div>
                                <div className="w-1/4"><span className="px-3 py-1 bg-[#B5A196] text-white rounded-md text-xs">Confirmed</span></div>
                                <div className="w-1/4 flex justify-center"><button className="flex items-center gap-1 text-[#D4AF37]"><Eye size={14} /> view</button></div>
                            </div>
                        </div>
                    </section>

                    {/* Wishlist Overview */}
                    <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#663F23]">Wishlist Overview</h2>
                            <Link href="/user-panel/wishlist" className="px-4 py-1.5 border border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-medium">
                                View Full Wishlist
                            </Link>
                        </div>
                        <div className="flex gap-4">
                            {/* Card 1 */}
                            <div className="border border-[#1C1C1C]/10 rounded-2xl p-4 w-1/3 text-center">
                                <div className="h-32 relative mb-4">
                                    <Image src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=300" alt="Velvet Armchair" fill className="object-cover rounded-xl" />
                                </div>
                                <div className="text-sm font-medium">Velvet Armchair</div>
                                <div className="text-xs text-[#D4AF37] mt-1">Rs.25,000</div>
                            </div>
                            {/* Card 2 */}
                            <div className="border border-[#1C1C1C]/10 rounded-2xl p-4 w-1/3 text-center">
                                <div className="h-32 relative mb-4">
                                    <Image src="https://images.unsplash.com/photo-1532588213369-0eb66191cfa3?auto=format&fit=crop&q=80&w=300" alt="Walnut Dining Table" fill className="object-cover rounded-xl" />
                                </div>
                                <div className="text-sm font-medium">Walnut Dining Table</div>
                                <div className="text-xs text-[#D4AF37] mt-1">Rs.25,000</div>
                            </div>
                            {/* Card 3 */}
                            <div className="border border-[#1C1C1C]/10 rounded-2xl p-4 w-1/3 text-center">
                                <div className="h-32 relative mb-4 bg-[#F5F5F5] flex items-center justify-center rounded-xl overflow-hidden">
                                    <Image src="https://images.unsplash.com/photo-1617104424032-b9e933e4b7b2?auto=format&fit=crop&q=80&w=300" alt="Ceramic Décor Vase" fill className="object-cover" />
                                </div>
                                <div className="text-sm font-medium">Ceramic Décor Vase</div>
                                <div className="text-xs text-[#D4AF37] mt-1">Rs.5,000</div>
                            </div>
                        </div>
                    </section>

                    {/* Comparison History */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-[#663F23] mb-6">Comparison History</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-4 px-6 bg-[#F5F2EC]/50 rounded-2xl border border-[#1C1C1C]/10">
                                <div>
                                    <div className="font-medium text-sm">Velvet Armchair vs. Leather Recliner</div>
                                    <div className="text-xs text-[#1C1C1C]/40 mt-1">Feb 12, 2026</div>
                                </div>
                                <button className="text-[#D4AF37] text-sm">View Again</button>
                            </div>
                            <div className="flex justify-between items-center py-4 px-6 bg-[#F5F2EC]/50 rounded-2xl border border-[#1C1C1C]/10">
                                <div>
                                    <div className="font-medium text-sm">Velvet Armchair vs. Leather Recliner</div>
                                    <div className="text-xs text-[#1C1C1C]/40 mt-1">Feb 12, 2026</div>
                                </div>
                                <button className="text-[#D4AF37] text-sm">View Again</button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
