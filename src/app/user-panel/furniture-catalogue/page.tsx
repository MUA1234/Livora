"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search, ChevronDown, Star, Loader2, Package, Heart
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import Image from "next/image";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import api from "@/lib/api";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: { imageUrl: string; sortOrder: number }[];
    category: string;
    materials: string[];
    colors: string[];
    description?: string;
}

const CATEGORIES = [
    { label: 'All furniture', value: '' },
    { label: 'Sofa', value: 'Sofa' },
    { label: 'Chair', value: 'Chair' },
    { label: 'Table', value: 'Table' },
    { label: 'Bed', value: 'Bed' },
    { label: 'Storage', value: 'Storage' },
    { label: 'Lighting', value: 'Lighting' },
    { label: 'Decor', value: 'Decor' },
];

export default function FurnitureCatalogue() {
    const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page), limit: '9' };
            if (search) params.search = search;
            if (category) params.category = category;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (sortBy) params.sortBy = sortBy;

            const query = new URLSearchParams(params).toString();
            const res = await api.get(`/api/products?${query}`);
            setProducts(res.data.products || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error('Failed to fetch products', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [search, category, minPrice, maxPrice, sortBy, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch('');
        setSearchInput('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
    };

    const toggleWishlist = (product: Product) => {
        const item: WishlistItem = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.imageUrl || '',
        };
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(item);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            {/* Main */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-10 flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0">
                    <form onSubmit={handleSearch} className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search furniture..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                        />
                    </form>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">Categories</h3>
                            <ul className="space-y-3 text-sm">
                                {CATEGORIES.map((cat) => (
                                    <li
                                        key={cat.value}
                                        onClick={() => { setCategory(cat.value); setPage(1); }}
                                        className={`flex justify-between cursor-pointer transition-colors
                                            ${category === cat.value
                                                ? 'font-semibold text-[#663F23]'
                                                : 'text-[#1C1C1C]/60 hover:text-[#1C1C1C]'}`}
                                    >
                                        <span>{cat.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Price Range</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Rs 0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#663F23]"
                                />
                                <span className="text-[#1C1C1C]/40">-</span>
                                <input
                                    type="number"
                                    placeholder="Rs max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#663F23]"
                                />
                            </div>
                            <button
                                onClick={() => fetchProducts()}
                                className="mt-3 w-full py-2 bg-[#663F23] text-white rounded-xl text-sm font-medium hover:bg-[#52321A] transition-colors"
                            >
                                Apply
                            </button>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="w-full py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-2">Furniture Catalogue</h1>
                            <p className="text-sm text-[#1C1C1C]/50">
                                {loading ? 'Loading...' : `Showing ${products.length} of ${total} results`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm">
                            <span className="text-[#1C1C1C]/50">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="font-semibold bg-transparent focus:outline-none cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-[#663F23]" size={40} />
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Package size={48} className="text-[#663F23]/30 mb-4" />
                            <h3 className="text-xl font-semibold text-[#1C1C1C]/60 mb-2">No products found</h3>
                            <p className="text-sm text-[#1C1C1C]/40 mb-4">
                                {search || category ? 'Try adjusting your filters' : 'No products have been added yet'}
                            </p>
                            {(search || category) && (
                                <button onClick={clearFilters} className="px-4 py-2 bg-[#663F23] text-white rounded-lg text-sm hover:bg-[#52321A]">
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {products.map((product) => {
                                const isLiked = isInWishlist(product._id);
                                const imageUrl = product.images?.[0]?.imageUrl ||
                                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600';

                                return (
                                    <div key={product._id} className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                        <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4 group">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {product.category && (
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-[#663F23]/80 text-white text-xs font-bold rounded">
                                                    {product.category}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleWishlist(product)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center hover:text-red-500 hover:bg-white transition-all transform hover:scale-110"
                                            >
                                                <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex text-[#D4AF37]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className="text-[#E5E5E5]" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-[#1C1C1C]/40 ml-1">No reviews</span>
                                        </div>

                                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>

                                        {product.materials?.length > 0 && (
                                            <p className="text-xs text-[#1C1C1C]/40 mb-2">{product.materials.join(', ')}</p>
                                        )}

                                        <div className="font-bold text-lg mb-4">
                                            Rs.{product.price.toLocaleString('en-IN')}.00
                                        </div>

                                        <Link
                                            href={`/user-panel/furniture-details/${product._id}`}
                                            className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors text-center block shadow hover:shadow-md"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!loading && total > 9 && (
                        <div className="flex justify-center gap-2 mt-10">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm disabled:opacity-40 hover:bg-[#663F23] hover:text-white transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-[#1C1C1C]/60">
                                Page {page} of {Math.ceil(total / 9)}
                            </span>
                            <button
                                disabled={page >= Math.ceil(total / 9)}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm disabled:opacity-40 hover:bg-[#663F23] hover:text-white transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}