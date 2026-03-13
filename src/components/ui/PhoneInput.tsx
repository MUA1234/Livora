"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Country {
    name: string;
    code: string;
    dial: string;
    flag: string;
}

const countries: Country[] = [
    { name: "Sri Lanka", code: "LK", dial: "+94", flag: "🇱🇰" },
    { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
    { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "UK", dial: "+44", flag: "🇬🇧" },
    { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
    { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
    { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
    { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
    { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
    { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
    { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
    { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
    { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
    { name: "Malaysia", code: "MY", dial: "+60", flag: "🇲🇾" },
    { name: "Pakistan", code: "PK", dial: "+92", flag: "🇵🇰" },
    { name: "Bangladesh", code: "BD", dial: "+880", flag: "🇧🇩" },
    { name: "Nepal", code: "NP", dial: "+977", flag: "🇳🇵" },
    { name: "Maldives", code: "MV", dial: "+960", flag: "🇲🇻" },
    { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
    { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
    { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
    { name: "New Zealand", code: "NZ", dial: "+64", flag: "🇳🇿" },
    { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
    { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
    { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
    { name: "Russia", code: "RU", dial: "+7", flag: "🇷🇺" },
    { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
    { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
    { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
    { name: "Thailand", code: "TH", dial: "+66", flag: "🇹🇭" },
    { name: "Indonesia", code: "ID", dial: "+62", flag: "🇮🇩" },
    { name: "Philippines", code: "PH", dial: "+63", flag: "🇵🇭" },
    { name: "Vietnam", code: "VN", dial: "+84", flag: "🇻🇳" },
    { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
    { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
    { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
    { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷" },
    { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
    { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹" },
];

interface PhoneInputProps {
    value: string;
    onChange: (fullNumber: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

function parsePhoneValue(value: string): { dial: string; local: string } {
    if (!value) return { dial: "+94", local: "" };

    const trimmed = value.trim();
    if (!trimmed.startsWith("+")) return { dial: "+94", local: trimmed };

    const sortedCountries = [...countries].sort(
        (a, b) => b.dial.length - a.dial.length
    );
    for (const c of sortedCountries) {
        if (trimmed.startsWith(c.dial)) {
            return { dial: c.dial, local: trimmed.slice(c.dial.length).trim() };
        }
    }

    const match = trimmed.match(/^\+\d{1,4}/);
    if (match) {
        return { dial: match[0], local: trimmed.slice(match[0].length).trim() };
    }

    return { dial: "+94", local: trimmed };
}

export default function PhoneInput({
    value,
    onChange,
    onFocus,
    onBlur,
    required,
    placeholder = "Phone number",
    className = "",
    style = {},
    id,
}: PhoneInputProps) {
    const parsed = parsePhoneValue(value);
    const [selectedDial, setSelectedDial] = useState(parsed.dial);
    const [localNumber, setLocalNumber] = useState(parsed.local);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [autoDetected, setAutoDetected] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoDetected) return;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch("https://ipapi.co/json/", {
                    signal: controller.signal,
                });
                const data = await res.json();
                if (data?.country_code) {
                    const match = countries.find(
                        (c) => c.code === data.country_code.toUpperCase()
                    );
                    if (match && !value) {
                        setSelectedDial(match.dial);
                    }
                }
            } catch {
                // Silently fall back to default
            } finally {
                setAutoDetected(true);
            }
        })();

        return () => controller.abort();
    }, [autoDetected, value]);

    useEffect(() => {
        if (value) {
            const p = parsePhoneValue(value);
            setSelectedDial(p.dial);
            setLocalNumber(p.local);
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    const emitChange = (dial: string, local: string) => {
        const full = local ? `${dial} ${local}` : "";
        onChange(full);
    };

    const handleDialSelect = (dial: string) => {
        setSelectedDial(dial);
        setIsOpen(false);
        setSearch("");
        emitChange(dial, localNumber);
    };

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9\s\-()]/g, "");
        setLocalNumber(val);
        emitChange(selectedDial, val);
    };

    const selectedCountry = countries.find((c) => c.dial === selectedDial);
    const displayFlag = selectedCountry?.flag || "🌍";

    const filtered = countries.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dial.includes(search) ||
            c.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className="flex items-center rounded-xl overflow-hidden transition-all"
                style={style}
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 px-3 py-3 shrink-0 hover:bg-black/5 transition-colors border-r border-black/10"
                    style={{ fontSize: "14px" }}
                    aria-label="Select country code"
                    id={id ? `${id}-country` : undefined}
                >
                    <span style={{ fontSize: "18px", lineHeight: 1 }}>{displayFlag}</span>
                    <span
                        className="text-sm font-medium"
                        style={{ color: "#1C1C1C", minWidth: "36px" }}
                    >
                        {selectedDial}
                    </span>
                    <ChevronDown
                        size={12}
                        style={{
                            color: "#aaa",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    />
                </button>

                <input
                    type="tel"
                    value={localNumber}
                    onChange={handleLocalChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required={required}
                    placeholder={placeholder}
                    className="flex-1 py-3 px-3 text-sm outline-none bg-transparent"
                    style={{ color: "#1C1C1C" }}
                    id={id}
                />
            </div>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-72 rounded-xl overflow-hidden z-50"
                    style={{
                        background: "white",
                        boxShadow:
                            "0 16px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                        maxHeight: "280px",
                    }}
                >
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: "#aaa" }}
                            />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg outline-none"
                                style={{
                                    background: "#F8F6F2",
                                    color: "#1C1C1C",
                                    border: "1px solid transparent",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "220px" }}
                    >
                        {filtered.length === 0 && (
                            <div
                                className="px-4 py-3 text-sm"
                                style={{ color: "#aaa" }}
                            >
                                No countries found
                            </div>
                        )}
                        {filtered.map((c) => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => handleDialSelect(c.dial)}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                                style={{
                                    background:
                                        c.dial === selectedDial
                                            ? "rgba(102,63,35,0.06)"
                                            : "transparent",
                                }}
                            >
                                <span style={{ fontSize: "18px", lineHeight: 1 }}>
                                    {c.flag}
                                </span>
                                <span
                                    className="flex-1 text-sm"
                                    style={{ color: "#1C1C1C" }}
                                >
                                    {c.name}
                                </span>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: "#663F23" }}
                                >
                                    {c.dial}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
