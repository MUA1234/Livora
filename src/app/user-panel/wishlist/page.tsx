"use client";

import Link from "next/link";
import {
    Heart,
    User,
} from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            {/* Top Navigation */}
            <header className="bg-white px-8 md:px-16 h-20 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                        <span className="text-[#663F23] text-sm font-bold">LV</span>
                    </div>
                    <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-[#1C1C1C]/80">
                    <Link href="/user-panel/furniture-catalogue" className="hover:text-[#663F23] transition-colors">Catalogue</Link>
                    <div className="relative">
                        <Link href="/user-panel/wishlist" className="text-[#663F23] border-b-2 border-[#663F23] pb-1 font-semibold">Wishlist</Link>
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </div>
                    <Link href="#" className="hover:text-[#663F23] transition-colors">Review and Ratings</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/user-panel/wishlist" className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors relative">
                        <Heart size={20} className={items.length > 0 ? "fill-[#663F23] text-[#663F23]" : ""} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </Link>
                    <Link href="/user-panel/my-account" className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors">
                        <User size={20} />
                    </Link>
                    <Link href="/user-panel/consultation-request" className="px-6 py-2.5 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors">
                        Book Consultation
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1000px] mx-auto px-8 md:px-16 py-12">
                <div className="flex items-end gap-3 mb-10">
                    <h1 className="text-3xl font-bold text-[#1C1C1C]">Wishlist</h1>
                    <span className="text-xl text-[#1C1C1C]/70 pb-0.5">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                </div>

                <div className="space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5]">
                            <Heart size={48} className="mx-auto text-[#1C1C1C]/20 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                            <p className="text-[#1C1C1C]/60 mb-6">Browse our catalogue and heart your favorite items to save them here.</p>
                            <Link href="/user-panel/furniture-catalogue" className="inline-block px-8 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                Explore Catalogue
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-[#EBE5DE] rounded-[32px] p-6 flex flex-col sm:flex-row gap-8 items-center sm:items-stretch shadow-sm hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div className="relative w-full sm:w-64 h-64 rounded-2xl overflow-hidden shrink-0 bg-white">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Product Info & Actions */}
                                <div className="flex flex-col flex-1 py-4 justify-between w-full">
                                    <div>
                                        <h2 className="text-2xl font-medium text-[#1C1C1C] mb-4">{item.name}</h2>
                                        <div className="text-2xl text-[#1C1C1C] mb-6">{item.price.toLocaleString("en-IN")}/=</div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-auto">
                                        <button
                                            onClick={() => {
                                                alert(`${item.name} has been added to your cart.`);
                                                removeFromWishlist(item.id);
                                            }}
                                            className="px-8 py-3 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors shadow-sm flex-1 sm:flex-none min-w-[160px]"
                                        >
                                            Add to cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="px-8 py-3 bg-white text-[#1C1C1C] border border-transparent rounded-lg font-medium hover:bg-gray-50 hover:border-[#E5E5E5] transition-colors shadow-sm flex-1 sm:flex-none min-w-[160px]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
