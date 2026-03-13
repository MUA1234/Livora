"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/api/users/forgot-password", { email });
            setIsSubmitted(true);
        } catch {
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-neutral-900">
            {/* Left Side - Image & Quote (Matching the login page style) */}
            <div className="relative hidden w-1/2 bg-neutral-900 lg:block">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Interior Design"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-16 left-16 z-20 max-w-lg text-white">
                    <h2 className="text-3xl font-medium leading-snug">
                        "Your home should tell the story of who you are, and be a collection of what you love."
                    </h2>
                    <p className="mt-4 text-sm text-neutral-300 italic">
                        — Nate Berkus
                    </p>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <Link href="/" className="group mb-8 flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to login
                        </Link>

                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f8f6f0] border border-neutral-100 shadow-sm overflow-hidden">
                            <Image
                                src="/logo.png"
                                alt="LIVORA Logo"
                                width={96}
                                height={96}
                                className="object-cover"
                            />
                        </div>

                        {!isSubmitted ? (
                            <>
                                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                                    Forgot password?
                                </h1>
                                <p className="mt-3 text-sm text-neutral-500 max-w-sm leading-relaxed">
                                    No worries, we'll send you reset instructions. Enter the email address associated with your account.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2 text-green-600 mb-2">
                                    <CheckCircle2 className="h-6 w-6" />
                                    <span className="font-medium text-lg">Email sent</span>
                                </div>
                                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-tight">
                                    Check your inbox
                                </h1>
                                <p className="mt-4 text-sm text-neutral-500 max-w-sm leading-relaxed">
                                    We've sent a password reset link to <span className="font-semibold text-neutral-900">{email}</span>. Please check your email and follow the instructions.
                                </p>
                            </>
                        )}
                    </div>

                    {!isSubmitted ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                        Email address
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Mail className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-neutral-200 py-3 pl-10 text-neutral-900 placeholder-neutral-400 focus:border-[#7c5b46] focus:ring-[#7c5b46] sm:text-sm shadow-sm transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center items-center rounded-lg bg-[#6b4731] px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#5a3a27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b4731] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending link...
                                        </>
                                    ) : (
                                        'Reset password'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-10 space-y-6">
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="flex w-full justify-center items-center rounded-lg border border-neutral-200 bg-white px-4 py-3.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-all active:scale-[0.98]"
                            >
                                Try another email
                            </button>

                            <p className="text-center text-sm text-neutral-500">
                                Didn't receive the email?{' '}
                                <button
                                    onClick={handleSubmit}
                                    className="font-semibold text-[#c49a6c] hover:text-[#a88257] transition-colors underline underline-offset-4"
                                >
                                    Click to resend
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
