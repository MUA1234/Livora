"use client";

import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WishlistProvider>
            <CartProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </CartProvider>
        </WishlistProvider>
    );
}
