'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for transition to finish
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-[#22c55e]',
        error: 'bg-[#ef4444]',
        info: 'bg-[#3b82f6]',
    }[type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center p-4 min-w-[300px] text-[#F5F1E8] rounded-lg shadow-lg transition-all duration-300 ease-in-out font-['Poppins',_sans-serif] ${bgColor} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
            role="alert"
        >
            <div className="text-sm font-medium mr-3 flex-grow">{message}</div>
            <button
                type="button"
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-auto flex-shrink-0 bg-transparent text-[#F5F1E8]/80 hover:text-[#F5F1E8] rounded-md p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-black/10 transition-colors"
                aria-label="Close"
            >
                <svg
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
