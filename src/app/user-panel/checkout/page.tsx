"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    ShoppingBag,
    Tag,
    CreditCard,
    Banknote,
    CalendarDays,
    Clock,
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

interface PromoResult {
    code: string;
    discountType: string;
    discountValue: number;
    calculatedDiscount: number;
}

const TIME_SLOTS = [
    { label: "Morning (9 AM - 12 PM)", value: "morning_9_12" },
    { label: "Afternoon (12 PM - 5 PM)", value: "afternoon_12_5" },
    { label: "Evening (5 PM - 9 PM)", value: "evening_5_9" },
];

function CheckoutForm() {
    const router = useRouter();
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const stripe = useStripe();
    const elements = useElements();

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [placing, setPlacing] = useState(false);

    // Shipping
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    // Promo
    const [promoCode, setPromoCode] = useState("");
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoResult, setPromoResult] = useState<PromoResult | null>(null);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

    // Delivery
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");

    const discount = promoResult?.calculatedDiscount || 0;
    const finalTotal = Math.max(totalPrice - discount, 0);

    const minDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }, []);

    // Pre-fill user info
    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.name) setFullName(user.name);
                if (user.email) setEmail(user.email);
                if (user.phone) setPhone(user.phone);
            }
        } catch {}
    }, []);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setPromoLoading(true);
        try {
            const res = await api.post("/api/promo-codes/validate", {
                code: promoCode.trim(),
                orderAmount: totalPrice,
            });
            if (res.data.success) {
                setPromoResult(res.data.data);
                setToast({ message: "Promo code applied!", type: "success" });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Invalid promo code";
            setToast({ message: msg, type: "error" });
            setPromoResult(null);
        } finally {
            setPromoLoading(false);
        }
    };

    const removePromo = () => {
        setPromoResult(null);
        setPromoCode("");
    };

    const validateForm = (): string | null => {
        if (!fullName.trim()) return "Full name is required";
        if (!phone.trim()) return "Phone number is required";
        if (!addressLine1.trim()) return "Address is required";
        if (!city.trim()) return "City is required";
        if (!postalCode.trim()) return "Postal code is required";
        if (items.length === 0) return "Your cart is empty";
        return null;
    };

    const handlePlaceOrder = async () => {
        const error = validateForm();
        if (error) {
            setToast({ message: error, type: "error" });
            return;
        }

        setPlacing(true);

        try {
            let stripePaymentIntentId: string | undefined;

            // Handle Stripe payment
            if (paymentMethod === "stripe") {
                if (!stripe || !elements) {
                    setToast({ message: "Stripe is not loaded yet. Please wait.", type: "error" });
                    setPlacing(false);
                    return;
                }

                // Create payment intent
                const piRes = await api.post("/api/orders/create-payment-intent", {
                    amount: finalTotal,
                });

                if (!piRes.data.success) {
                    setToast({ message: "Failed to initialize payment", type: "error" });
                    setPlacing(false);
                    return;
                }

                const cardElement = elements.getElement(CardElement);
                if (!cardElement) {
                    setToast({ message: "Card details not found", type: "error" });
                    setPlacing(false);
                    return;
                }

                const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                    piRes.data.clientSecret,
                    { payment_method: { card: cardElement } }
                );

                if (stripeError) {
                    setToast({ message: stripeError.message || "Payment failed", type: "error" });
                    setPlacing(false);
                    return;
                }

                stripePaymentIntentId = paymentIntent?.id;
            }

            // Create order
            const orderData = {
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    addressLine1: addressLine1.trim(),
                    addressLine2: addressLine2.trim() || undefined,
                    city: city.trim(),
                    postalCode: postalCode.trim(),
                },
                paymentMethod,
                promoCode: promoResult?.code || undefined,
                deliveryDate: deliveryDate || undefined,
                deliveryTimeSlot: deliveryTimeSlot || undefined,
                ...(stripePaymentIntentId && { stripePaymentIntentId }),
            };

            const res = await api.post("/api/orders", orderData);

            if (res.data.success) {
                clearCart();
                setToast({ message: "Order placed successfully!", type: "success" });
                setTimeout(() => {
                    router.push(`/user-panel/orders/${res.data.data._id}`);
                }, 800);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to place order";
            setToast({ message: msg, type: "error" });
        } finally {
            setPlacing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5]">
                <ShoppingBag size={48} className="mx-auto text-[#1C1C1C]/20 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-[#1C1C1C]/60 mb-6">
                    Add some items to your cart before checking out.
                </p>
                <Link
                    href="/user-panel/furniture-catalogue"
                    className="inline-block px-8 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                >
                    Browse Catalogue
                </Link>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Forms */}
                <div className="flex-1 space-y-6">
                    {/* Shipping Address */}
                    <section className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[#663F23] text-white text-xs flex items-center justify-center font-bold">
                                1
                            </span>
                            Shipping Address
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+94 77 123 4567"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Address Line 1 *
                                </label>
                                <input
                                    type="text"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    placeholder="123 Main Street"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Colombo"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="10100"
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Promo Code */}
                    <section className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[#663F23] text-white text-xs flex items-center justify-center font-bold">
                                2
                            </span>
                            Promo Code
                        </h2>
                        {promoResult ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    <span className="font-semibold text-green-800">
                                        {promoResult.code}
                                    </span>
                                    <span className="text-sm text-green-600">
                                        &mdash; Rs.{promoResult.calculatedDiscount.toLocaleString("en-IN")} off
                                    </span>
                                </div>
                                <button
                                    onClick={removePromo}
                                    className="p-1 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Tag
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/30"
                                    />
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Enter promo code"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] placeholder:text-[#1C1C1C]/30 focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors uppercase"
                                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                                    />
                                </div>
                                <button
                                    onClick={handleApplyPromo}
                                    disabled={promoLoading || !promoCode.trim()}
                                    className="px-6 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {promoLoading && <Loader2 size={16} className="animate-spin" />}
                                    Apply
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Payment Method */}
                    <section className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[#663F23] text-white text-xs flex items-center justify-center font-bold">
                                3
                            </span>
                            Payment Method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("cod")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                    paymentMethod === "cod"
                                        ? "border-[#663F23] bg-[#663F23]/5"
                                        : "border-[#E5E5E5] hover:border-[#663F23]/30"
                                }`}
                            >
                                <Banknote
                                    size={22}
                                    className={
                                        paymentMethod === "cod"
                                            ? "text-[#663F23]"
                                            : "text-[#1C1C1C]/40"
                                    }
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-[#1C1C1C]/50">Pay when you receive</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("stripe")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                    paymentMethod === "stripe"
                                        ? "border-[#663F23] bg-[#663F23]/5"
                                        : "border-[#E5E5E5] hover:border-[#663F23]/30"
                                }`}
                            >
                                <CreditCard
                                    size={22}
                                    className={
                                        paymentMethod === "stripe"
                                            ? "text-[#663F23]"
                                            : "text-[#1C1C1C]/40"
                                    }
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-sm">Credit Card (Stripe)</p>
                                    <p className="text-xs text-[#1C1C1C]/50">Pay securely online</p>
                                </div>
                            </button>
                        </div>

                        {paymentMethod === "stripe" && (
                            <div className="mt-5 p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E5E5]">
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-3">
                                    Card Details
                                </label>
                                <div className="bg-white rounded-lg p-3 border border-[#E5E5E5]">
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "16px",
                                                    color: "#1C1C1C",
                                                    "::placeholder": { color: "#1C1C1C50" },
                                                },
                                                invalid: { color: "#ef4444" },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Delivery Schedule */}
                    <section className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[#663F23] text-white text-xs flex items-center justify-center font-bold">
                                4
                            </span>
                            Delivery Schedule
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    <CalendarDays size={14} className="inline mr-1.5 -mt-0.5" />
                                    Preferred Date
                                </label>
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    min={minDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
                                    <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                                    Time Slot
                                </label>
                                <select
                                    value={deliveryTimeSlot}
                                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#663F23]/30 focus:border-[#663F23] transition-colors"
                                >
                                    <option value="">Select a time slot</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Order Summary */}
                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm sticky top-28">
                        <h3 className="text-lg font-bold mb-5">Order Summary</h3>

                        {/* Items */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-5">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5] border border-[#E5E5E5]">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#1C1C1C]/20">
                                                <ShoppingBag size={16} />
                                            </div>
                                        )}
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#663F23] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-[#1C1C1C]/50">
                                            Rs.{item.price.toLocaleString("en-IN")} x {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold shrink-0">
                                        Rs.{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#E5E5E5] pt-4 space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#1C1C1C]/60">
                                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                                </span>
                                <span className="font-medium">
                                    Rs.{totalPrice.toLocaleString("en-IN")}.00
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#1C1C1C]/60">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600">
                                        Discount ({promoResult?.code})
                                    </span>
                                    <span className="text-green-600 font-medium">
                                        -Rs.{discount.toLocaleString("en-IN")}.00
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-[#E5E5E5] pt-3 flex justify-between">
                                <span className="font-bold text-base">Total</span>
                                <span className="font-bold text-lg">
                                    Rs.{finalTotal.toLocaleString("en-IN")}.00
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="w-full mt-6 py-3.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {placing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={18} />
                                    Place Order
                                </>
                            )}
                        </button>

                        <Link
                            href="/user-panel/cart"
                            className="block text-center mt-4 text-sm text-[#663F23] font-medium hover:underline"
                        >
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            <main className="max-w-[1100px] mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href="/user-panel/cart"
                        className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#1C1C1C]/60 hover:text-[#663F23] hover:border-[#663F23] transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">Checkout</h1>
                </div>

                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </main>
        </div>
    );
}
