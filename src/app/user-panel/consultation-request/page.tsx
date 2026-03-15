"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    Clock,
    Circle,
    Briefcase,
    Calendar,
    Send,
    User,
    Mail,
    Phone,
    Home,
    Maximize,
    MessageSquare,
    Box,
    Shield
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import api from "@/lib/api";

export default function ConsultationRequest() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        roomType: "Living Room",
        roomSize: "",
        visitDate: "",
        notes: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone) newErrors.phone = "Phone number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                await api.post("/api/consultation-requests", {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    roomType: formData.roomType,
                    roomSize: formData.roomSize,
                    visitDate: formData.visitDate,
                    notes: formData.notes,
                });
                setIsSuccess(true);
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    roomType: "Living Room",
                    roomSize: "",
                    visitDate: "",
                    notes: ""
                });
                setTimeout(() => setIsSuccess(false), 5000);
            } catch {
                // Optionally handle error
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1C1C1C]">
            <UserNavbar />

            {/* Hero Section */}
            <section className="bg-[#4A3219] text-white pt-10 sm:pt-16 pb-28 sm:pb-40 px-4 sm:px-8 md:px-16 relative">
                <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                            <span className="text-[#E8DCC4]">✦</span> Free Design Consultation
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
                            Book Your Design<br />Consultation
                        </h1>
                        <p className="text-white/80 text-lg mb-10 max-w-lg leading-relaxed">
                            Let our expert designers help you create the perfect space. Share your room details and we'll craft a personalized furniture plan just for you.
                        </p>

                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-start gap-3">
                                <Clock className="text-[#E8DCC4] mt-1 shrink-0" size={20} />
                                <div>
                                    <div className="font-semibold text-sm">Response within</div>
                                    <div className="text-white/60 text-xs mt-1">24-48 hours</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Circle className="text-[#E8DCC4] mt-1 shrink-0" size={20} />
                                <div>
                                    <div className="font-semibold text-sm">No obligation</div>
                                    <div className="text-white/60 text-xs mt-1">100% free</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Briefcase className="text-[#E8DCC4] mt-1 shrink-0" size={20} />
                                <div>
                                    <div className="font-semibold text-sm">Expert designers</div>
                                    <div className="text-white/60 text-xs mt-1">10+ years exp.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"
                                alt="Modern living room interior"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="relative -mt-20 sm:-mt-24 px-4 sm:px-8 md:px-16 z-10 pb-12 sm:pb-20">
                <div className="max-w-[800px] mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-[#E5E5E5]">
                    {isSuccess ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Request Sent Successfully!</h2>
                            <p className="text-[#1C1C1C]/60 mb-8">Our team will get back to you within 24-48 hours.</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="px-8 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                            >
                                Submit Another Request
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold mb-3">Your Details</h2>
                                <p className="text-[#1C1C1C]/60">Fill in the form below and our team will reach out to schedule your consultation.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-5">Personal Information</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                                <User size={16} className="text-[#1C1C1C]/40" /> Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className={`w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all ${errors.fullName ? 'border-red-500' : 'border-transparent'}`}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                                    <Mail size={16} className="text-[#1C1C1C]/40" /> Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your@email.com"
                                                    className={`w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                                />
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                                    <Phone size={16} className="text-[#1C1C1C]/40" /> Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+94718473246"
                                                    className={`w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                                                />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-5">Room Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                                <Home size={16} className="text-[#1C1C1C]/40" /> Room Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="roomType"
                                                    value={formData.roomType}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all appearance-none pr-10"
                                                >
                                                    <option value="Living Room">Living Room</option>
                                                    <option value="Bedroom">Bedroom</option>
                                                    <option value="Dining Room">Dining Room</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Outdoor">Outdoor Deck</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                                <Maximize size={16} className="text-[#1C1C1C]/40" /> Room Size
                                            </label>
                                            <input
                                                type="text"
                                                name="roomSize"
                                                value={formData.roomSize}
                                                onChange={handleChange}
                                                placeholder="e.g., 5.5m x 4.2m"
                                                className="w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                            <Calendar size={16} className="text-[#1C1C1C]/40" /> Preferred Visit Date
                                        </label>
                                        <input
                                            type="date"
                                            name="visitDate"
                                            value={formData.visitDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all text-[#1C1C1C]/80"
                                        />
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h3 className="text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-5">Additional Information</h3>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                            <MessageSquare size={16} className="text-[#1C1C1C]/40" /> Additional Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Tell us about your style preferences, budget range, any specific furniture you're interested in, or anything else that would help us prepare for your consultation..."
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EBE1] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#663F23] transition-all resize-y"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-xs text-[#1C1C1C]/50 flex-1">
                                        By submitting, you agree to our terms of service and privacy policy.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-8 py-3.5 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <><Send size={18} /> Submit Request</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* Bottom Features */}
            <section className="px-4 sm:px-8 md:px-16 pb-12 sm:pb-20">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E5E5E5]">
                        <div className="w-12 h-12 bg-[#F5EBE1] rounded-xl flex items-center justify-center text-[#663F23] mb-6">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">Personalized Plan</h3>
                        <p className="text-[#1C1C1C]/60 text-sm leading-relaxed">
                            Get a custom furniture layout designed specifically for your space and style.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E5E5E5]">
                        <div className="w-12 h-12 bg-[#F5EBE1] rounded-xl flex items-center justify-center text-[#663F23] mb-6">
                            <Box size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">3D Preview</h3>
                        <p className="text-[#1C1C1C]/60 text-sm leading-relaxed">
                            Visualize your room in 3D before making any purchase decisions.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E5E5E5]">
                        <div className="w-12 h-12 bg-[#F5EBE1] rounded-xl flex items-center justify-center text-[#663F23] mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">Expert Guidance</h3>
                        <p className="text-[#1C1C1C]/60 text-sm leading-relaxed">
                            Work with experienced interior designers who understand your vision.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
