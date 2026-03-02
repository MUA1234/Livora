"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    Eye,
    EyeOff,
    Camera,
    Clock
} from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    // Profile state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Accessibility state
    const [increaseFontSize, setIncreaseFontSize] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(0);

    // Notification state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [consultationAlerts, setConsultationAlerts] = useState(true);
    const [designUpdates, setDesignUpdates] = useState(false);
    const [systemAlerts, setSystemAlerts] = useState(true);

    const themeColors = [
        { bg: "#663F23", border: "#663F23" },
        { bg: "#F5F1E8", border: "#E5E5E5" },
        { bg: "#C6A75E", border: "#C6A75E" },
        { bg: "#D1D5DB", border: "#D1D5DB" },
    ];

    const handleUpdateProfile = () => {
        alert("Profile updated!");
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert("Password changed!");
    };

    const handleSavePreferences = () => {
        alert("Preferences saved!");
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                                <span className="text-[#663F23] text-xs font-bold">LV</span>
                            </div>
                            <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1 mt-4">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutDashboard size={20} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>

                        <Link href="/admin/room-setup" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Monitor size={20} />
                            <span className="font-medium text-sm">Room Setup</span>
                        </Link>

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Sofa size={20} />
                            <span className="font-medium text-sm">Catalogue</span>
                        </Link>

                        <Link href="/admin/compare-designs" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutTemplate size={20} />
                            <span className="font-medium text-sm">Compare Designs</span>
                        </Link>

                        <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <FileText size={20} />
                            <span className="font-medium text-sm">Cost Summary</span>
                        </Link>

                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-[#E5E5E5]/50">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors mb-2">
                        <Settings size={20} />
                        <span className="font-medium text-sm">Settings</span>
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#E5E5E5]/50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C]">Sara Samarasinghe</span>
                            <span className="text-[10px] text-[#1C1C1C]/50">Lead Designer</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] p-8 md:p-12">
                <div className="max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#663F23] mb-1">Profile & Settings</h1>
                        <p className="text-sm text-[#663F23]/60">Manage your account and preferences</p>
                    </div>

                    {/* Update Profile Section */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-8 mb-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Update Profile</h2>

                        <div className="flex gap-8">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-24 h-24 rounded-full bg-[#F5F1E8] border-2 border-[#E5E5E5] flex items-center justify-center relative overflow-hidden cursor-pointer group">
                                    <Camera size={24} className="text-[#1C1C1C]/30 group-hover:text-[#663F23] transition-colors" />
                                </div>
                                <span className="text-xs text-[#663F23] font-medium cursor-pointer hover:underline">Click to change</span>
                            </div>

                            {/* Form Fields */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Phone no</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateProfile}
                                    className="px-6 py-2.5 bg-[#663F23] text-white text-sm font-medium rounded-lg hover:bg-[#4A2D19] transition-colors mt-2"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-8 mb-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Change Password</h2>

                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors pr-12"
                                    />
                                    <button
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C] transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors pr-12"
                                    />
                                    <button
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C] transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E5E5E5]/50 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#663F23] transition-colors pr-12"
                                    />
                                    <button
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleChangePassword}
                                className="px-6 py-2.5 bg-[#663F23] text-white text-sm font-medium rounded-lg hover:bg-[#4A2D19] transition-colors mt-2"
                            >
                                Change password
                            </button>
                        </div>
                    </div>

                    {/* Accessibility Options Section */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-8 mb-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Accessibility Options</h2>

                        <div className="space-y-5 max-w-md">
                            {/* Increase Font Size */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#663F23]">Increase Font Size</span>
                                <button
                                    onClick={() => setIncreaseFontSize(!increaseFontSize)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${increaseFontSize ? 'bg-[#663F23]' : 'bg-[#E5E5E5]'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${increaseFontSize ? 'left-6' : 'left-0.5'}`}></div>
                                </button>
                            </div>

                            {/* High Contrast Mode */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#1C1C1C]">High Contrast Mode</span>
                                <button
                                    onClick={() => setHighContrast(!highContrast)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-[#663F23]' : 'bg-[#E5E5E5]'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${highContrast ? 'left-6' : 'left-0.5'}`}></div>
                                </button>
                            </div>

                            {/* Dark Mode */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#1C1C1C]">Dark Mode</span>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-[#663F23]' : 'bg-[#E5E5E5]'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${darkMode ? 'left-6' : 'left-0.5'}`}></div>
                                </button>
                            </div>

                            {/* Theme Preview */}
                            <div className="border border-[#E5E5E5]/50 rounded-xl p-4 mt-4">
                                <p className="text-sm text-[#1C1C1C]/50 italic mb-3">Theme Preview</p>
                                <div className="flex gap-4">
                                    {themeColors.map((theme, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedTheme(i)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedTheme === i ? 'border-[#663F23] scale-110' : 'border-[#E5E5E5]'}`}
                                            style={{ backgroundColor: theme.bg }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences Section */}
                    <div className="bg-white rounded-2xl border border-[#E5E5E5]/50 p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Notification Preferences</h2>

                        <div className="space-y-4 max-w-md">
                            {/* Email Notifications */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[#663F23]"
                                />
                                <span className="text-sm font-medium text-[#663F23]">Email Notifications</span>
                            </label>

                            {/* Consultation Request Alerts */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consultationAlerts}
                                    onChange={(e) => setConsultationAlerts(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[#663F23]"
                                />
                                <span className="text-sm font-medium text-[#663F23]">Consultation Request Alerts</span>
                            </label>

                            {/* Design Updates */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={designUpdates}
                                    onChange={(e) => setDesignUpdates(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[#663F23]"
                                />
                                <span className="text-sm font-medium text-[#1C1C1C]/50">Design Updates</span>
                            </label>

                            {/* System Maintenance Alerts */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={systemAlerts}
                                    onChange={(e) => setSystemAlerts(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[#663F23]"
                                />
                                <span className="text-sm font-medium text-[#663F23]">System Maintenance Alerts</span>
                            </label>

                            <button
                                onClick={handleSavePreferences}
                                className="px-6 py-2.5 bg-[#F5F1E8] text-[#663F23] text-sm font-medium rounded-lg border border-[#E5E5E5] hover:bg-[#E5E5E5]/50 transition-colors mt-4"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}