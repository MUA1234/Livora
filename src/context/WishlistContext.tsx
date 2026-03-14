"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getInitialWishlist(): WishlistItem[] {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem("livora_wishlist");
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>(getInitialWishlist);
    const isInitialMount = useRef(true);

    // Save to local storage whenever items change (skip initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem("livora_wishlist", JSON.stringify(items));
    }, [items]);

    const addToWishlist = (item: WishlistItem) => {
        setItems((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const isInWishlist = (id: string) => {
        return items.some((i) => i.id === id);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
