"use client";

import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WishlistProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </WishlistProvider>
    );
}
