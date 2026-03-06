"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, User, Phone, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Toast } from '@/components/ui/Toast';

function PasswordStrength({ password }: { password: string }) {
    const getStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };
    const strength = getStrength();
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
    if (!password) return null;
    return (
        <div className="mt-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? colors[strength] : '#eee' }} />
                ))}
            </div>
            <p className="text-[11px] mt-1 font-medium" style={{ color: colors[strength] }}>
                {labels[strength]} password
            </p>
        </div>
    );
}

export default function UserRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.password) {
            setToast({ message: 'Please fill in all fields', type: 'error' }); return;
        }
        if (form.password !== form.confirmPassword) {
            setToast({ message: 'Passwords do not match', type: 'error' }); return;
        }
        if (form.password.length < 6) {
            setToast({ message: 'Password must be at least 6 characters', type: 'error' }); return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/register', {
                name: form.name, email: form.email, phone: form.phone, password: form.password,
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `livora-token=${token}; path=/; max-age=604800`;
            setToast({ message: 'Account created! Welcome to Livora 🎉', type: 'success' });
            setTimeout(() => router.push('/user-panel/furniture-catalogue'), 800);
        } catch (err: any) {
            setToast({ message: err?.response?.data?.error || 'Registration failed.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const fieldStyle = (name: string) => ({
        background: focusedField === name ? 'rgba(102,63,35,0.04)' : '#F8F6F2',
        border: focusedField === name ? '2px solid #663F23' : '2px solid transparent',
        color: '#1C1C1C',
    });

    const features = ['200+ premium furniture pieces', 'Save to wishlist', 'Book consultations', 'Track your orders'];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
            style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #EDE8DC 40%, #E8DDD0 100%)' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, #C6A75E, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
                style={{ background: 'radial-gradient(circle, #663F23, transparent)', transform: 'translate(-30%, 30%)' }} />

            {/* Main card */}
            <div className="relative w-full max-w-4xl mx-4 flex rounded-3xl overflow-hidden"
                style={{ boxShadow: '0 40px 80px rgba(102,63,35,0.2), 0 20px 40px rgba(102,63,35,0.12), 0 0 0 1px rgba(198,167,94,0.15)' }}>

                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-10 overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #663F23 0%, #4A2D19 60%, #3A2010 100%)' }}>

                    <div className="absolute top-0 left-0 w-full h-full opacity-5"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #C6A75E 1px, transparent 1px), radial-gradient(circle at 80% 80%, #C6A75E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-0.5" style={{ background: '#C6A75E' }} />
                            <span className="text-xs uppercase tracking-widest" style={{ color: '#C6A75E' }}>Join Livora</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Start designing your dream home
                        </h2>
                    </div>

                    {/* Feature list */}
                    <div className="relative z-10 space-y-4 my-8">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(198,167,94,0.2)', border: '1px solid rgba(198,167,94,0.4)' }}>
                                    <Check size={12} style={{ color: '#C6A75E' }} />
                                </div>
                                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Floating image */}
                    <div className="relative z-10 rounded-2xl overflow-hidden h-40"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400"
                            alt="Interior"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-end p-4"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                            <p className="text-white text-xs font-medium">Premium interior solutions</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center p-8 lg:p-12"
                    style={{ background: 'rgba(255,255,255,0.95)' }}>


                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <img
                            src="/logo.png"
                            alt="Livora Logo"
                            className="w-10 h-10 rounded-xl object-cover"
                        />
                        <span className="text-xl font-bold" style={{ color: '#663F23' }}>
                            Livora
                        </span>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C1C1C' }}>Create your account</h1>
                        <p className="text-sm" style={{ color: '#888' }}>Join thousands designing their perfect space</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Name + Phone row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                    style={{ color: '#663F23' }}>Full Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focusedField === 'name' ? '#663F23' : '#aaa' }} />
                                    <input type="text" required value={form.name}
                                        onChange={e => update('name', e.target.value)}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="John Perera"
                                        className="w-full pl-9 pr-3 py-3 rounded-xl text-sm outline-none transition-all"
                                        style={fieldStyle('name')} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                    style={{ color: '#663F23' }}>Phone</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focusedField === 'phone' ? '#663F23' : '#aaa' }} />
                                    <input type="tel" required value={form.phone}
                                        onChange={e => update('phone', e.target.value)}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="+94 77 000 0000"
                                        className="w-full pl-9 pr-3 py-3 rounded-xl text-sm outline-none transition-all"
                                        style={fieldStyle('phone')} />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: '#663F23' }}>Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focusedField === 'email' ? '#663F23' : '#aaa' }} />
                                <input type="email" required value={form.email}
                                    onChange={e => update('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={fieldStyle('email')} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: '#663F23' }}>Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focusedField === 'password' ? '#663F23' : '#aaa' }} />
                                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                                    onChange={e => update('password', e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Min. 6 characters"
                                    className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={fieldStyle('password')} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }}>
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            <PasswordStrength password={form.password} />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: '#663F23' }}>Confirm Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : focusedField === 'confirm' ? '#663F23' : '#aaa' }} />
                                <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                                    onChange={e => update('confirmPassword', e.target.value)}
                                    onFocus={() => setFocusedField('confirm')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Repeat password"
                                    className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={form.confirmPassword && form.password !== form.confirmPassword
                                        ? { background: '#fff5f5', border: '2px solid #ef4444', color: '#1C1C1C' }
                                        : fieldStyle('confirm')} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }}>
                                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <p className="text-[11px] mt-1 text-red-400 font-medium">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 group mt-2"
                            style={{
                                background: isLoading ? '#aaa' : 'linear-gradient(135deg, #663F23 0%, #4A2D19 100%)',
                                color: 'white',
                                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(102,63,35,0.35)',
                            }}
                            onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                            {isLoading
                                ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                                : <>Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                            }
                        </button>

                        <p className="text-center text-sm pt-1" style={{ color: '#888' }}>
                            Already have an account?{' '}
                            <Link href="/user-panel/login" className="font-bold hover:underline" style={{ color: '#663F23' }}>
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}