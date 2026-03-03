import Link from "next/link";
import Image from "next/image";
import {
    Heart,
    User,
    Star,
    ShoppingCart,
    Calendar,
    PenSquare,
    ChevronRight,
    Search
} from "lucide-react";

export default function FurnitureDetails() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            {/* Top Navigation */}
            <header className="bg-[#FAF8F5] px-8 md:px-16 h-20 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                        <span className="text-[#663F23] text-sm font-bold">LV</span>
                    </div>
                    <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-[#1C1C1C]/80">
                    <Link href="/user-panel/furniture-catalogue" className="hover:text-[#663F23] transition-colors">Catalogue</Link>
                    <Link href="#" className="hover:text-[#663F23] transition-colors">Wishlist</Link>
                    <Link href="#" className="hover:text-[#663F23] transition-colors">Review and Ratings</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1C1C1C] border border-[#E5E5E5] hover:bg-[#E5E5E5] transition-colors">
                        <Heart size={20} />
                    </button>
                    <Link href="/user-panel/my-account" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1C1C1C] border border-[#E5E5E5] hover:bg-[#E5E5E5] transition-colors">
                        <User size={20} />
                    </Link>
                    <Link href="/user-panel/consultation-request" className="px-6 py-2.5 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors">
                        Book Consultation
                    </Link>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 md:px-16 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-[#1C1C1C]/60 mb-8">
                    <Link href="/" className="hover:text-[#1C1C1C] transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/user-panel/furniture-catalogue" className="hover:text-[#1C1C1C] transition-colors">Catalogue</Link>
                    <ChevronRight size={14} />
                    <Link href="#" className="hover:text-[#1C1C1C] transition-colors">Living Room</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1C1C1C]">Lumina Premium Velvet Sofa</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Images */}
                    <div className="w-full lg:w-[55%] flex flex-col gap-4">
                        <div className="relative w-full aspect-[4/3] bg-[#E5E5E5] rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
                                alt="Lumina Premium Velvet Sofa"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="relative aspect-[4/3] bg-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer ring-2 ring-[#D4AF37] ring-offset-2">
                                <Image
                                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300"
                                    alt="Sofa view 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[4/3] bg-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                <Image
                                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=300"
                                    alt="Sofa view 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden cursor-pointer border border-[#E5E5E5] hover:opacity-80 transition-opacity flex items-center justify-center">
                                {/* Mock white image */}
                            </div>
                            <div className="relative aspect-[4/3] bg-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                <Image
                                    src="https://images.unsplash.com/photo-1540574163026-643ea2032beb?auto=format&fit=crop&q=80&w=300"
                                    alt="Sofa view 3"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full lg:w-[45%] flex flex-col">
                        <h1 className="text-4xl font-extrabold text-[#1C1C1C] mb-3">Lumina Premium Velvet Sofa</h1>

                        <div className="flex items-center gap-2 mb-6 text-sm">
                            <div className="flex text-[#D4AF37]">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <div className="relative">
                                    <Star size={16} className="text-[#E5E5E5]" />
                                    <div className="absolute inset-0 overflow-hidden w-[80%] text-[#D4AF37]">
                                        <Star size={16} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-[#1C1C1C]/60 underline cursor-pointer hover:text-[#1C1C1C]">4.8 (124 reviews)</span>
                        </div>

                        <div className="text-4xl font-bold text-[#1C1C1C] mb-6">Rs.345,899.00</div>

                        <p className="text-[#1C1C1C]/80 leading-relaxed mb-8">
                            Elevate your living space with the Lumina Premium Velvet Sofa. Designed with a timeless silhouette, high-density foam cushions, and a sturdy kiln-dried hardwood frame, this piece perfectly balances luxury and durability.
                        </p>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-4 text-[#1C1C1C]">Available Colours</h3>
                            <div className="flex gap-4">
                                <button className="w-8 h-8 rounded-full bg-[#303E48] ring-2 ring-offset-2 ring-[#303E48]"></button>
                                <button className="w-8 h-8 rounded-full bg-[#A08168] hover:ring-2 ring-offset-2 ring-[#A08168] transition-all"></button>
                                <button className="w-8 h-8 rounded-full bg-[#E5E7EB] border border-gray-300 hover:ring-2 ring-offset-2 ring-[#E5E7EB] transition-all"></button>
                                <button className="w-8 h-8 rounded-full bg-[#5C6E3D] hover:ring-2 ring-offset-2 ring-[#5C6E3D] transition-all"></button>
                            </div>
                        </div>

                        <div className="mb-10 bg-white p-6 rounded-2xl border border-[#E5E5E5]">
                            <h3 className="font-bold text-lg mb-4 text-[#1C1C1C]">Specifications & Dimensions</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Material Type</span>
                                    <span className="font-semibold text-[#1C1C1C]">Premium Velvet</span>
                                </div>
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Frame</span>
                                    <span className="font-semibold text-[#1C1C1C]">Kiln-dried hardwood</span>
                                </div>
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Width</span>
                                    <span className="font-semibold text-[#1C1C1C]">84 inches</span>
                                </div>
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Depth</span>
                                    <span className="font-semibold text-[#1C1C1C]">38 inches</span>
                                </div>
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Height</span>
                                    <span className="font-semibold text-[#1C1C1C]">34 inches</span>
                                </div>
                                <div>
                                    <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Seat Height</span>
                                    <span className="font-semibold text-[#1C1C1C]">18 inches</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                                <button className="w-14 h-14 bg-[#D4AF37] text-white rounded-xl flex items-center justify-center hover:bg-[#C19B2E] transition-colors shrink-0">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <Link href="/user-panel/consultation-request" className="w-full py-4 bg-[#C1A87D] text-[#1C1C1C] rounded-xl font-medium hover:bg-[#B59C70] transition-colors flex items-center justify-center gap-2">
                                <Calendar size={18} /> Request Design Consultation
                            </Link>

                            <button className="w-full py-4 border border-[#C1A87D] bg-[#E8DCC4] text-[#1C1C1C] rounded-xl font-medium hover:bg-[#DED0B5] transition-colors flex items-center justify-center gap-2">
                                <PenSquare size={18} /> Write a Review
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
