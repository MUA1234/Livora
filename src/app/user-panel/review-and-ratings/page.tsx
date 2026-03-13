"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
    Star,
    Heart,
    User,
    ThumbsUp,
    MessageCircle,
    ShieldCheck,
    Send,
    Loader2,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ReviewUser {
    name: string;
    email: string;
}

interface ReviewProduct {
    name: string;
    price: number;
    sku: string;
    images: string[];
}

interface Review {
    _id: string;
    userId: ReviewUser;
    productId: ReviewProduct;
    rating: number;
    title: string;
    body: string;
    helpfulCount: number;
    verified: boolean;
    createdAt: string;
}

interface RatingDistribution {
    stars: number;
    count: number;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    distribution: RatingDistribution[];
}

interface Pagination {
    page: number;
    pages: number;
    total: number;
}

interface Product {
    _id: string;
    name: string;
}

function StarRow({
    rating,
    size = 16,
    interactive = false,
    onRate,
}: {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRate?: (n: number) => void;
}) {
    const [hover, setHover] = useState(0);
    const display = interactive ? hover || rating : rating;

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={`${display >= n ? "fill-[#C8973A] text-[#C8973A]" : "fill-[#E5DDD5] text-[#E5DDD5]"} ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
                    onMouseEnter={() => interactive && setHover(n)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onRate && onRate(n)}
                />
            ))}
        </div>
    );
}

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatPrice(price: number): string {
    return `Rs. ${price.toLocaleString()}`;
}

function getRatingLabel(avg: number): string {
    if (avg >= 4.5) return "Excellent";
    if (avg >= 3.5) return "Very Good";
    if (avg >= 2.5) return "Good";
    if (avg >= 1.5) return "Fair";
    return "Poor";
}

export default function ReviewAndRatingsPage() {
    const { items } = useWishlist();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);

    const [activeFilter, setActiveFilter] = useState<number | null>(null);
    const [sort, setSort] = useState<"recent" | "highest" | "lowest">("recent");
    const [currentPage, setCurrentPage] = useState(1);

    const [form, setForm] = useState({
        rating: 4,
        title: "",
        product: "",
        body: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = {
                page: currentPage,
                limit: 10,
                sort,
            };
            if (activeFilter !== null) {
                params.rating = activeFilter;
            }
            const res = await api.get("/api/reviews", { params });
            const data = res.data.data;
            setReviews(data.reviews);
            setStats(data.stats);
            setPagination(data.pagination);
        } catch {
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sort, activeFilter]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get("/api/products", { params: { limit: 100 } });
            const data = res.data.data || res.data.products || res.data;
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.products && Array.isArray(data.products)) {
                setProducts(data.products);
            }
        } catch {
            setProducts([]);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, sort]);

    const handleHelpful = async (reviewId: string) => {
        if (helpfulLoading) return;
        setHelpfulLoading(reviewId);
        try {
            await api.put(`/api/reviews/${reviewId}/helpful`);
            setReviews((prev) =>
                prev.map((r) =>
                    r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
                )
            );
        } catch {
            // silent
        } finally {
            setHelpfulLoading(null);
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Review title is required.";
        if (!form.body.trim()) e.body = "Please write your review.";
        else if (form.body.trim().length < 30) e.body = "Review must be at least 30 characters.";
        if (form.rating === 0) e.rating = "Please select a rating.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setSubmitError("");
        if (!validate()) return;

        const token = getToken();
        if (!token) {
            setSubmitError("Please log in to submit a review.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/api/reviews", {
                productId: form.product || undefined,
                rating: form.rating,
                title: form.title,
                body: form.body,
            });
            setIsSubmitting(false);
            setSubmitted(true);
            setForm({ rating: 4, title: "", product: "", body: "" });
            fetchReviews();
            setTimeout(() => setSubmitted(false), 6000);
        } catch (err: any) {
            setIsSubmitting(false);
            setSubmitError(
                err?.response?.data?.message || "Failed to submit review. Please try again."
            );
        }
    };

    const handleChange = (
        ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = ev.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const distribution = stats?.distribution || [];
    const totalReviews = stats?.totalReviews || 0;

    const countByStar = (s: number) => {
        const entry = distribution.find((d) => d.stars === s);
        return entry?.count || 0;
    };

    const distributionWithPct = [5, 4, 3, 2, 1].map((star) => {
        const count = countByStar(star);
        const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { star, count, pct };
    });

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <header className="bg-white px-8 md:px-16 h-20 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center">
                        <span className="text-[#663F23] text-sm font-bold">LV</span>
                    </div>
                    <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-[#1C1C1C]/80">
                    <Link href="/user-panel/furniture-catalogue" className="hover:text-[#663F23] transition-colors">
                        Catalogue
                    </Link>
                    <div className="relative">
                        <Link href="/user-panel/wishlist" className="hover:text-[#663F23] transition-colors">
                            Wishlist
                        </Link>
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </div>
                    <Link
                        href="/user-panel/review-and-ratings"
                        className="text-[#663F23] border-b-2 border-[#663F23] pb-1 font-semibold"
                    >
                        Review and Ratings
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/user-panel/wishlist"
                        className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors relative"
                    >
                        <Heart size={20} className={items.length > 0 ? "fill-[#663F23] text-[#663F23]" : ""} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/user-panel/my-account"
                        className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors"
                    >
                        <User size={20} />
                    </Link>
                    <Link
                        href="/user-panel/consultation-request"
                        className="px-6 py-2.5 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors"
                    >
                        Book Consultation
                    </Link>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1C1C1C]">Reviews &amp; Ratings</h1>
                    <p className="text-[#1C1C1C]/60 mt-1 text-sm">
                        Real experiences from our community — helping you choose with confidence.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8E3] flex flex-col md:flex-row overflow-hidden mb-6">
                    <div className="flex flex-col items-center justify-center px-12 py-10 border-r border-[#EDE8E3] min-w-[220px]">
                        <div className="text-7xl font-bold text-[#1C1C1C] tracking-tight leading-none mb-3">
                            {stats ? stats.averageRating.toFixed(1) : "—"}
                        </div>
                        <StarRow rating={Math.round(stats?.averageRating || 0)} size={24} />
                        <p className="text-xs text-[#1C1C1C]/50 mt-2">
                            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                        </p>
                        {stats && (
                            <span className="mt-4 px-4 py-1 bg-[#EDF7EF] text-[#4CAF50] text-xs font-semibold rounded-full border border-[#4CAF50]/20">
                                {getRatingLabel(stats.averageRating)}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 px-8 py-8">
                        <p className="text-[10px] font-bold text-[#1C1C1C]/40 uppercase tracking-widest mb-5">
                            Rating Distribution
                        </p>
                        <div className="space-y-3">
                            {distributionWithPct.map(({ star, count, pct }) => (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-3 text-[#1C1C1C]/60 font-medium text-right shrink-0">{star}</span>
                                    <Star size={13} className="fill-[#C8973A] text-[#C8973A] shrink-0" />
                                    <div className="flex-1 bg-[#F3EDE7] rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-[#C8973A] rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="w-3 text-[#1C1C1C]/60 shrink-0 text-right">{count}</span>
                                    <span className="w-8 text-[#1C1C1C]/40 text-xs text-right shrink-0">{pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                        <span className="text-[#1C1C1C]/50 font-medium">{totalReviews} reviews &nbsp; Filter:</span>
                        {[5, 4, 3, 2, 1].map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveFilter(activeFilter === s ? null : s)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium transition-all ${activeFilter === s
                                        ? "bg-[#663F23] text-white border-[#663F23]"
                                        : "bg-white border-[#DDD5CC] text-[#1C1C1C]/70 hover:border-[#663F23] hover:text-[#663F23]"
                                    }`}
                            >
                                {s} <Star size={10} className="fill-current" />
                                <span className="ml-0.5 opacity-70">({countByStar(s)})</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#1C1C1C]/50 font-medium">Sort:</span>
                        {(["recent", "highest", "lowest"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSort(s)}
                                className={`px-4 py-1.5 rounded-full border text-xs font-semibold capitalize transition-all ${sort === s
                                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                                        : "bg-white border-[#DDD5CC] text-[#1C1C1C]/70 hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
                                    }`}
                            >
                                {s === "recent" ? "Most Recent" : s === "highest" ? "Highest" : "Lowest"}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-[#663F23]" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-[#EDE8E3]">
                        <Star size={40} className="mx-auto text-[#1C1C1C]/20 mb-4" />
                        <p className="text-[#1C1C1C]/50">No reviews match this filter.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {reviews.map((r) => (
                                <div
                                    key={r._id}
                                    className="bg-white rounded-2xl border border-[#EDE8E3] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-[#663F23] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(r.userId?.name || "U")}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
                                                    {r.userId?.name || "Anonymous"}
                                                    {r.verified && (
                                                        <ShieldCheck size={13} className="text-[#4CAF50]" />
                                                    )}
                                                    {r.verified && (
                                                        <span className="text-[10px] text-[#4CAF50] font-medium">Verified</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-[#1C1C1C]/40">
                                                    {new Date(r.createdAt).toLocaleDateString("en-CA")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            {r.helpfulCount >= 10 && (
                                                <span className="px-2 py-0.5 bg-[#FFF8EC] text-[#C8973A] text-[10px] font-bold rounded border border-[#C8973A]/20 uppercase tracking-wide">
                                                    ★ TOP REVIEW
                                                </span>
                                            )}
                                            <span className="text-[10px] text-[#1C1C1C]/40 text-right leading-tight">
                                                {r.productId?.name || "General"}<br />
                                                <span className="text-[#663F23] font-medium">
                                                    {r.productId?.price ? formatPrice(r.productId.price) : ""}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <StarRow rating={r.rating} size={14} />
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${r.rating >= 5
                                                    ? "bg-green-50 text-green-600"
                                                    : r.rating >= 4
                                                        ? "bg-blue-50 text-blue-600"
                                                        : r.rating >= 3
                                                            ? "bg-amber-50 text-amber-600"
                                                            : "bg-red-50 text-red-500"
                                                }`}
                                        >
                                            {RATING_LABELS[r.rating] || ""}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="font-bold text-[#1C1C1C] text-sm mb-1">{r.title}</div>
                                        <p className="text-xs text-[#1C1C1C]/60 leading-relaxed">
                                            {r.body.length > 180 ? r.body.slice(0, 180) + "..." : r.body}
                                            {r.body.length > 180 && (
                                                <>&nbsp;<button className="text-[#663F23] font-medium hover:underline">Read more</button></>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-1 border-t border-[#F3EDE7] mt-auto">
                                        <button
                                            onClick={() => handleHelpful(r._id)}
                                            disabled={helpfulLoading === r._id}
                                            className="flex items-center gap-1.5 text-[#1C1C1C]/50 hover:text-[#663F23] transition-colors text-xs font-medium disabled:opacity-50"
                                        >
                                            <ThumbsUp size={13} /> Helpful ({r.helpfulCount})
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[#1C1C1C]/50 hover:text-[#663F23] transition-colors text-xs font-medium">
                                            <MessageCircle size={13} /> Reply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mb-10">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg border border-[#DDD5CC] text-sm font-medium hover:border-[#663F23] hover:text-[#663F23] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p === currentPage
                                                ? "bg-[#663F23] text-white"
                                                : "border border-[#DDD5CC] text-[#1C1C1C]/70 hover:border-[#663F23] hover:text-[#663F23]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                                    disabled={currentPage === pagination.pages}
                                    className="px-4 py-2 rounded-lg border border-[#DDD5CC] text-sm font-medium hover:border-[#663F23] hover:text-[#663F23] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="bg-white rounded-3xl border border-[#EDE8E3] shadow-sm p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5EBE1] flex items-center justify-center">
                            <Star size={22} className="fill-[#663F23] text-[#663F23]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1C1C1C]">Write a Review</h2>
                            <p className="text-xs text-[#1C1C1C]/50">Share your experience to help others make better choices</p>
                        </div>
                    </div>

                    {submitted ? (
                        <div className="text-center py-14">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                                <Send size={26} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Review Submitted!</h3>
                            <p className="text-[#1C1C1C]/60 text-sm">Thank you for sharing your experience. Your review is under review and will be published soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="mt-6">
                            {submitError && (
                                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {submitError}
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row gap-8">

                                <div className="md:w-52 shrink-0 flex flex-col items-center justify-start pt-2">
                                    <label className="text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-widest mb-4">
                                        Your Rating <span className="text-red-400">*</span>
                                    </label>
                                    <StarRow
                                        rating={form.rating}
                                        size={36}
                                        interactive
                                        onRate={(n) => {
                                            setForm((p) => ({ ...p, rating: n }));
                                            if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
                                        }}
                                    />
                                    <span className="mt-3 text-sm font-semibold text-[#663F23]">
                                        {form.rating > 0 ? RATING_LABELS[form.rating] : "Tap to rate"}
                                    </span>
                                    {errors.rating && (
                                        <p className="text-red-500 text-xs mt-1 text-center">{errors.rating}</p>
                                    )}
                                </div>

                                <div className="flex-1 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-widest mb-2">
                                                Review Title <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={form.title}
                                                onChange={handleChange}
                                                placeholder="Summarize your experience..."
                                                className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EC] border focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all text-sm ${errors.title ? "border-red-400" : "border-transparent"
                                                    }`}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-widest mb-2">
                                                Product (Optional)
                                            </label>
                                            <select
                                                name="product"
                                                value={form.product}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EC] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all text-sm appearance-none text-[#1C1C1C]/70"
                                            >
                                                <option value="">e.g., Linen 3-Seater Sofa</option>
                                                {products.map((p) => (
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-widest mb-2">
                                            Your Review <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            name="body"
                                            value={form.body}
                                            onChange={handleChange}
                                            rows={5}
                                            maxLength={500}
                                            placeholder="Tell us about the product quality, delivery experience, and how it looks in your home..."
                                            className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EC] border focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all text-sm resize-none ${errors.body ? "border-red-400" : "border-transparent"
                                                }`}
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {errors.body ? (
                                                <p className="text-red-500 text-xs">{errors.body}</p>
                                            ) : (
                                                <span />
                                            )}
                                            <span className="text-xs text-[#1C1C1C]/30 ml-auto">
                                                {form.body.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-8 py-3 bg-[#663F23] text-white rounded-xl font-semibold hover:bg-[#52321A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm"
                                        >
                                            {isSubmitting ? (
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send size={15} />
                                            )}
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
