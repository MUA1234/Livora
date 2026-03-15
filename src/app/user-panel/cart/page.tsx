"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            <main className="max-w-[1000px] mx-auto px-8 md:px-16 py-12">
                <div className="flex items-end justify-between mb-10">
                    <div className="flex items-end gap-3">
                        <h1 className="text-3xl font-bold text-[#1C1C1C]">Shopping Cart</h1>
                        <span className="text-xl text-[#1C1C1C]/70 pb-0.5">
                            ({totalItems} {totalItems === 1 ? "item" : "items"})
                        </span>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5]">
                        <ShoppingCart size={48} className="mx-auto text-[#1C1C1C]/20 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-[#1C1C1C]/60 mb-6">
                            Browse our catalogue and add items to your cart.
                        </p>
                        <Link
                            href="/user-panel/furniture-catalogue"
                            className="inline-block px-8 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                        >
                            Explore Catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-5 flex gap-5 items-center border border-[#E5E5E5] shadow-sm"
                                >
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#1C1C1C]/20">
                                                <ShoppingCart size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#1C1C1C] truncate">{item.name}</h3>
                                        <p className="text-sm text-[#1C1C1C]/50 mt-1">
                                            Rs.{item.price.toLocaleString("en-IN")}.00
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[100px]">
                                        <p className="font-bold text-[#1C1C1C]">
                                            Rs.{(item.price * item.quantity).toLocaleString("en-IN")}.00
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1C1C1C]/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm sticky top-28">
                                <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#1C1C1C]/60">Subtotal ({totalItems} items)</span>
                                        <span className="font-medium">Rs.{totalPrice.toLocaleString("en-IN")}.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#1C1C1C]/60">Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-[#E5E5E5] pt-3 flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-lg">Rs.{totalPrice.toLocaleString("en-IN")}.00</span>
                                    </div>
                                </div>

                                <button className="w-full py-3.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors shadow-sm">
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/user-panel/furniture-catalogue"
                                    className="block text-center mt-4 text-sm text-[#663F23] font-medium hover:underline"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
