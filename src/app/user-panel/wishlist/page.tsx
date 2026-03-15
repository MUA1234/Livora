"use client";

import Link from "next/link";
import {
    Heart,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            {/* Main Content */}
            <main className="max-w-[1000px] mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-12">
                <div className="flex items-end gap-3 mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">Wishlist</h1>
                    <span className="text-lg sm:text-xl text-[#1C1C1C]/70 pb-0.5">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
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
                            <div key={item.id} className="bg-[#EBE5DE] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-stretch shadow-sm hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div className="relative w-full sm:w-48 md:w-64 h-48 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-white">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Product Info & Actions */}
                                <div className="flex flex-col flex-1 py-2 sm:py-4 justify-between w-full">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-medium text-[#1C1C1C] mb-2 sm:mb-4">{item.name}</h2>
                                        <div className="text-xl sm:text-2xl text-[#1C1C1C] mb-4 sm:mb-6">{item.price.toLocaleString("en-IN")}/=</div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-auto">
                                        <button
                                            onClick={() => {
                                                addToCart({
                                                    id: item.id,
                                                    name: item.name,
                                                    price: item.price,
                                                    image: item.image,
                                                });
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
