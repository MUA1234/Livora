"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Toast } from '@/components/ui/Toast';

export default function UserLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `livora-token=${token}; path=/; max-age=604800`;
            setToast({ message: 'Welcome back!', type: 'success' });
            setTimeout(() => router.push('/user-panel/furniture-catalogue'), 500);
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Invalid email or password';
            setToast({ message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #EDE8DC 40%, #E8DDD0 100%)' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, #C6A75E, transparent)', transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
                style={{ background: 'radial-gradient(circle, #663F23, transparent)', transform: 'translate(30%, 30%)' }} />
            <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 blur-2xl"
                style={{ background: 'radial-gradient(circle, #C6A75E, transparent)' }} />

            {/* Main card - 3D floating effect */}
            <div className="relative w-full max-w-4xl mx-4 flex rounded-3xl overflow-hidden"
                style={{
                    boxShadow: '0 40px 80px rgba(102,63,35,0.2), 0 20px 40px rgba(102,63,35,0.12), 0 0 0 1px rgba(198,167,94,0.15)',
                    transform: 'perspective(1000px) rotateX(0deg)',
                }}>

                {/* Left Panel - Visual */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #663F23 0%, #4A2D19 60%, #3A2010 100%)' }}>

                    {/* Geometric decorative shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #C6A75E, transparent)', transform: 'translate(30%, -30%)' }} />
                    <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #C6A75E, transparent)', transform: 'translate(-30%, 0)' }} />

                    {/* Floating product mockup cards */}
                    <div className="relative mt-8 flex-1 flex items-center justify-center">
                        {/* Back card */}
                        <div className="absolute w-48 h-60 rounded-2xl overflow-hidden opacity-60"
                            style={{
                                transform: 'rotate(-8deg) translate(-20px, 10px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                background: '#5a3820'
                            }}>
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300"
                                alt="Sofa"
                                className="w-full h-full object-cover opacity-80"
                            />
                        </div>
                        {/* Middle card */}
                        <div className="absolute w-48 h-60 rounded-2xl overflow-hidden opacity-80"
                            style={{
                                transform: 'rotate(3deg) translate(15px, -5px)',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                                background: '#4a2d19'
                            }}>
                            <img
                                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
                                alt="Chair"
                                className="w-full h-full object-cover opacity-80"
                            />
                        </div>
                        {/* Front card */}
                        <div className="relative w-52 h-64 rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,167,94,0.3)',
                                transform: 'rotate(-2deg)',
                            }}>
                            <img
                                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=300"
                                alt="Lounge Chair"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                                <p className="text-white text-xs font-semibold">Milo Lounge Chair</p>
                                <p className="text-yellow-300 text-xs">Rs. 180,000</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom text */}
                    <div className="relative z-10 mt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-0.5" style={{ background: '#C6A75E' }} />
                            <span className="text-xs uppercase tracking-widest" style={{ color: '#C6A75E' }}>Livora Furniture</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                            Design your perfect living space
                        </h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Explore 200+ premium furniture pieces curated for modern homes.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12"
                    style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>

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

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1C1C' }}>
                            Welcome back
                        </h1>
                        <p className="text-sm" style={{ color: '#888' }}>
                            Sign in to explore our furniture collection
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: '#663F23' }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail size={16} style={{ color: focusedField === 'email' ? '#663F23' : '#aaa' }} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: focusedField === 'email' ? 'rgba(102,63,35,0.04)' : '#F8F6F2',
                                        border: focusedField === 'email' ? '2px solid #663F23' : '2px solid transparent',
                                        color: '#1C1C1C',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: '#663F23' }}>
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock size={16} style={{ color: focusedField === 'password' ? '#663F23' : '#aaa' }} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••••"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: focusedField === 'password' ? 'rgba(102,63,35,0.04)' : '#F8F6F2',
                                        border: focusedField === 'password' ? '2px solid #663F23' : '2px solid transparent',
                                        color: '#1C1C1C',
                                    }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                    style={{ color: '#aaa' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-4 h-4 rounded border-2 peer-checked:border-0 transition-all"
                                        style={{ background: '#663F23', borderColor: '#663F23' }}>
                                        <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-xs" style={{ color: '#666' }}>Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-xs font-semibold hover:underline"
                                style={{ color: '#C6A75E' }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200 group"
                            style={{
                                background: isLoading ? '#aaa' : 'linear-gradient(135deg, #663F23 0%, #4A2D19 100%)',
                                color: 'white',
                                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(102,63,35,0.35)',
                                transform: isLoading ? 'none' : 'translateY(0)',
                            }}
                            onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                        >
                            {isLoading ? (
                                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ background: '#eee' }} />
                            <span className="text-xs" style={{ color: '#bbb' }}>or</span>
                            <div className="flex-1 h-px" style={{ background: '#eee' }} />
                        </div>

                        {/* Register link */}
                        <p className="text-center text-sm" style={{ color: '#888' }}>
                            Don&apos;t have an account?{' '}
                            <Link href="/user-panel/register"
                                className="font-bold hover:underline"
                                style={{ color: '#663F23' }}>
                                Create one free
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}