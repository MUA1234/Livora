"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    ScrollText,
    Search,
    ChevronDown,
    ArrowLeft,
    Check,
    Plus
} from "lucide-react";
import Image from "next/image";

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    colors: { name: string; hex: string }[];
    materials: string[];
    image: string;
    addedToDesign: boolean;
}

const initialProducts: Product[] = [
    {
        id: 1,
        name: "Hampton 3-Seater Sofa",
        sku: "SOF-0912",
        category: "Sofas",
        price: 379599.0,
        colors: [
            { name: "Gold", hex: "#C6A75E" },
            { name: "Black", hex: "#1C1C1C" },
            { name: "Brown", hex: "#663F23" },
        ],
        materials: ["Fabric", "Wood"],
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
        addedToDesign: true,
    },
    {
        id: 2,
        name: "Oskar Dining Chair",
        sku: "CHR-4431",
        category: "Chairs",
        price: 15499.0,
        colors: [
            { name: "Black", hex: "#1C1C1C" },
            { name: "White", hex: "#E5E5E5" },
        ],
        materials: ["Wood"],
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
    {
        id: 3,
        name: "Aura Marble Coffee Table",
        sku: "TBL-1029",
        category: "Tables",
        price: 22599.0,
        colors: [
            { name: "White", hex: "#E5E5E5" },
            { name: "Black", hex: "#1C1C1C" },
        ],
        materials: ["Marble", "Metal"],
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
    {
        id: 4,
        name: "Lumina Floor Lamp",
        sku: "LGT-2201",
        category: "Lighting",
        price: 35500.0,
        colors: [
            { name: "Black", hex: "#1C1C1C" },
            { name: "Gold", hex: "#C6A75E" },
        ],
        materials: ["Metal"],
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
    {
        id: 5,
        name: "Luna Upholstered Bed",
        sku: "BED-7762",
        category: "Beds",
        price: 349999.0,
        colors: [
            { name: "Gray", hex: "#9CA3AF" },
            { name: "Brown", hex: "#663F23" },
        ],
        materials: ["Fabric", "Wood"],
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
        addedToDesign: true,
    },
    {
        id: 6,
        name: "Nordic Oak Bookshelf",
        sku: "STR-3310",
        category: "Storage",
        price: 37599.0,
        colors: [{ name: "Brown", hex: "#C6A75E" }],
        materials: ["Wood"],
        image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
    {
        id: 7,
        name: "Celeste Round Dining Table",
        sku: "TBL-4455",
        category: "Tables",
        price: 32469.0,
        colors: [
            { name: "Gold", hex: "#C6A75E" },
            { name: "Black", hex: "#1C1C1C" },
        ],
        materials: ["Wood"],
        image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
    {
        id: 8,
        name: "Milo Lounge Chair",
        sku: "CHR-8890",
        category: "Chairs",
        price: 180000.0,
        colors: [
            { name: "Gray", hex: "#9CA3AF" },
            { name: "Blue", hex: "#4A5568" },
            { name: "Red", hex: "#C53030" },
            { name: "Black", hex: "#1C1C1C" },
        ],
        materials: ["Fabric", "Wood"],
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
        addedToDesign: false,
    },
];

const categories = ["All Items", "Sofas", "Chairs", "Tables", "Beds", "Storage", "Lighting", "Decor", "Rugs"];

export default function CatalogueBrowse() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState("All Items");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === "All Items" || p.category === selectedCategory;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleAddToDesign = (productId: number) => {
        setProducts(
            products.map((p) =>
                p.id === productId ? { ...p, addedToDesign: !p.addedToDesign } : p
            )
        );
    };

    const formatPrice = (price: number) => {
        return `Rs.${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

                        <Link href="/admin/catalogue" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors">
                            <Sofa size={20} />
                            <span className="font-medium text-sm">Catalogue</span>
                        </Link>

                        <Link href="/admin/catalogue-management" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors pl-8">
                            <Settings size={16} />
                            <span className="font-medium text-sm">Catalogue Management</span>
                        </Link>

                        <Link href="/admin/compare-designs" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutTemplate size={20} />
                            <span className="font-medium text-sm">Compare Designs</span>
                        </Link>

                        <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <FileText size={20} />
                            <span className="font-medium text-sm">Cost Reports</span>
                        </Link>

                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
                        </Link>

                        <Link href="/admin/design-history" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <ScrollText size={20} />
                            <span className="font-medium text-sm">Design History</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-[#E5E5E5]/50">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
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
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8]">
                {/* Top Header */}
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
                    {/* Category Tabs */}
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

                    {/* Search & Filters */}
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

                    {/* Product Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm group">
                                {/* Product Image */}
                                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-[#663F23] uppercase tracking-wider">{product.category}</span>
                                        <span className="text-sm font-bold text-[#1C1C1C]">{formatPrice(product.price)}</span>
                                    </div>

                                    <h3 className="font-bold text-[#1C1C1C] text-base mb-2">{product.name}</h3>

                                    {/* Colors */}
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

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16 text-sm text-[#1C1C1C]/40">
                            No products found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}