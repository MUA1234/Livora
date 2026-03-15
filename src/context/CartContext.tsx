"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
    totalPrice: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "livora_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const isInitialMount = useRef(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {}
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const isInCart = (id: string) => items.some((i) => i.id === id);

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, isInCart, totalPrice, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
