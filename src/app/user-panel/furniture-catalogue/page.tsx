"use client";

import Link from "next/link";
import {
    Search,
    Heart,
    User,
    ChevronDown,
    Star
} from "lucide-react";
import Image from "next/image";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";

const PRODUCTS = [
    {
        id: "1",
        name: "Verona Leather Sofa",
        price: 245699,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
        rating: 4,
        reviews: 42,
        badge: "NEW",
        originalPrice: undefined
    },
    {
        id: "2",
        name: "Oak Nordic Dining Chair",
        price: 64000,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600",
        rating: 4,
        reviews: 18,
        badge: undefined,
        originalPrice: undefined
    },
    {
        id: "3",
        name: "Bronx Coffee Table",
        price: 79999,
        image: "https://images.unsplash.com/photo-1532588213369-0eb66191cfa3?auto=format&fit=crop&q=80&w=600",
        rating: 4,
        reviews: 85,
        badge: "SALE",
        originalPrice: 89000
    },
    {
        id: "4",
        name: "Milo Lounge Chair",
        price: 180000,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600",
        rating: 4,
        reviews: 42,
        badge: "NEW",
        originalPrice: undefined
    },
    {
        id: "5",
        name: "Luna Upholstered Bed",
        price: 349999,
        image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600",
        rating: 3,
        reviews: 18,
        badge: undefined,
        originalPrice: undefined
    },
    {
        id: "6",
        name: "Nordic Oak Bookshelf",
        price: 32599,
        image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600",
        rating: 4,
        reviews: 85,
        badge: "SALE",
        originalPrice: 37599
    }
];

export default function FurnitureCatalogue() {
    const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const toggleWishlist = (product: WishlistItem) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            {/* Top Navigation */}
            <header className="bg-white px-8 md:px-16 h-20 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                        <span className="text-[#663F23] text-sm font-bold">LV</span>
                    </div>
                    <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-[#1C1C1C]/80">
                    <Link href="/user-panel/furniture-catalogue" className="text-[#663F23] border-b-2 border-[#663F23] pb-1">Catalogue</Link>
                    <Link href="/user-panel/wishlist" className="hover:text-[#663F23] transition-colors relative">
                        Wishlist
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </Link>
                    <Link href="/user-panel/review-and-ratings" className="hover:text-[#663F23] transition-colors">Review and Ratings</Link>
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
            <main className="max-w-[1400px] mx-auto px-8 md:px-16 py-10 flex flex-col md:flex-row gap-10">
                {/* Left Sidebar - Filters */}
                <aside className="w-full md:w-64 shrink-0">
                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search furniture..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                        />
                    </div>

                    <div className="space-y-8">
                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Categories</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between font-semibold text-[#1C1C1C]">
                                    <span>All furniture</span>
                                    <span>124</span>
                                </li>
                                <li className="flex justify-between text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer">
                                    <span>Sofas & Sectionals</span>
                                    <span>32</span>
                                </li>
                                <li className="flex justify-between text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer">
                                    <span>Chairs & Armchairs</span>
                                    <span>48</span>
                                </li>
                                <li className="flex justify-between text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer">
                                    <span>Tables & Desks</span>
                                    <span>21</span>
                                </li>
                                <li className="flex justify-between text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer">
                                    <span>Beds & Mattresses</span>
                                    <span>15</span>
                                </li>
                                <li className="flex justify-between text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer">
                                    <span>Lighting</span>
                                    <span>8</span>
                                </li>
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Price Range</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Rs 0"
                                        className="w-full px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#663F23]"
                                        defaultValue="Rs 0"
                                    />
                                </div>
                                <span className="text-[#1C1C1C]/40">-</span>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Rs 5,800,00"
                                        className="w-full px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#663F23]"
                                        defaultValue="Rs 5,800,00"
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Clear filters
                        </button>
                    </div>
                </aside>

                {/* Right Area - Products */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">Furniture Catalogue</h1>
                            <p className="text-sm text-[#1C1C1C]/50">Showing 1 - {PRODUCTS.length} of 124 results</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm">
                            <span className="text-[#1C1C1C]/50">Sort by:</span>
                            <button className="font-semibold flex items-center gap-1">
                                Highest Rated <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map((product) => {
                            const isLiked = isInWishlist(product.id);
                            return (
                                <div key={product.id} className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                    <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4 group cursor-pointer">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.badge && (
                                            <div className={`absolute top-3 left-3 px-3 py-1 ${product.badge === 'SALE' ? 'bg-rose-100 text-rose-500' : 'bg-[#D4AF37] text-white'} text-xs font-bold rounded`}>
                                                {product.badge}
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(product);
                                            }}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 hover:bg-white transition-all transform hover:scale-110"
                                        >
                                            <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-[#D4AF37]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={i < product.rating ? "fill-currentColor" : "text-[#E5E5E5]"} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-[#1C1C1C]/40 ml-1">({product.reviews})</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="font-bold text-lg">Rs.{product.price.toLocaleString("en-IN")}.00</div>
                                        {product.originalPrice && (
                                            <div className="text-sm text-[#1C1C1C]/40 line-through">Rs.{product.originalPrice.toLocaleString("en-IN")}.00</div>
                                        )}
                                    </div>
                                    <Link href={`/user-panel/furniture-details/${product.id}`} className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors text-center block shadow hover:shadow-md">
                                        View Details
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
