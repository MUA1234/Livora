"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Loader2,
    AlertCircle,
    Sofa,
    Ruler,
    Palette,
    Clock,
    ShieldCheck,
    Calendar,
    ArrowRight,
    Package,
} from "lucide-react";
import api from "@/lib/api";

interface FurnitureItem {
    productId: string;
    position?: { x: number; y: number; z: number };
    rotation?: number;
    product: {
        _id: string;
        name: string;
        sku: string;
        category: string;
        price: number;
        images: { imageUrl: string; sortOrder: number }[];
        colors: string[];
        materials: string[];
        width: number;
        height: number;
        depth: number;
        description: string;
    } | null;
}

interface RoomData {
    name: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    shape: string;
    flooring: {
        type: string;
        material: string;
    };
}

interface PreviewData {
    designName: string;
    status: string;
    room: RoomData;
    furniture: FurnitureItem[];
    sharedAt: string;
    shareExpires: string | null;
}

export default function PublicPreviewPage() {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<PreviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchPreview = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/public/preview/${token}`);
                setData(res.data);
            } catch (err: any) {
                const status = err.response?.status;
                if (status === 404) {
                    setError("This preview link is invalid or has been revoked.");
                } else if (status === 410) {
                    setError("This preview link has expired. Please request a new one from your designer.");
                } else {
                    setError("Failed to load the design preview. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPreview();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#663F23]" />
                <p className="text-[#1C1C1C]/50 text-sm font-medium">Loading your design preview...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-6 px-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-[#1C1C1C]">Preview Unavailable</h1>
                <p className="text-[#1C1C1C]/50 text-center max-w-md">{error}</p>
                <Link
                    href="/consultation-request"
                    className="px-6 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                >
                    Request a Consultation
                </Link>
            </div>
        );
    }

    const totalCost = data.furniture.reduce((sum, f) => sum + (f.product?.price || 0), 0);
    const room = data.room;

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <header className="bg-white border-b border-[#E5E5E5]/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border border-[#663F23] flex items-center justify-center">
                            <span className="text-[#663F23] text-xs font-bold">LV</span>
                        </div>
                        <span className="text-xl font-bold text-[#663F23]">Livora</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1C1C1C]/40 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Shared Design Preview
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-8 py-10">
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#663F23]/10 rounded-full mb-4">
                        <Sofa className="w-3.5 h-3.5 text-[#663F23]" />
                        <span className="text-xs font-semibold text-[#663F23]">Room Design Preview</span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">{data.designName}</h1>
                    <p className="text-[#1C1C1C]/50">
                        Your personalized room design from Livora.
                        {data.shareExpires && (
                            <span className="ml-2 text-xs text-[#D4AF37]">
                                <Clock className="w-3 h-3 inline mr-1" />
                                Link expires {new Date(data.shareExpires).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </span>
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#663F23]/10 rounded-xl flex items-center justify-center">
                                <Ruler className="w-5 h-5 text-[#663F23]" />
                            </div>
                            <h3 className="font-bold text-[#1C1C1C]">Room Details</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Room Name</span>
                                <span className="font-medium">{room?.name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Dimensions</span>
                                <span className="font-medium">
                                    {room?.dimensions ? `${room.dimensions.length} x ${room.dimensions.width} x ${room.dimensions.height} ${room.dimensions.unit}` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Shape</span>
                                <span className="font-medium capitalize">{room?.shape || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Flooring</span>
                                <span className="font-medium capitalize">{room?.flooring?.material || room?.flooring?.type || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <h3 className="font-bold text-[#1C1C1C]">Design Summary</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Furniture Pieces</span>
                                <span className="font-medium">{data.furniture.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Design Status</span>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${data.status === "published" ? "bg-green-100 text-green-700" : "bg-[#F5F2EC] text-[#663F23]"}`}>
                                    {data.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1C1C1C]/50">Estimated Total</span>
                                <span className="font-bold text-[#663F23]">Rs.{totalCost.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#B5A196]/10 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#B5A196]" />
                            </div>
                            <h3 className="font-bold text-[#1C1C1C]">Next Steps</h3>
                        </div>
                        <p className="text-sm text-[#1C1C1C]/60 mb-4">
                            Love this design? Book a consultation to finalize the details and start bringing your room to life.
                        </p>
                        <Link
                            href="/consultation-request"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#663F23] text-white rounded-xl text-sm font-medium hover:bg-[#52321A] transition-colors"
                        >
                            Book Consultation <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-[#1C1C1C] mb-6">Furniture in Your Design</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.furniture.map((item, index) => {
                            const product = item.product;
                            if (!product) return null;
                            const mainImage = product.images?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.imageUrl;

                            return (
                                <div key={index} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden group hover:shadow-lg transition-shadow">
                                    <div className="relative h-48 bg-[#F5F5F5]">
                                        {mainImage ? (
                                            <Image src={mainImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Sofa className="w-12 h-12 text-[#E5E5E5]" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-[#663F23] uppercase">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-[#1C1C1C] mb-1">{product.name}</h3>
                                        <p className="text-xs text-[#1C1C1C]/40 mb-3 line-clamp-2">{product.description}</p>

                                        <div className="flex items-center gap-3 mb-3">
                                            {product.colors.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Palette className="w-3 h-3 text-[#1C1C1C]/30" />
                                                    <div className="flex gap-1">
                                                        {product.colors.slice(0, 4).map((color, i) => (
                                                            <div key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {product.materials.length > 0 && (
                                                <span className="text-[10px] text-[#1C1C1C]/40 font-medium">
                                                    {product.materials.join(", ")}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-[#F5F2EC]">
                                            <span className="text-xs text-[#1C1C1C]/40">SKU: {product.sku}</span>
                                            <span className="font-bold text-[#663F23]">
                                                Rs.{product.price.toLocaleString("en-LK")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {totalCost > 0 && (
                    <section className="bg-white rounded-2xl border border-[#E5E5E5] p-8 mb-10">
                        <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">Cost Breakdown</h2>
                        <div className="space-y-3">
                            {data.furniture.map((item, index) => {
                                if (!item.product) return null;
                                return (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#F5F2EC] last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#F5F2EC] rounded-lg flex items-center justify-center">
                                                <Sofa className="w-5 h-5 text-[#663F23]/50" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{item.product.name}</p>
                                                <p className="text-xs text-[#1C1C1C]/40">{item.product.sku}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold">Rs.{item.product.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between pt-6 mt-4 border-t-2 border-[#663F23]/10">
                            <span className="text-lg font-bold">Estimated Total</span>
                            <span className="text-2xl font-bold text-[#663F23]">Rs.{totalCost.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                        </div>
                    </section>
                )}

                <footer className="text-center py-8 border-t border-[#E5E5E5]/60">
                    <p className="text-xs text-[#1C1C1C]/30">
                        This is a shared design preview from Livora. Prices and availability are subject to change.
                    </p>
                </footer>
            </div>
        </div>
    );
}
