import Link from "next/link";
import {
    Search,
    Heart,
    User,
    ChevronDown,
    Star
} from "lucide-react";
import Image from "next/image";

export default function FurnitureCatalogue() {
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
                    <Link href="#" className="text-[#663F23] border-b-2 border-[#663F23] pb-1">Catalogue</Link>
                    <Link href="#" className="hover:text-[#663F23] transition-colors">Wishlist</Link>
                    <Link href="#" className="hover:text-[#663F23] transition-colors">Review and Ratings</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors">
                        <Heart size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors">
                        <User size={20} />
                    </button>
                    <button className="px-6 py-2.5 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors">
                        Book Consultation
                    </button>
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

                        {/* Colours */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Colours</h3>
                            <div className="flex gap-3">
                                <button className="w-6 h-6 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600"></button>
                                <button className="w-6 h-6 rounded-full bg-[#663F23] hover:ring-2 ring-offset-2 ring-[#663F23] transition-all"></button>
                                <button className="w-6 h-6 rounded-full bg-[#D4AF37] hover:ring-2 ring-offset-2 ring-[#D4AF37] transition-all"></button>
                                <button className="w-6 h-6 rounded-full bg-gray-200 hover:ring-2 ring-offset-2 ring-gray-200 transition-all"></button>
                                <button className="w-6 h-6 rounded-full bg-[#1C1C1C] hover:ring-2 ring-offset-2 ring-[#1C1C1C] transition-all"></button>
                            </div>
                        </div>

                        {/* Material */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Material</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#663F23] bg-[#663F23] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm">Leather</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#E5E5E5] bg-white"></div>
                                    <span className="text-sm">Fabric</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#663F23] bg-[#663F23] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm">Wood</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#E5E5E5] bg-white"></div>
                                    <span className="text-sm">Metal</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#E5E5E5] bg-white"></div>
                                    <span className="text-sm">Glass</span>
                                </label>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Rating</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#663F23] bg-[#663F23] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div className="flex gap-1 text-[#D4AF37]">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} className="text-[#E5E5E5]" />
                                    </div>
                                    <span className="text-sm">& up</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-5 h-5 rounded border border-[#E5E5E5] bg-white"></div>
                                    <div className="flex gap-1 text-[#D4AF37]">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} className="text-[#E5E5E5]" />
                                        <Star size={14} className="text-[#E5E5E5]" />
                                    </div>
                                    <span className="text-sm">& up</span>
                                </label>
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
                            <p className="text-sm text-[#1C1C1C]/50">Showing 1 - 6 of 124 results</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm">
                            <span className="text-[#1C1C1C]/50">Sort by:</span>
                            <button className="font-semibold flex items-center gap-1">
                                Highest Rated <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product 1 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"
                                    alt="Verona Leather Sofa"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-white text-xs font-bold rounded">NEW</div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(42)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Verona Leather Sofa</h3>
                            <div className="font-bold text-lg mb-4">Rs.245,699.00</div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>

                        {/* Product 2 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600"
                                    alt="Oak Nordic Dining Chair"
                                    fill
                                    className="object-cover"
                                />
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(18)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Oak Nordic Dining Chair</h3>
                            <div className="font-bold text-lg mb-4">Rs.64,000.00</div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>

                        {/* Product 3 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1532588213369-0eb66191cfa3?auto=format&fit=crop&q=80&w=600"
                                    alt="Bronx Coffee Table"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-rose-100 text-rose-500 text-xs font-bold rounded">SALE</div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(85)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Bronx Coffee Table</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="font-bold text-lg">Rs.79,999.00</div>
                                <div className="text-sm text-[#1C1C1C]/40 line-through">Rs.89,000.00</div>
                            </div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>

                        {/* Product 4 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600"
                                    alt="Milo Lounge Chair"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-white text-xs font-bold rounded">NEW</div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(42)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Milo Lounge Chair</h3>
                            <div className="font-bold text-lg mb-4">Rs.180,000.00</div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>

                        {/* Product 5 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600"
                                    alt="Luna Upholstered Bed"
                                    fill
                                    className="object-cover"
                                />
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(18)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Luna Upholstered Bed</h3>
                            <div className="font-bold text-lg mb-4">Rs.349,999.00</div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>

                        {/* Product 6 */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative h-64 bg-[#F5F5F5] rounded-xl overflow-hidden mb-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600"
                                    alt="Nordic Oak Bookshelf"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-rose-100 text-rose-500 text-xs font-bold rounded">SALE</div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1C1C1C] hover:text-red-500 transition-colors">
                                    <Heart size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-[#D4AF37]">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} className="text-[#E5E5E5]" />
                                </div>
                                <span className="text-xs text-[#1C1C1C]/40 ml-1">(85)</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Nordic Oak Bookshelf</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="font-bold text-lg">Rs.32,599.00</div>
                                <div className="text-sm text-[#1C1C1C]/40 line-through">Rs.37,599.00</div>
                            </div>
                            <button className="mt-auto w-full py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
