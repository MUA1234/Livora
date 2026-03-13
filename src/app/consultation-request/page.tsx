"use client";

import { useState } from "react";
import PhoneInput from "@/components/ui/PhoneInput";
import api from "@/lib/api";
import { Toast } from "@/components/ui/Toast";
import {
  User,
  Mail,
  Phone,
  Ruler,
  Calendar,
  FileText,
  Send,
  CheckCircle2,
  ArrowLeft,
  Sofa,
  Sparkles,
  Clock,
  Shield,
  MessageSquare,
} from "lucide-react";

export default function ConsultationRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomSize: "",
    roomType: "living-room",
    preferredDate: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/consultation-requests", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        roomType: formData.roomType,
        roomSize: formData.roomSize,
        preferredDate: formData.preferredDate || undefined,
        notes: formData.notes || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || "Failed to submit request", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomTypes = [
    { value: "living-room", label: "Living Room" },
    { value: "bedroom", label: "Bedroom" },
    { value: "dining-room", label: "Dining Room" },
    { value: "home-office", label: "Home Office" },
    { value: "kids-room", label: "Kids Room" },
    { value: "other", label: "Other" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center">
          {/* Success Animation Container */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto flex items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute top-0 left-1/2 -translate-x-16 -translate-y-2 w-2 h-2 bg-gold rounded-full" />
            <div className="absolute top-4 right-1/2 translate-x-20 w-1.5 h-1.5 bg-brown/30 rounded-full" />
            <div className="absolute bottom-2 left-1/2 -translate-x-24 w-1 h-1 bg-gold-light rounded-full" />
          </div>

          <h1 className="text-3xl font-semibold text-charcoal mb-3">Request Submitted!</h1>
          <p className="text-charcoal/50 text-base mb-2 leading-relaxed">
            Thank you, <span className="font-medium text-charcoal">{formData.fullName || "valued customer"}</span>.
          </p>
          <p className="text-charcoal/40 text-sm mb-8 leading-relaxed max-w-md mx-auto">
            Your design consultation request has been received. Our team will review your request and get back to you within 24-48 hours.
          </p>

          {/* Request Summary */}
          <div className="bg-white rounded-2xl p-6 border border-silver/40 text-left mb-8">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-4">Request Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-silver/20">
                <span className="text-sm text-charcoal/40">Room Type</span>
                <span className="text-sm font-medium text-charcoal capitalize">{formData.roomType.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-silver/20">
                <span className="text-sm text-charcoal/40">Room Size</span>
                <span className="text-sm font-medium text-charcoal">{formData.roomSize || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-silver/20">
                <span className="text-sm text-charcoal/40">Preferred Date</span>
                <span className="text-sm font-medium text-charcoal">
                  {formData.preferredDate
                    ? new Date(formData.preferredDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-charcoal/40">Contact Email</span>
                <span className="text-sm font-medium text-charcoal">{formData.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brown text-cream rounded-xl text-sm font-medium hover:bg-brown-dark transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-brown overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(198,167,94,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(198,167,94,0.1),transparent_40%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/20 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-medium text-gold">Free Design Consultation</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-cream leading-tight mb-4">
                Book Your Design
                <br />
                <span className="text-gold">Consultation</span>
              </h1>
              <p className="text-cream/50 text-base leading-relaxed max-w-md">
                Let our expert designers help you create the perfect space. Share your room details and we&apos;ll craft a personalized furniture plan just for you.
              </p>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[11px] text-cream/70 font-medium">Response within</p>
                    <p className="text-xs text-cream/40">24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[11px] text-cream/70 font-medium">No obligation</p>
                    <p className="text-xs text-cream/40">100% free</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Sofa className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[11px] text-cream/70 font-medium">Expert designers</p>
                    <p className="text-xs text-cream/40">10+ years exp.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Card */}
            <div className="hidden md:block w-64">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-gold/20 to-brown-dark/20 flex items-center justify-center mb-4">
                  <Sofa className="w-16 h-16 text-gold/50" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded-full w-3/4" />
                  <div className="h-2 bg-white/10 rounded-full w-1/2" />
                  <div className="h-2 bg-white/10 rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-3xl border border-silver/40 shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="px-8 pt-8 pb-6 border-b border-silver/30">
            <h2 className="text-xl font-semibold text-charcoal">Your Details</h2>
            <p className="text-sm text-charcoal/40 mt-1">Fill in the form below and our team will reach out to schedule your consultation.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <User className="w-4 h-4 text-charcoal/30" />
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <Mail className="w-4 h-4 text-charcoal/30" />
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <Phone className="w-4 h-4 text-charcoal/30" />
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(val) => handleChange("phone", val)}
                    required
                    placeholder="Phone number"
                    style={{ background: "rgba(250,248,244,0.5)", border: "1px solid rgba(200,200,200,0.4)", borderRadius: "12px" }}
                    id="consultation-phone"
                  />
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-5">Room Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Room Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <Sofa className="w-4 h-4 text-charcoal/30" />
                    Room Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.roomType}
                      onChange={(e) => handleChange("roomType", e.target.value)}
                      className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {roomTypes.map((room) => (
                        <option key={room.value} value={room.value}>
                          {room.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Room Size */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <Ruler className="w-4 h-4 text-charcoal/30" />
                    Room Size
                  </label>
                  <input
                    type="text"
                    value={formData.roomSize}
                    onChange={(e) => handleChange("roomSize", e.target.value)}
                    placeholder="e.g., 5.5m x 4.2m"
                    className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all"
                  />
                </div>

                {/* Preferred Date */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                    <Calendar className="w-4 h-4 text-charcoal/30" />
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleChange("preferredDate", e.target.value)}
                    className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-5">Additional Information</h3>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal/70 mb-2">
                  <FileText className="w-4 h-4 text-charcoal/30" />
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Tell us about your style preferences, budget range, any specific furniture you're interested in, or anything else that would help us prepare for your consultation..."
                  rows={5}
                  className="w-full px-4 py-3.5 bg-cream/50 rounded-xl border border-silver/40 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-silver/30">
              <p className="text-xs text-charcoal/30">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 bg-brown text-cream rounded-xl text-sm font-medium hover:bg-brown-dark transition-colors shadow-sm hover:shadow-md disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-silver/30">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-gold-dark" />
            </div>
            <h4 className="text-sm font-medium text-charcoal mb-1">Personalized Plan</h4>
            <p className="text-xs text-charcoal/40 leading-relaxed">Get a custom furniture layout designed specifically for your space and style.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-silver/30">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
              <Sofa className="w-5 h-5 text-gold-dark" />
            </div>
            <h4 className="text-sm font-medium text-charcoal mb-1">3D Preview</h4>
            <p className="text-xs text-charcoal/40 leading-relaxed">Visualize your room in 3D before making any purchase decisions.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-silver/30">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-gold-dark" />
            </div>
            <h4 className="text-sm font-medium text-charcoal mb-1">Expert Guidance</h4>
            <p className="text-xs text-charcoal/40 leading-relaxed">Work with experienced interior designers who understand your vision.</p>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
