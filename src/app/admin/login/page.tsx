"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate an API call and login delay
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to an admin page after successful "login"
            router.push('/admin/consultations');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Image & Quote */}
            <div className="relative hidden w-1/2 bg-neutral-900 lg:block">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Interior Design"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-16 left-16 z-20 max-w-lg text-white">
                    <h2 className="text-3xl font-medium leading-snug">
                        "Design is not just what it looks like and feels like. Design is how it works."
                    </h2>
                    <p className="mt-4 text-sm text-neutral-300">
                        Elevating interior spaces for every Livora project.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
                <div className="w-full max-w-sm xl:max-w-md space-y-6">
                    {/* Logo Section */}
                    <div className="flex justify-center mb-8">
                        {/* Approximating the logo image with a styled container */}
                        <div className="flex h-40 w-40 flex-col items-center justify-center bg-[#f7f5ed]">
                            <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-[#4a4a4a]">
                                {/* Minimal visual representation of the chair/flower */}
                                <div className="mb-1 h-10 w-10 border border-[#4a4a4a] rounded-b-xl rounded-t-sm border-b-2" />
                                <span className="font-serif text-[18px] tracking-[0.15em] text-[#333333]">LIVORA</span>
                                <span className="text-[7px] font-sans tracking-[0.3em] text-[#555555]">FURNITURE</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col text-left">
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                            Admin login
                        </h1>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-[13px] font-medium text-neutral-800">
                                    Email
                                </label>
                                <div className="relative mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        defaultValue="admin@livora.com"
                                        className="block w-full rounded border border-neutral-200 py-2.5 pl-10 text-neutral-800 focus:border-[#674630] focus:ring-[#674630] sm:text-sm shadow-sm"
                                        placeholder="admin@livora.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-[13px] font-medium text-neutral-800">
                                    Password
                                </label>
                                <div className="relative mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        defaultValue="admin12345"
                                        className="block w-full rounded border border-neutral-200 py-2.5 pl-10 text-neutral-800 focus:border-[#674630] focus:ring-[#674630] sm:text-sm shadow-sm"
                                        placeholder="••••••••••"
                                    />
                                </div>
                                <p className="mt-2 text-[12px] text-neutral-400">
                                    Passwords are encrypted and never shared.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 rounded border-neutral-300 text-[#674630] focus:ring-[#674630]"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-[13px] font-medium text-neutral-700">
                                    Remember this device
                                </label>
                            </div>

                            <div className="text-[13px]">
                                <Link href="/forgot-password" className="font-medium text-[#c49a6c] hover:text-[#a88257]">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center items-center rounded bg-[#674630] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#533826] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
