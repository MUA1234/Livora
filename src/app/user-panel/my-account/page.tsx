"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Send, Heart, Star, LogOut, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import PhoneInput from "@/components/ui/PhoneInput";
import api from "@/lib/api";
import { getUser, getToken, logout } from "@/lib/auth";
import { Toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";

export default function MyAccountPage() {
    const router = useRouter();
    const { items: wishlistItems } = useWishlist();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [consultations, setConsultations] = useState<any[]>([]);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/user-panel/login");
            return;
        }
        loadProfile();
        loadConsultations();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get("/api/users/profile");
            const u = res.data.data;
            setName(u.name || "");
            setEmail(u.email || "");
            setPhone(u.phone || "");
        } catch {
            const user = getUser();
            if (user) {
                setName(user.name || "");
                setEmail(user.email || "");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadConsultations = async () => {
        try {
            const res = await api.get("/api/consultation-requests/my");
            setConsultations(res.data.data || []);
        } catch {
            setConsultations([]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/api/users/profile", { name, email, phone });
            setToast({ message: "Profile updated successfully", type: "success" });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to update profile", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
    };
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
                    <Link href="/user-panel/review-and-ratings" className="flex items-center gap-4 px-6 py-4 text-[#1C1C1C]/70 hover:bg-[#F5F2EC]/50 rounded-xl transition-colors">
                        <Star size={20} className="text-[#1C1C1C]/60" />
                        Review and Ratings
                    </Link>
                </nav>

                <div className="mt-auto bg-[#B5A196] p-4 rounded-2xl flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#B5A196] font-bold shrink-0">
                        {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                    </div>
                    <div>
                        <div className="font-bold">{name || "User"}</div>
                        <div className="text-xs text-white/80">{email}</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 pl-0">
                <div className="max-w-[800px]">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-[#663F23]">My Account</h1>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2 border border-[#1C1C1C]/20 rounded-full hover:bg-white transition-colors text-sm font-medium">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    {/* Profile Information */}
                    <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold text-[#663F23] mb-6">Profile Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2">Full Name</label>
                                <input type="text" className="w-full bg-[#F5F2EC] rounded-xl px-4 py-3 outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-[#F5F2EC] rounded-xl px-4 py-3 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm mb-2">Phone Number</label>
                                    <PhoneInput
                                        value={phone}
                                        onChange={setPhone}
                                        placeholder="Phone number"
                                        style={{ background: "#F5F2EC", borderRadius: "12px" }}
                                        id="account-phone"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors disabled:opacity-60">
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Saved Consultation Requests */}
                    <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#663F23]">Saved Consultation Requests</h2>
                            <Link href="/user-panel/consultation-request" className="text-[#D4AF37] text-sm font-medium">Book New</Link>
                        </div>
                        <div className="w-full text-sm">
                            <div className="flex justify-between font-bold mb-4 px-2">
                                <div className="w-1/4">Room Type</div>
                                <div className="w-1/4">Date</div>
                                <div className="w-1/4">Status</div>
                                <div className="w-1/4 text-center">Action</div>
                            </div>
                            {consultations.length === 0 ? (
                                <div className="text-center py-8 text-[#1C1C1C]/40">
                                    No consultation requests yet.{" "}
                                    <Link href="/user-panel/consultation-request" className="text-[#D4AF37] font-medium">Book one now</Link>
                                </div>
                            ) : (
                                consultations.slice(0, 5).map((c: any) => (
                                    <div key={c._id} className="flex justify-between items-center border-t border-[#F5F2EC] py-4 px-2">
                                        <div className="w-1/4 capitalize">{c.roomType?.replace("-", " ")}</div>
                                        <div className="w-1/4">{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                                        <div className="w-1/4">
                                            <span className={`px-3 py-1 rounded-md text-xs capitalize ${
                                                c.status === "confirmed" ? "bg-[#B5A196] text-white" :
                                                c.status === "completed" ? "bg-green-100 text-green-700" :
                                                c.status === "rejected" ? "bg-red-100 text-red-600" :
                                                "bg-[#F5F2EC]"
                                            }`}>{c.status}</span>
                                        </div>
                                        <div className="w-1/4 flex justify-center">
                                            <button className="flex items-center gap-1 text-[#D4AF37]"><Eye size={14} /> view</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#663F23]">Wishlist Overview</h2>
                            <Link href="/user-panel/wishlist" className="px-4 py-1.5 border border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-medium">
                                View Full Wishlist
                            </Link>
                        </div>
                        {wishlistItems.length === 0 ? (
                            <div className="text-center py-8 text-[#1C1C1C]/40">
                                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Your wishlist is empty. Browse our catalogue to add items.</p>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                {wishlistItems.slice(0, 3).map((item) => (
                                    <Link key={item.id} href={`/user-panel/furniture-details/${item.id}`} className="border border-[#1C1C1C]/10 rounded-2xl p-4 w-1/3 text-center hover:border-[#D4AF37] transition-colors">
                                        <div className="h-32 relative mb-4 bg-[#F5F5F5] rounded-xl overflow-hidden">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Heart className="w-8 h-8 text-[#D4AF37]/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium truncate">{item.name}</div>
                                        <div className="text-xs text-[#D4AF37] mt-1">Rs.{item.price.toLocaleString()}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
