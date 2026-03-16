"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User, ShoppingCart, Menu, X, Bell } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import NotificationBell from "@/components/NotificationBell";

const NAV_LINKS = [
    { href: "/user-panel/furniture-catalogue", label: "Catalogue" },
    { href: "/user-panel/cart", label: "Cart" },
    { href: "/user-panel/wishlist", label: "Wishlist" },
    { href: "/user-panel/orders", label: "Orders" },
    { href: "/user-panel/review-and-ratings", label: "Reviews" },
];

export default function UserNavbar() {
    const pathname = usePathname();
    const { items } = useWishlist();
    const { totalItems: cartCount } = useCart();
    const { unreadCount } = useNotifications();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isOnConsultation = pathname === "/user-panel/consultation-request";

    return (
        <>
            <header className="bg-white px-4 sm:px-8 md:px-16 h-16 sm:h-20 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                {/* Logo */}
                <Link href="/user-panel/furniture-catalogue" className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#663F23] flex items-center justify-center overflow-hidden">
                        <img
                            src="/images/logo.png"
                            alt="Livora Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-[#663F23] tracking-tight">
                        Livora
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-[#1C1C1C]/80">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        const isWishlist = link.href === "/user-panel/wishlist";
                        const isCart = link.href === "/user-panel/cart";

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
                                {isCart && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Cart Icon */}
                    <Link
                        href="/user-panel/cart"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors relative"
                    >
                        <ShoppingCart size={18} className={cartCount > 0 ? "text-[#663F23]" : ""} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Wishlist Icon */}
                    <Link
                        href="/user-panel/wishlist"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors relative"
                    >
                        <Heart size={18} className={items.length > 0 ? "fill-[#663F23] text-[#663F23]" : ""} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#663F23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {/* Notifications */}
                    {isLoggedIn && (
                        <NotificationBell
                            isAdmin={false}
                            allNotificationsHref="/user-panel/notifications"
                        />
                    )}

                    {/* Login or My Account */}
                    {isLoggedIn ? (
                        <Link
                            href="/user-panel/my-account"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                        >
                            <User size={18} />
                        </Link>
                    ) : (
                        <Link
                            href="/user-panel/login"
                            className="hidden sm:inline-block px-4 py-2 border border-[#663F23] text-[#663F23] rounded-lg text-sm font-medium hover:bg-[#663F23] hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                    )}

                    {/* Book Consultation - desktop only */}
                    {!isOnConsultation && (
                        <Link
                            href="/user-panel/consultation-request"
                            className="hidden md:inline-block px-4 lg:px-6 py-2.5 bg-[#663F23] text-white rounded-lg text-sm font-medium hover:bg-[#52321A] transition-colors"
                        >
                            Book Consultation
                        </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E5E5E5] transition-colors"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-sm overflow-y-auto">
                    <nav className="flex flex-col p-6 gap-2">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            const isWishlist = link.href === "/user-panel/wishlist";
                            const isCart = link.href === "/user-panel/cart";

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                                        isActive
                                            ? "bg-[#663F23] text-white"
                                            : "text-[#1C1C1C] hover:bg-[#FAF8F5]"
                                    }`}
                                >
                                    <span>{link.label}</span>
                                    {isWishlist && items.length > 0 && (
                                        <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${isActive ? "bg-white text-[#663F23]" : "bg-[#663F23] text-white"}`}>
                                            {items.length}
                                        </span>
                                    )}
                                    {isCart && cartCount > 0 && (
                                        <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${isActive ? "bg-white text-[#663F23]" : "bg-[#663F23] text-white"}`}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        {isLoggedIn && (
                            <Link
                                href="/user-panel/notifications"
                                className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                                    pathname === "/user-panel/notifications"
                                        ? "bg-[#663F23] text-white"
                                        : "text-[#1C1C1C] hover:bg-[#FAF8F5]"
                                }`}
                            >
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                        pathname === "/user-panel/notifications" ? "bg-white text-[#663F23]" : "bg-red-500 text-white"
                                    }`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="border-t border-[#E5E5E5] my-4" />

                        {!isOnConsultation && (
                            <Link
                                href="/user-panel/consultation-request"
                                className="px-4 py-4 bg-[#663F23] text-white rounded-xl text-lg font-medium text-center hover:bg-[#52321A] transition-colors"
                            >
                                Book Consultation
                            </Link>
                        )}

                        {!isLoggedIn && (
                            <Link
                                href="/user-panel/login"
                                className="px-4 py-4 border border-[#663F23] text-[#663F23] rounded-xl text-lg font-medium text-center hover:bg-[#663F23] hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
