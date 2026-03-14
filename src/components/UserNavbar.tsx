"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";

const NAV_LINKS = [
    { href: "/user-panel/furniture-catalogue", label: "Catalogue" },
    { href: "/user-panel/wishlist", label: "Wishlist" },
    { href: "/user-panel/review-and-ratings", label: "Review and Ratings" },
];

export default function UserNavbar() {
    const pathname = usePathname();
    const { items } = useWishlist();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const isOnConsultation = pathname === "/user-panel/consultation-request";

    return (
        <header className="bg-white px-8 md:px-16 h-20 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            {/* Logo */}
            <Link href="/user-panel/furniture-catalogue" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#663F23] flex items-center justify-center overflow-hidden">
                    <img
                        src="/images/logo.png"
                        alt="Livora Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-2xl font-bold text-[#663F23] tracking-tight">
                    Livora
                </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-[#1C1C1C]/80">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    const isWishlist = link.href === "/user-panel/wishlist";

                    return (
                        <div key={link.href} className="relative">
                            <Link
                                href={link.href}
                                className={
                                    isActive
                                        ? "text-[#663F23] border-b-2 border-[#663F23] pb-1 font-semibold"
                                        : "hover:text-[#663F23] transition-colors"
                                }
                            >
                                {link.label}
                            </Link>
                            {isWishlist && items.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {items.length}
                                </span>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Wishlist Icon */}
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

                {/* Login or My Account */}
                {isLoggedIn ? (
                    <Link
                        href="/user-panel/my-account"
                        className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                    >
                        <User size={20} />
                    </Link>
                ) : (
                    <Link
                        href="/user-panel/login"
                        className="px-4 py-2 border border-[#663F23] text-[#663F23] rounded-lg text-sm font-medium hover:bg-[#663F23] hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                )}

                {/* Book Consultation */}
                {!isOnConsultation && (
                    <Link
                        href="/user-panel/consultation-request"
                        className="px-6 py-2.5 bg-[#663F23] text-white rounded-lg font-medium hover:bg-[#52321A] transition-colors"
                    >
                        Book Consultation
                    </Link>
                )}
            </div>
        </header>
    );
}
