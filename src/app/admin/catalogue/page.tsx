"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Check,
    Plus,
    Loader2
} from "lucide-react";

interface ProductImage {
    imageUrl: string;
    sortOrder: number;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    description: string;
    width: number;
    height: number;
    depth: number;
    colors: { name: string; hex: string }[];
    materials: string[];
    images: ProductImage[];
}

const categories = ["All Items", "Sofas", "Chairs", "Tables", "Beds", "Storage", "Lighting", "Decor", "Rugs"];

export default function CatalogueBrowse() {
    const [products, setProducts] = useState<Product[]>([]);
    const [addedToDesign, setAddedToDesign] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState("All Items");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page, limit: 9 };
            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }
            if (selectedCategory !== "All Items") {
                params.category = selectedCategory;
            }
            const res = await api.get("/api/products", { params });
            setProducts(res.data.products);
            setTotalPages(res.data.pages);
            setTotal(res.data.total);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategory]);

    const toggleAddToDesign = (productId: string) => {
        setAddedToDesign((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const formatPrice = (price: number) => {
        return `Rs.${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-[#F5F1E8]">
                <div className="sticky top-0 z-10 bg-[#F5F1E8] px-8 py-4 flex items-center justify-between border-b border-[#E5E5E5]/30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors">
                            <ArrowLeft size={18} className="text-[#1C1C1C]" />
                        </button>
                        <h1 className="text-xl font-bold text-[#1C1C1C]">Browse Furniture</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-[#1C1C1C]/50">Adding to Design</p>
                            <p className="text-sm font-bold text-[#1C1C1C]">Modern Living Room</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                    ? "bg-[#663F23] text-white"
                                    : "bg-white border border-[#E5E5E5] text-[#1C1C1C]/70 hover:border-[#663F23] hover:text-[#663F23]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 mb-8">
                        <div className="relative w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" />
                            <input
                                type="text"
                                placeholder="Search furniture by name or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                            />
                        </div>

                        <div className="flex gap-3 ml-auto">
                            <div className="relative">
                                <select className="appearance-none px-4 py-2.5 pr-9 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]">
                                    <option>Price: Any</option>
                                    <option>Under Rs.50,000</option>
                                    <option>Rs.50,000 - Rs.200,000</option>
                                    <option>Over Rs.200,000</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none px-4 py-2.5 pr-9 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]">
                                    <option>Material: Any</option>
                                    <option>Wood</option>
                                    <option>Fabric</option>
                                    <option>Metal</option>
                                    <option>Leather</option>
                                    <option>Marble</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none px-4 py-2.5 pr-9 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]">
                                    <option>Color: Any</option>
                                    <option>Black</option>
                                    <option>White</option>
                                    <option>Brown</option>
                                    <option>Gold</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none px-4 py-2.5 pr-9 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]">
                                    <option>Sort by: Most Popular</option>
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Price Low</option>
                                    <option>Sort by: Price High</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 size={32} className="animate-spin text-[#663F23]" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                                        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                                            {product.images[0]?.imageUrl ? (
                                                <img
                                                    src={product.images[0].imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#1C1C1C]/20 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleAddToDesign(product._id)}
                                                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                    addedToDesign.has(product._id)
                                                        ? "bg-[#663F23] text-white"
                                                        : "bg-white/80 text-[#1C1C1C]/50 hover:bg-white hover:text-[#663F23]"
                                                }`}
                                            >
                                                {addedToDesign.has(product._id) ? <Check size={16} /> : <Plus size={16} />}
                                            </button>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-bold text-[#663F23] uppercase tracking-wider">{product.category}</span>
                                                <span className="text-sm font-bold text-[#1C1C1C]">{formatPrice(product.price)}</span>
                                            </div>

                                            <h3 className="font-bold text-[#1C1C1C] text-base mb-2">{product.name}</h3>

                                            <div className="flex items-center gap-1.5 mb-4">
                                                {product.colors.slice(0, 3).map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-5 h-5 rounded-full border border-[#E5E5E5]"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                ))}
                                                {product.colors.length > 3 && (
                                                    <span className="text-xs text-[#1C1C1C]/40 ml-1">+{product.colors.length - 3} colors</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {products.length === 0 && (
                                <div className="text-center py-16 text-sm text-[#1C1C1C]/40">
                                    No products found matching your search.
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                                p === page
                                                    ? "bg-[#663F23] text-white"
                                                    : "border border-[#E5E5E5] bg-white text-[#1C1C1C]/70 hover:border-[#663F23] hover:text-[#663F23]"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}

                            {total > 0 && (
                                <p className="text-center text-xs text-[#1C1C1C]/40 mt-3">
                                    Showing {(page - 1) * 9 + 1}–{Math.min(page * 9, total)} of {total} products
                                </p>
                            )}
                        </>
                    )}
                </div>
            </main>

        </div>
    );
}
