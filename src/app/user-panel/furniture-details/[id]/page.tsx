"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Heart,
    Star,
    ShoppingCart,
    Calendar,
    PenSquare,
    ChevronRight,
    Loader2,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { useWishlist } from "@/context/WishlistContext";
import api from "@/lib/api";

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
    colors: string[];
    materials: string[];
    images: ProductImage[];
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    distribution: number[];
}

export default function FurnitureDetails() {
    const { id } = useParams<{ id: string }>();
    const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/api/products/${id}`),
                    api.get(`/api/reviews/product/${id}?limit=3`),
                ]);

                setProduct(productRes.data);
                setReviewStats(reviewsRes.data?.data?.stats ?? null);
            } catch {
                setError("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const isLiked = product ? isInWishlist(product._id) : false;

    const toggleWishlist = () => {
        if (!product) return;
        if (isLiked) {
            removeFromWishlist(product._id);
        } else {
            const mainImage = sortedImages.length > 0 ? sortedImages[0].imageUrl : "";
            addToWishlist({
                id: product._id,
                name: product.name,
                price: product.price,
                image: mainImage,
            });
        }
    };

    const sortedImages = product
        ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
        : [];

    const averageRating = reviewStats?.averageRating ?? 0;
    const totalReviews = reviewStats?.totalReviews ?? 0;

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const fraction = rating - fullStars;

        return (
            <div className="flex text-[#D4AF37]">
                {Array.from({ length: 5 }, (_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} size={16} fill="currentColor" />;
                    }
                    if (i === fullStars && fraction > 0) {
                        return (
                            <div key={i} className="relative">
                                <Star size={16} className="text-[#E5E5E5]" />
                                <div
                                    className="absolute inset-0 overflow-hidden text-[#D4AF37]"
                                    style={{ width: `${fraction * 100}%` }}
                                >
                                    <Star size={16} fill="currentColor" />
                                </div>
                            </div>
                        );
                    }
                    return <Star key={i} size={16} className="text-[#E5E5E5]" />;
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#663F23]" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
                <p className="text-lg text-[#1C1C1C]/70">{error || "Product not found."}</p>
                <Link
                    href="/user-panel/furniture-catalogue"
                    className="px-6 py-3 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors"
                >
                    Back to Catalogue
                </Link>
            </div>
        );
    }

    const mainImageUrl = sortedImages.length > 0 ? sortedImages[selectedImage]?.imageUrl : "";

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            <main className="max-w-[1400px] mx-auto px-8 md:px-16 py-8">
                <div className="flex items-center gap-2 text-sm text-[#1C1C1C]/60 mb-8">
                    <Link href="/" className="hover:text-[#1C1C1C] transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/user-panel/furniture-catalogue" className="hover:text-[#1C1C1C] transition-colors">Catalogue</Link>
                    <ChevronRight size={14} />
                    <Link href="#" className="hover:text-[#1C1C1C] transition-colors">{product.category}</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1C1C1C]">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-[55%] flex flex-col gap-4">
                        <div className="relative w-full aspect-[4/3] bg-[#E5E5E5] rounded-2xl overflow-hidden">
                            {mainImageUrl && (
                                <Image
                                    src={mainImageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        {sortedImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {sortedImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-[4/3] bg-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer transition-opacity ${
                                            selectedImage === index
                                                ? "ring-2 ring-[#D4AF37] ring-offset-2"
                                                : "hover:opacity-80"
                                        }`}
                                    >
                                        <Image
                                            src={img.imageUrl}
                                            alt={`${product.name} view ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[45%] flex flex-col">
                        <h1 className="text-4xl font-extrabold text-[#1C1C1C] mb-3">{product.name}</h1>

                        <div className="flex items-center gap-2 mb-6 text-sm">
                            {renderStars(averageRating)}
                            <span className="text-[#1C1C1C]/60 underline cursor-pointer hover:text-[#1C1C1C]">
                                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                            </span>
                        </div>

                        <div className="text-4xl font-bold text-[#1C1C1C] mb-6">
                            Rs.{product.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                        </div>

                        <p className="text-[#1C1C1C]/80 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {product.colors.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-4 text-[#1C1C1C]">Available Colours</h3>
                                <div className="flex gap-4">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            className="w-8 h-8 rounded-full border border-gray-300 hover:ring-2 ring-offset-2 transition-all"
                                            style={{ backgroundColor: color, outlineColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-10 bg-white p-6 rounded-2xl border border-[#E5E5E5]">
                            <h3 className="font-bold text-lg mb-4 text-[#1C1C1C]">Specifications & Dimensions</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                {product.materials.length > 0 && (
                                    <div>
                                        <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Materials</span>
                                        <span className="font-semibold text-[#1C1C1C]">{product.materials.join(", ")}</span>
                                    </div>
                                )}
                                {product.sku && (
                                    <div>
                                        <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">SKU</span>
                                        <span className="font-semibold text-[#1C1C1C]">{product.sku}</span>
                                    </div>
                                )}
                                {product.width > 0 && (
                                    <div>
                                        <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Width</span>
                                        <span className="font-semibold text-[#1C1C1C]">{product.width} inches</span>
                                    </div>
                                )}
                                {product.depth > 0 && (
                                    <div>
                                        <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Depth</span>
                                        <span className="font-semibold text-[#1C1C1C]">{product.depth} inches</span>
                                    </div>
                                )}
                                {product.height > 0 && (
                                    <div>
                                        <span className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider block mb-1">Overall Height</span>
                                        <span className="font-semibold text-[#1C1C1C]">{product.height} inches</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                                <button
                                    onClick={toggleWishlist}
                                    title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                                        isLiked
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-[#D4AF37] text-white hover:bg-[#C19B2E]"
                                    }`}
                                >
                                    <Heart size={20} className={isLiked ? "fill-white" : ""} />
                                </button>
                            </div>

                            <Link href="/user-panel/consultation-request" className="w-full py-4 bg-[#C1A87D] text-[#1C1C1C] rounded-xl font-medium hover:bg-[#B59C70] transition-colors flex items-center justify-center gap-2">
                                <Calendar size={18} /> Request Design Consultation
                            </Link>

                            <Link
                                href="/user-panel/review-and-ratings"
                                className="w-full py-4 border border-[#C1A87D] bg-[#E8DCC4] text-[#1C1C1C] rounded-xl font-medium hover:bg-[#DED0B5] transition-colors flex items-center justify-center gap-2"
                            >
                                <PenSquare size={18} /> Write a Review
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
