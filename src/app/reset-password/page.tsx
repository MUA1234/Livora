"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);

        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-neutral-900">
            {/* Left Side - Image & Quote (Matching theme) */}
            <div className="relative hidden w-1/2 bg-neutral-900 lg:block">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Interior Design"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-16 left-16 z-20 max-w-lg text-white">
                    <h2 className="text-3xl font-medium leading-snug">
                        "Design is a formal response to a strategic question."
                    </h2>
                    <p className="mt-4 text-sm text-neutral-300 italic">
                        — Mariona Lopez
                    </p>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f8f6f0] border border-neutral-100 shadow-sm">
                            <span className="text-sm font-serif tracking-widest text-[#5c4033] font-bold">LIVORA</span>
                        </div>

                        {!isSuccess ? (
                            <>
                                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-tight">
                                    Set new password
                                </h1>
                                <p className="mt-3 text-sm text-neutral-500 max-w-sm leading-relaxed">
                                    Your new password must be different from previously used passwords.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2 text-green-600 mb-2">
                                    <CheckCircle2 className="h-6 w-6" />
                                    <span className="font-medium text-lg">Password reset</span>
                                </div>
                                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                                    All set!
                                </h1>
                                <p className="mt-4 text-sm text-neutral-500 max-w-sm leading-relaxed">
                                    Your password has been successfully reset. Redirecting you to the login page...
                                </p>
                            </>
                        )}
                    </div>

                    {!isSuccess ? (
                        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                        New Password
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-10 text-neutral-900 placeholder-neutral-400 focus:border-[#7c5b46] focus:ring-[#7c5b46] sm:text-sm shadow-sm transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full rounded-lg border border-neutral-200 py-3 pl-10 text-neutral-900 placeholder-neutral-400 focus:border-[#7c5b46] focus:ring-[#7c5b46] sm:text-sm shadow-sm transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center items-center rounded-lg bg-[#6b4731] px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#5a3a27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b4731] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset password'
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-sm text-neutral-500 pt-2">
                                Already know your password?{' '}
                                <Link href="/" className="font-semibold text-[#c49a6c] hover:text-[#a88257] transition-colors underline underline-offset-4">
                                    Back to login
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <div className="mt-10">
                            <Link
                                href="/"
                                className="flex w-full justify-center items-center rounded-lg bg-[#6b4731] px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#5a3a27] transition-all"
                            >
                                Go to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
