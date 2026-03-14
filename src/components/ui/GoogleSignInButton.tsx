"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

interface GoogleSignInButtonProps {
    role: "admin" | "user";
    onSuccess: (data: {
        _id: string;
        name: string;
        email: string;
        role: string;
        token: string;
        avatarUrl?: string;
    }) => void;
    onError: (message: string) => void;
    text?: "signin_with" | "signup_with" | "continue_with";
}

const GOOGLE_LABELS: Record<string, string> = {
    signin_with: "Sign in with Google",
    signup_with: "Sign up with Google",
    continue_with: "Continue with Google",
};

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
    );
}

export default function GoogleSignInButton({ role, onSuccess, onError, text = "signin_with" }: GoogleSignInButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [gsiReady, setGsiReady] = useState(false);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleCredentialResponse = useCallback(async (response: any) => {
        if (!response.credential) {
            onError("Google sign-in was cancelled.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post("/api/auth/google", {
                credential: response.credential,
                role,
            });
            onSuccess(res.data);
        } catch (err: any) {
            const message = err?.response?.data?.message || "Google authentication failed. Please try again.";
            onError(message);
        } finally {
            setIsLoading(false);
        }
    }, [role, onSuccess, onError]);

    useEffect(() => {
        if (!clientId) return;

        if (window.google?.accounts?.id) {
            setScriptLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => setScriptLoaded(true));
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setScriptLoaded(true);
        document.head.appendChild(script);
    }, [clientId]);

    useEffect(() => {
        if (!scriptLoaded || !clientId || !window.google || !buttonRef.current) return;

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            width: buttonRef.current.offsetWidth || 320,
            text,
            shape: "rectangular",
            logo_alignment: "left",
        });

        setGsiReady(true);
    }, [scriptLoaded, clientId, handleCredentialResponse, text]);

    // Fallback button (shown when no client ID or GSI hasn't rendered yet)
    const fallbackButton = (
        <button
            type="button"
            onClick={() => {
                if (!clientId) {
                    onError("Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment.");
                }
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-[#dadce0] bg-white text-sm font-medium text-[#3c4043] hover:bg-[#f7f8f8] transition-colors cursor-pointer"
        >
            <GoogleIcon />
            {GOOGLE_LABELS[text] || "Sign in with Google"}
        </button>
    );

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-[#dadce0] bg-white text-sm text-[#3c4043]">
                <Loader2 size={16} className="animate-spin" />
                Signing in with Google...
            </div>
        );
    }

    // No client ID - show fallback that tells user to configure
    if (!clientId) {
        return fallbackButton;
    }

    return (
        <div className="w-full">
            {/* Google's rendered button (hidden until GSI loads) */}
            <div ref={buttonRef} className={`w-full flex justify-center [&>div]:!w-full ${gsiReady ? "" : "hidden"}`} />
            {/* Fallback while GSI script loads */}
            {!gsiReady && fallbackButton}
        </div>
    );
}
