"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate an API call and login delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the dashboard after successful "login"
      router.push('/dashboard');
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
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#f8f6f0] border border-neutral-200 overflow-hidden">
              <Image
                src="/logo.png"
                alt="LIVORA Logo"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Please log in before accessing the dashboard.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email
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
                    defaultValue="admin@livora.com"
                    className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 text-neutral-900 placeholder-neutral-400 focus:border-[#7c5b46] focus:ring-[#7c5b46] sm:text-sm"
                    placeholder="admin@livora.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    defaultValue="admin12345"
                    className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 text-neutral-900 placeholder-neutral-400 focus:border-[#7c5b46] focus:ring-[#7c5b46] sm:text-sm"
                    placeholder="••••••••••"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Passwords are encrypted and never shared.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-neutral-300 text-[#7c5b46] focus:ring-[#7c5b46]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#c49a6c] hover:text-[#a88257]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-md bg-[#6b4731] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#5a3a27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b4731] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
