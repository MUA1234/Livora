"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Save,
    Box,
    Undo2,
    Redo2,
    RotateCw,
    Trash2,
    Grid3X3,
    Plus,
    Minus,
    Move,
    Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { Toast } from "@/components/ui/Toast";

interface Product {
    _id: string;
    name: string;
    category: string;
    width: number;
    depth: number;
    height: number;
    price: number;
    images: string[];
    colors: string[];
}

interface PlacedItem {
    id: string;
    productId: string;
    name: string;
    category: string;
    x: number;
    y: number;
    rotation: number;
    width: number;
    depth: number;
}

interface RoomData {
    _id: string;
    name: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    shape: string;
}

interface DesignData {
    _id: string;
    name: string;
    roomId: string;
    layoutData: {
        furniture: {
            productId: string;
            position: { x: number; y: number };
            rotation: number;
            width: number;
            depth: number;
        }[];
    };
    status: string;
}

interface HistoryState {
    items: PlacedItem[];
}

interface ToastState {
    message: string;
    type: "success" | "error" | "info";
}

const CATEGORY_COLORS: Record<string, string> = {
    sofa: "#8B5E3C",
    bed: "#6B8E6B",
    table: "#C6A75E",
    chair: "#A0522D",
    wardrobe: "#7B6B5E",
    desk: "#B8860B",
    shelf: "#708090",
    lamp: "#DAA520",
    tv: "#4A4A4A",
    refrigerator: "#87CEEB",
    cabinet: "#8B7355",
    default: "#9E8B7E",
};

function getCategoryColor(category: string): string {
    const lower = category.toLowerCase();
    for (const key of Object.keys(CATEGORY_COLORS)) {
        if (lower.includes(key)) return CATEGORY_COLORS[key];
    }
    return CATEGORY_COLORS.default;
}

function getModelType(category: string, name: string): string {
    const s = (category + " " + name).toLowerCase();
    if (s.includes("sectional")) return "sectional";
    if (s.includes("sofa") || s.includes("couch")) return "sofa";
    if (s.includes("lounge chair") || s.includes("lounge")) return "lounge";
    if (s.includes("dining chair") || s.includes("chair")) return "chair";
    if (s.includes("bed")) return "bed";
    if (s.includes("coffee table")) return "coffee-table";
    if (s.includes("round") && s.includes("table")) return "round-table";
    if (s.includes("dining table")) return "round-table";
    if (s.includes("desk")) return "desk";
    if (s.includes("table")) return "table";
    if (s.includes("bookshelf") || s.includes("shelf")) return "bookshelf";
    if (s.includes("floor lamp")) return "floor-lamp";
    if (s.includes("pendant") || s.includes("ceiling")) return "pendant";
    if (s.includes("lamp") || s.includes("light")) return "floor-lamp";
    if (s.includes("tv") || s.includes("console")) return "tv-console";
    if (s.includes("nightstand")) return "nightstand";
    if (s.includes("rug") || s.includes("carpet") || s.includes("area")) return "rug";
    if (s.includes("mirror")) return "mirror";
    if (s.includes("vase")) return "vase";
    if (s.includes("wardrobe") || s.includes("cabinet") || s.includes("dresser")) return "cabinet";
    return "box";
}

function hexLighten(hex: string, amt: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(amt * 255));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(amt * 255));
    const b = Math.min(255, (num & 0xff) + Math.round(amt * 255));
    return `rgb(${r},${g},${b})`;
}

function hexDarken(hex: string, amt: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(amt * 255));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(amt * 255));
    const b = Math.max(0, (num & 0xff) - Math.round(amt * 255));
    return `rgb(${r},${g},${b})`;
}

function FurnitureTopView({ w, d, color, type, id }: { w: number; d: number; color: string; type: string; id: string }) {
    const lt = hexLighten(color, 0.12);
    const dk = hexDarken(color, 0.1);
    const dkr = hexDarken(color, 0.2);

    switch (type) {
        case "sofa": {
            const armW = w * 0.08;
            const backD = d * 0.18;
            const cushionCount = Math.max(2, Math.round(w / 80));
            const innerW = w - armW * 2;
            const cw = (innerW - (cushionCount - 1) * 1) / cushionCount;
            return (
                <g>
                    {/* Shadow */}
                    <rect x={2} y={2} width={w} height={d} rx={3} fill="rgba(0,0,0,0.08)" />
                    {/* Back */}
                    <rect x={0} y={0} width={w} height={backD} rx={3} fill={dk} />
                    {/* Base */}
                    <rect x={armW} y={backD} width={innerW} height={d - backD} rx={2} fill={color} />
                    {/* Seat cushions */}
                    {Array.from({ length: cushionCount }, (_, i) => (
                        <rect key={i} x={armW + i * (cw + 1) + 1} y={backD + 2} width={cw - 2} height={d - backD - 4} rx={3} fill={lt} stroke={dk} strokeWidth={0.5} />
                    ))}
                    {/* Back cushions */}
                    {Array.from({ length: cushionCount }, (_, i) => (
                        <rect key={`b${i}`} x={armW + i * (cw + 1) + 2} y={2} width={cw - 4} height={backD - 3} rx={2} fill={hexLighten(color, 0.06)} />
                    ))}
                    {/* Arms */}
                    <rect x={0} y={0} width={armW} height={d} rx={3} fill={dkr} />
                    <rect x={w - armW} y={0} width={armW} height={d} rx={3} fill={dkr} />
                </g>
            );
        }

        case "sectional": {
            const backD = d * 0.14;
            const extW = w * 0.35;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={3} fill="rgba(0,0,0,0.08)" />
                    {/* Main section */}
                    <rect x={0} y={0} width={w} height={d * 0.5} rx={3} fill={color} />
                    {/* Extension (chaise) */}
                    <rect x={w - extW} y={0} width={extW} height={d} rx={3} fill={color} />
                    {/* Back - L shape */}
                    <rect x={0} y={0} width={w} height={backD} rx={2} fill={dk} />
                    <rect x={w - backD} y={0} width={backD} height={d} rx={2} fill={dk} />
                    {/* Main cushions */}
                    <rect x={3} y={backD + 2} width={w - extW - 5} height={d * 0.5 - backD - 4} rx={3} fill={lt} stroke={dk} strokeWidth={0.5} />
                    {/* Extension cushion */}
                    <rect x={w - extW + 2} y={backD + 2} width={extW - backD - 3} height={d - backD - 4} rx={3} fill={lt} stroke={dk} strokeWidth={0.5} />
                </g>
            );
        }

        case "lounge": {
            const armW = w * 0.10;
            const backD = d * 0.20;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={4} fill="rgba(0,0,0,0.08)" />
                    <rect x={0} y={0} width={w} height={d} rx={4} fill={dkr} />
                    {/* Back */}
                    <rect x={armW} y={2} width={w - armW * 2} height={backD - 2} rx={3} fill={dk} />
                    {/* Seat cushion */}
                    <rect x={armW + 2} y={backD + 1} width={w - armW * 2 - 4} height={d - backD - 3} rx={4} fill={lt} stroke={dk} strokeWidth={0.5} />
                    {/* Arms */}
                    <rect x={1} y={1} width={armW - 1} height={d - 2} rx={4} fill={color} />
                    <rect x={w - armW} y={1} width={armW - 1} height={d - 2} rx={4} fill={color} />
                </g>
            );
        }

        case "chair": {
            const backD = d * 0.12;
            const legR = Math.min(w, d) * 0.04;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.06)" />
                    {/* Seat */}
                    <rect x={1} y={backD} width={w - 2} height={d - backD - 1} rx={3} fill={lt} stroke={dk} strokeWidth={0.6} />
                    {/* Back */}
                    <rect x={2} y={0} width={w - 4} height={backD + 2} rx={2} fill={dk} />
                    {/* Legs */}
                    <circle cx={legR + 2} cy={legR + 2} r={legR} fill={dkr} />
                    <circle cx={w - legR - 2} cy={legR + 2} r={legR} fill={dkr} />
                    <circle cx={legR + 2} cy={d - legR - 2} r={legR} fill={dkr} />
                    <circle cx={w - legR - 2} cy={d - legR - 2} r={legR} fill={dkr} />
                </g>
            );
        }

        case "bed": {
            const headD = d * 0.06;
            const footD = d * 0.03;
            const pillowW = w * 0.38;
            const pillowD = d * 0.12;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.07)" />
                    {/* Frame */}
                    <rect x={0} y={0} width={w} height={d} rx={2} fill={dk} stroke={dkr} strokeWidth={0.8} />
                    {/* Headboard */}
                    <rect x={-1} y={0} width={w + 2} height={headD} rx={2} fill={dkr} />
                    {/* Footboard */}
                    <rect x={0} y={d - footD} width={w} height={footD} rx={1} fill={dkr} />
                    {/* Mattress */}
                    <rect x={2} y={headD + 1} width={w - 4} height={d - headD - footD - 2} rx={2} fill={lt} stroke={hexDarken(color, 0.05)} strokeWidth={0.4} />
                    {/* Duvet/blanket line */}
                    <rect x={3} y={d * 0.45} width={w - 6} height={d * 0.45} rx={3} fill={hexLighten(color, 0.18)} stroke={dk} strokeWidth={0.3} />
                    {/* Pillows */}
                    <rect x={w * 0.06} y={headD + 3} width={pillowW} height={pillowD} rx={pillowD * 0.35} fill="white" stroke={hexDarken(color, 0.05)} strokeWidth={0.4} />
                    <rect x={w - w * 0.06 - pillowW} y={headD + 3} width={pillowW} height={pillowD} rx={pillowD * 0.35} fill="white" stroke={hexDarken(color, 0.05)} strokeWidth={0.4} />
                </g>
            );
        }

        case "coffee-table": {
            const legR = Math.min(w, d) * 0.035;
            const inset = 4;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.06)" />
                    {/* Table top */}
                    <rect x={0} y={0} width={w} height={d} rx={2} fill={color} stroke={dk} strokeWidth={0.6} />
                    {/* Wood grain lines */}
                    {[0.25, 0.5, 0.75].map((f, i) => (
                        <line key={i} x1={4} y1={d * f} x2={w - 4} y2={d * f} stroke={dk} strokeWidth={0.3} strokeOpacity={0.4} />
                    ))}
                    {/* Lower shelf outline */}
                    <rect x={w * 0.12} y={d * 0.15} width={w * 0.76} height={d * 0.7} rx={1} fill="none" stroke={dk} strokeWidth={0.4} strokeDasharray="2 2" />
                    {/* Legs */}
                    <circle cx={inset} cy={inset} r={legR} fill={dkr} />
                    <circle cx={w - inset} cy={inset} r={legR} fill={dkr} />
                    <circle cx={inset} cy={d - inset} r={legR} fill={dkr} />
                    <circle cx={w - inset} cy={d - inset} r={legR} fill={dkr} />
                </g>
            );
        }

        case "table": {
            const legR = Math.min(w, d) * 0.03;
            const inset = 5;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={1} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={color} stroke={dk} strokeWidth={0.6} />
                    {/* Wood grain */}
                    {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
                        <line key={i} x1={3} y1={d * f} x2={w - 3} y2={d * f} stroke={dk} strokeWidth={0.2} strokeOpacity={0.3} />
                    ))}
                    <circle cx={inset} cy={inset} r={legR} fill={dkr} />
                    <circle cx={w - inset} cy={inset} r={legR} fill={dkr} />
                    <circle cx={inset} cy={d - inset} r={legR} fill={dkr} />
                    <circle cx={w - inset} cy={d - inset} r={legR} fill={dkr} />
                </g>
            );
        }

        case "round-table": {
            const rx = w / 2;
            const ry = d / 2;
            const pedR = Math.min(w, d) * 0.08;
            return (
                <g>
                    <ellipse cx={rx + 2} cy={ry + 2} rx={rx} ry={ry} fill="rgba(0,0,0,0.06)" />
                    <ellipse cx={rx} cy={ry} rx={rx} ry={ry} fill={color} stroke={dk} strokeWidth={0.7} />
                    {/* Concentric ring detail */}
                    <ellipse cx={rx} cy={ry} rx={rx * 0.75} ry={ry * 0.75} fill="none" stroke={dk} strokeWidth={0.3} strokeOpacity={0.3} />
                    {/* Pedestal base */}
                    <ellipse cx={rx} cy={ry} rx={pedR} ry={pedR} fill={dkr} />
                </g>
            );
        }

        case "desk": {
            const drawerW = w * 0.35;
            const legR = Math.min(w, d) * 0.025;
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={1} fill="rgba(0,0,0,0.06)" />
                    {/* Desktop surface */}
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={color} stroke={dk} strokeWidth={0.6} />
                    {/* Left panel leg */}
                    <rect x={1} y={1} width={2} height={d - 2} fill={dkr} />
                    {/* Drawer unit (right side) */}
                    <rect x={w - drawerW} y={1} width={drawerW - 1} height={d - 2} rx={1} fill={dk} stroke={dkr} strokeWidth={0.4} />
                    {/* Drawer lines */}
                    <line x1={w - drawerW + 3} y1={d * 0.33} x2={w - 3} y2={d * 0.33} stroke={dkr} strokeWidth={0.4} />
                    <line x1={w - drawerW + 3} y1={d * 0.66} x2={w - 3} y2={d * 0.66} stroke={dkr} strokeWidth={0.4} />
                    {/* Drawer handles */}
                    {[0.17, 0.5, 0.83].map((f, i) => (
                        <circle key={i} cx={w - drawerW / 2} cy={d * f} r={legR} fill={hexLighten(color, 0.2)} stroke={dkr} strokeWidth={0.3} />
                    ))}
                    {/* Knee space */}
                    <rect x={4} y={2} width={w - drawerW - 6} height={d - 4} rx={1} fill={hexLighten(color, 0.08)} strokeDasharray="1.5 1.5" stroke={dk} strokeWidth={0.3} />
                </g>
            );
        }

        case "bookshelf": {
            const shelfCount = Math.max(3, Math.round(d / 30));
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={1} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={color} stroke={dk} strokeWidth={0.7} />
                    {/* Side panels */}
                    <rect x={0} y={0} width={w * 0.06} height={d} fill={dkr} />
                    <rect x={w - w * 0.06} y={0} width={w * 0.06} height={d} fill={dkr} />
                    {/* Shelf lines */}
                    {Array.from({ length: shelfCount - 1 }, (_, i) => {
                        const sy = ((i + 1) / shelfCount) * d;
                        return <line key={i} x1={w * 0.06} y1={sy} x2={w - w * 0.06} y2={sy} stroke={dkr} strokeWidth={0.6} />;
                    })}
                    {/* Book-like fills on some shelves */}
                    {Array.from({ length: Math.min(shelfCount - 1, 3) }, (_, i) => {
                        const sy = ((i + 1) / shelfCount) * d + 1;
                        const sh = d / shelfCount - 2;
                        return <rect key={`b${i}`} x={w * 0.08} y={sy} width={w * 0.45} height={sh} rx={0.5} fill={hexLighten(color, 0.1 + i * 0.04)} />;
                    })}
                </g>
            );
        }

        case "floor-lamp": {
            const baseR = Math.min(w, d) * 0.35;
            const poleR = Math.min(w, d) * 0.04;
            const shadeR = Math.min(w, d) * 0.3;
            return (
                <g>
                    {/* Shadow */}
                    <ellipse cx={w / 2 + 1} cy={d / 2 + 1} rx={baseR} ry={baseR} fill="rgba(0,0,0,0.08)" />
                    {/* Base */}
                    <ellipse cx={w / 2} cy={d / 2} rx={baseR} ry={baseR} fill={dkr} stroke={dk} strokeWidth={0.5} />
                    {/* Shade outline */}
                    <ellipse cx={w / 2} cy={d / 2} rx={shadeR} ry={shadeR} fill={lt} fillOpacity={0.4} stroke={color} strokeWidth={0.6} />
                    {/* Pole */}
                    <circle cx={w / 2} cy={d / 2} r={poleR} fill={dkr} />
                    {/* Glow */}
                    <ellipse cx={w / 2} cy={d / 2} rx={shadeR * 0.4} ry={shadeR * 0.4} fill="#FFF8E0" fillOpacity={0.5} />
                </g>
            );
        }

        case "pendant": {
            const shadeR = Math.min(w, d) * 0.38;
            return (
                <g>
                    {/* Shade circle */}
                    <ellipse cx={w / 2} cy={d / 2} rx={shadeR} ry={shadeR} fill={lt} fillOpacity={0.5} stroke={color} strokeWidth={0.6} strokeDasharray="2 1" />
                    {/* Inner glow */}
                    <ellipse cx={w / 2} cy={d / 2} rx={shadeR * 0.35} ry={shadeR * 0.35} fill="#FFF8E0" fillOpacity={0.6} />
                    {/* Center point */}
                    <circle cx={w / 2} cy={d / 2} r={1.5} fill={dkr} />
                </g>
            );
        }

        case "tv-console": {
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={2} fill={color} stroke={dk} strokeWidth={0.6} />
                    {/* Top surface highlight */}
                    <rect x={1} y={1} width={w - 2} height={d - 2} rx={1.5} fill={lt} fillOpacity={0.3} />
                    {/* Cabinet doors */}
                    <rect x={2} y={2} width={w * 0.28} height={d - 4} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    <rect x={w - w * 0.28 - 2} y={2} width={w * 0.28} height={d - 4} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    {/* Open shelf (center) */}
                    <rect x={w * 0.32} y={2} width={w * 0.36} height={d - 4} rx={1} fill={dk} fillOpacity={0.3} />
                    {/* Handles */}
                    <line x1={w * 0.26} y1={d * 0.4} x2={w * 0.26} y2={d * 0.6} stroke={dkr} strokeWidth={0.8} strokeLinecap="round" />
                    <line x1={w * 0.74} y1={d * 0.4} x2={w * 0.74} y2={d * 0.6} stroke={dkr} strokeWidth={0.8} strokeLinecap="round" />
                </g>
            );
        }

        case "nightstand": {
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={2} fill={color} stroke={dk} strokeWidth={0.6} />
                    {/* Drawer front */}
                    <rect x={2} y={2} width={w - 4} height={d * 0.45} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    <rect x={2} y={d * 0.5} width={w - 4} height={d * 0.45} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    {/* Handles */}
                    <line x1={w * 0.35} y1={d * 0.25} x2={w * 0.65} y2={d * 0.25} stroke={dkr} strokeWidth={0.8} strokeLinecap="round" />
                    <line x1={w * 0.35} y1={d * 0.72} x2={w * 0.65} y2={d * 0.72} stroke={dkr} strokeWidth={0.8} strokeLinecap="round" />
                </g>
            );
        }

        case "rug": {
            const border = Math.min(w, d) * 0.06;
            return (
                <g>
                    {/* Rug body */}
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={color} fillOpacity={0.5} />
                    {/* Border */}
                    <rect x={0} y={0} width={w} height={d} rx={1} fill="none" stroke={dk} strokeWidth={border} strokeOpacity={0.4} />
                    {/* Inner border */}
                    <rect x={border * 1.5} y={border * 1.5} width={w - border * 3} height={d - border * 3} rx={0.5} fill="none" stroke={dk} strokeWidth={0.4} strokeOpacity={0.3} />
                    {/* Pattern center */}
                    <ellipse cx={w / 2} cy={d / 2} rx={w * 0.18} ry={d * 0.18} fill="none" stroke={dk} strokeWidth={0.4} strokeOpacity={0.3} />
                </g>
            );
        }

        case "mirror": {
            return (
                <g>
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={dk} stroke={dkr} strokeWidth={0.7} />
                    {/* Glass surface */}
                    <rect x={2} y={2} width={w - 4} height={d - 4} rx={0.5} fill="#D8E4F0" fillOpacity={0.7} />
                    {/* Reflection streak */}
                    <line x1={w * 0.25} y1={3} x2={w * 0.15} y2={d - 3} stroke="white" strokeWidth={0.6} strokeOpacity={0.5} />
                </g>
            );
        }

        case "vase": {
            const rx = w * 0.35;
            const ry = d * 0.35;
            return (
                <g>
                    <ellipse cx={w / 2 + 1} cy={d / 2 + 1} rx={rx} ry={ry} fill="rgba(0,0,0,0.06)" />
                    <ellipse cx={w / 2} cy={d / 2} rx={rx} ry={ry} fill={color} stroke={dk} strokeWidth={0.5} />
                    {/* Rim */}
                    <ellipse cx={w / 2} cy={d / 2} rx={rx * 0.5} ry={ry * 0.5} fill={lt} stroke={dk} strokeWidth={0.4} />
                    {/* Highlight */}
                    <ellipse cx={w / 2 - rx * 0.2} cy={d / 2 - ry * 0.2} rx={rx * 0.15} ry={ry * 0.2} fill="white" fillOpacity={0.3} />
                </g>
            );
        }

        case "cabinet": {
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={1} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={1} fill={color} stroke={dk} strokeWidth={0.7} />
                    {/* Two doors */}
                    <rect x={2} y={2} width={w / 2 - 3} height={d - 4} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    <rect x={w / 2 + 1} y={2} width={w / 2 - 3} height={d - 4} rx={1} fill="none" stroke={dk} strokeWidth={0.4} />
                    {/* Handles */}
                    <line x1={w / 2 - 3} y1={d * 0.4} x2={w / 2 - 3} y2={d * 0.6} stroke={dkr} strokeWidth={1} strokeLinecap="round" />
                    <line x1={w / 2 + 3} y1={d * 0.4} x2={w / 2 + 3} y2={d * 0.6} stroke={dkr} strokeWidth={1} strokeLinecap="round" />
                </g>
            );
        }

        default: {
            return (
                <g>
                    <rect x={2} y={2} width={w} height={d} rx={2} fill="rgba(0,0,0,0.06)" />
                    <rect x={0} y={0} width={w} height={d} rx={2} fill={color} fillOpacity={0.7} stroke={dk} strokeWidth={0.6} />
                </g>
            );
        }
    }
}

// Product dimensions in DB are already in cm
const DIM_SCALE = 1;
const GRID_STEP_CM = 10;

function TwoDLayoutEditorInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId");
    const designIdParam = searchParams.get("designId");

    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    const [room, setRoom] = useState<RoomData | null>(null);
    const [designId, setDesignId] = useState<string | null>(designIdParam);
    const [designName, setDesignName] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<PlacedItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [history, setHistory] = useState<HistoryState[]>([{ items: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [scale, setScale] = useState(1);
    const [panX, setPanX] = useState(50);
    const [panY, setPanY] = useState(50);
    const [hasAutoFit, setHasAutoFit] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(true);

    const [sidebarTab, setSidebarTab] = useState<"furniture" | "properties">("furniture");

    const [dragState, setDragState] = useState<{
        itemId: string;
        startX: number;
        startY: number;
        itemStartX: number;
        itemStartY: number;
    } | null>(null);

    const [panState, setPanState] = useState<{
        startX: number;
        startY: number;
        panStartX: number;
        panStartY: number;
    } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");

    const roomWidthCm = room ? room.dimensions.length * 100 : 500;
    const roomDepthCm = room ? room.dimensions.width * 100 : 400;

    const pushHistory = useCallback(
        (newItems: PlacedItem[]) => {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push({ items: JSON.parse(JSON.stringify(newItems)) });
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        },
        [history, historyIndex]
    );

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setItems(JSON.parse(JSON.stringify(history[newIndex].items)));
            setSelectedId(null);
        }
    }, [historyIndex, history]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setItems(JSON.parse(JSON.stringify(history[newIndex].items)));
            setSelectedId(null);
        }
    }, [historyIndex, history]);

    const snapValue = useCallback(
        (val: number): number => {
            if (!snapToGrid) return val;
            return Math.round(val / GRID_STEP_CM) * GRID_STEP_CM;
        },
        [snapToGrid]
    );

    const rotateSelected = useCallback(() => {
        if (!selectedId) return;
        const updated = items.map((item) =>
            item.id === selectedId
                ? { ...item, rotation: (item.rotation + 15) % 360 }
                : item
        );
        setItems(updated);
        pushHistory(updated);
    }, [selectedId, items, pushHistory]);

    const deleteSelected = useCallback(() => {
        if (!selectedId) return;
        const updated = items.filter((item) => item.id !== selectedId);
        setItems(updated);
        setSelectedId(null);
        pushHistory(updated);
    }, [selectedId, items, pushHistory]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const prodRes = await api.get("/api/products?limit=100");
                setProducts(prodRes.data.products || []);

                if (designIdParam) {
                    const desRes = await api.get(`/api/designs/${designIdParam}`);
                    const design: DesignData = desRes.data.data || desRes.data;
                    setDesignId(design._id);
                    setDesignName(design.name || "");

                    const rmId = design.roomId;
                    if (rmId) {
                        const roomRes = await api.get(`/api/rooms/${rmId}`);
                        setRoom(roomRes.data.data || roomRes.data);
                    }

                    if (design.layoutData?.furniture) {
                        const loaded: PlacedItem[] = design.layoutData.furniture.map(
                            (f, i) => {
                                const prod = prodRes.data.products?.find(
                                    (p: Product) => p._id === f.productId
                                );
                                return {
                                    id: `item-${Date.now()}-${i}`,
                                    productId: f.productId,
                                    name: prod?.name || "Unknown",
                                    category: prod?.category || "default",
                                    x: (f.position.x || 0) * 100, // meters to cm
                                    y: ((f.position as any).z ?? f.position.y ?? 0) * 100, // z is depth in 3D, y in 2D
                                    rotation: f.rotation || 0,
                                    width: f.width || (prod?.width ? prod.width * DIM_SCALE : 60),
                                    depth: f.depth || (prod?.depth ? prod.depth * DIM_SCALE : 60),
                                };
                            }
                        );
                        setItems(loaded);
                        setHistory([{ items: JSON.parse(JSON.stringify(loaded)) }]);
                        setHistoryIndex(0);
                    }
                } else if (roomIdParam) {
                    const roomRes = await api.get(`/api/rooms/${roomIdParam}`);
                    setRoom(roomRes.data.data || roomRes.data);
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Failed to load data";
                setToast({ message: msg, type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [designIdParam, roomIdParam]);

    // Auto-fit room in viewport on first load
    useEffect(() => {
        if (hasAutoFit || loading || !room) return;
        const svg = svgRef.current;
        if (!svg) return;
        const parent = svg.parentElement;
        if (!parent) return;
        const pw = parent.clientWidth;
        const ph = parent.clientHeight;
        const padding = 80;
        const fitScale = Math.min(
            (pw - padding * 2) / roomWidthCm,
            (ph - padding * 2) / roomDepthCm
        );
        const clampedScale = Math.max(0.3, Math.min(5, fitScale));
        setScale(clampedScale);
        setPanX((pw - roomWidthCm * clampedScale) / 2);
        setPanY((ph - roomDepthCm * clampedScale) / 2);
        setHasAutoFit(true);
    }, [loading, room, roomWidthCm, roomDepthCm, hasAutoFit]);

    const handleSave = useCallback(async () => {
        try {
            setSaving(true);
            const layoutData = {
                furniture: items.map((item) => ({
                    productId: item.productId,
                    position: { x: item.x / 100, y: 0, z: item.y / 100 }, // cm back to meters; y=height, z=depth
                    rotation: item.rotation,
                    width: item.width,
                    depth: item.depth,
                })),
            };

            if (designId) {
                await api.put(`/api/designs/${designId}`, { layoutData });
                setToast({ message: "Design saved successfully", type: "success" });
            } else {
                const res = await api.post("/api/designs", {
                    name: designName || `Layout - ${room?.name || "Room"}`,
                    roomId: roomIdParam || room?._id,
                    layoutData,
                    status: "draft",
                });
                const newDesign = res.data.data || res.data;
                setDesignId(newDesign._id);
                router.replace(`/admin/2d-layout?designId=${newDesign._id}`);
                setToast({ message: "Design created successfully", type: "success" });
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save";
            setToast({ message: msg, type: "error" });
        } finally {
            setSaving(false);
        }
    }, [items, designId, designName, roomIdParam, room, router]);

    const addProduct = useCallback(
        (product: Product) => {
            const widthCm = product.width * DIM_SCALE;
            const depthCm = product.depth * DIM_SCALE;
            const newItem: PlacedItem = {
                id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                productId: product._id,
                name: product.name,
                category: product.category,
                x: snapValue(roomWidthCm / 2),
                y: snapValue(roomDepthCm / 2),
                rotation: 0,
                width: widthCm,
                depth: depthCm,
            };
            const updated = [...items, newItem];
            setItems(updated);
            setSelectedId(newItem.id);
            pushHistory(updated);
            setSidebarTab("properties");
        },
        [items, pushHistory, roomWidthCm, roomDepthCm, snapValue]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            )
                return;

            if (e.key === "Escape") {
                setSelectedId(null);
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }

            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === "y" || (e.key === "z" && e.shiftKey))
            ) {
                e.preventDefault();
                redo();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
                return;
            }

            if (e.key === "r" || e.key === "R") {
                rotateSelected();
                return;
            }

            if (e.key === "Delete" || e.key === "Backspace") {
                deleteSelected();
                return;
            }

            if (selectedId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 1 : GRID_STEP_CM;
                setItems((prev) => {
                    const updated = prev.map((item) => {
                        if (item.id !== selectedId) return item;
                        let newX = item.x;
                        let newY = item.y;
                        if (e.key === "ArrowLeft") newX -= step;
                        if (e.key === "ArrowRight") newX += step;
                        if (e.key === "ArrowUp") newY -= step;
                        if (e.key === "ArrowDown") newY += step;
                        return { ...item, x: snapValue(newX), y: snapValue(newY) };
                    });
                    pushHistory(updated);
                    return updated;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, undo, redo, handleSave, rotateSelected, deleteSelected, snapValue, pushHistory]);

    const screenToCanvas = useCallback(
        (clientX: number, clientY: number): { x: number; y: number } => {
            if (!svgRef.current) return { x: 0, y: 0 };
            const rect = svgRef.current.getBoundingClientRect();
            const sx = clientX - rect.left;
            const sy = clientY - rect.top;
            return {
                x: (sx - panX) / scale,
                y: (sy - panY) / scale,
            };
        },
        [panX, panY, scale]
    );

    const handleCanvasMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
                e.preventDefault();
                setPanState({
                    startX: e.clientX,
                    startY: e.clientY,
                    panStartX: panX,
                    panStartY: panY,
                });
                return;
            }

            if (e.button === 0 && !(e.target as SVGElement).closest("[data-item-id]")) {
                setSelectedId(null);
            }
        },
        [panX, panY]
    );

    const handleItemMouseDown = useCallback(
        (e: React.MouseEvent, itemId: string) => {
            if (e.button !== 0 || e.ctrlKey) return;
            e.stopPropagation();
            setSelectedId(itemId);

            const item = items.find((i) => i.id === itemId);
            if (!item) return;

            setDragState({
                itemId,
                startX: e.clientX,
                startY: e.clientY,
                itemStartX: item.x,
                itemStartY: item.y,
            });
        },
        [items]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (panState) {
                const dx = e.clientX - panState.startX;
                const dy = e.clientY - panState.startY;
                setPanX(panState.panStartX + dx);
                setPanY(panState.panStartY + dy);
                return;
            }

            if (dragState) {
                const dx = (e.clientX - dragState.startX) / scale;
                const dy = (e.clientY - dragState.startY) / scale;
                const newX = snapValue(dragState.itemStartX + dx);
                const newY = snapValue(dragState.itemStartY + dy);
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === dragState.itemId
                            ? { ...item, x: newX, y: newY }
                            : item
                    )
                );
            }
        };

        const handleMouseUp = () => {
            if (dragState) {
                pushHistory(items);
            }
            setDragState(null);
            setPanState(null);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [panState, dragState, scale, snapValue, pushHistory, items]);

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            e.preventDefault();
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = Math.min(Math.max(scale * factor, 0.2), 10);

            const newPanX = mouseX - ((mouseX - panX) / scale) * newScale;
            const newPanY = mouseY - ((mouseY - panY) / scale) * newScale;

            setScale(newScale);
            setPanX(newPanX);
            setPanY(newPanY);
        },
        [scale, panX, panY]
    );

    const selectedItem = items.find((i) => i.id === selectedId) || null;

    const updateSelectedProperty = useCallback(
        (prop: "x" | "y" | "rotation", value: number) => {
            if (!selectedId) return;
            const updated = items.map((item) =>
                item.id === selectedId ? { ...item, [prop]: value } : item
            );
            setItems(updated);
            pushHistory(updated);
        },
        [selectedId, items, pushHistory]
    );

    const groupedProducts = products.reduce<Record<string, Product[]>>(
        (acc, p) => {
            const cat = p.category || "Other";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
        },
        {}
    );

    const filteredGroups = Object.entries(groupedProducts)
        .map(([cat, prods]) => {
            const filtered = prods.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return [cat, filtered] as [string, Product[]];
        })
        .filter(([, prods]) => prods.length > 0);

    const gridSpacingPx = GRID_STEP_CM;

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#663F23]" />
                    <span className="text-[#663F23] font-medium">Loading editor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-white font-sans text-[#1C1C1C] overflow-hidden">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-white z-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/room-setup"
                            className="text-[#663F23] hover:text-[#52321c] transition-colors text-sm font-medium"
                        >
                            &larr; Back
                        </Link>
                        <h1 className="text-2xl font-semibold text-[#1C1C1C]">
                            2D Layout Editor
                        </h1>
                        {room && (
                            <span className="text-sm text-[#1C1C1C]/50">
                                {room.name} ({room.dimensions.length}m &times; {room.dimensions.width}m)
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 bg-white border border-[#663F23] text-[#663F23] font-semibold rounded-lg hover:bg-[#F5F1E8] transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Save
                        </button>
                        {designId && (
                            <Link
                                href={`/admin/3d-view?designId=${designId}`}
                                className="flex items-center gap-2 px-5 py-2 bg-[#663F23] text-white font-semibold rounded-lg hover:bg-[#52321c] transition-colors"
                            >
                                <Box size={16} />
                                3D View
                            </Link>
                        )}
                    </div>
                </header>

                <div className="bg-[#C6A75E] px-6 py-2 flex items-center gap-2 z-10">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#663F23] hover:bg-[#D4AF37]/30 rounded transition-colors disabled:opacity-40"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={16} />
                        <span className="text-xs font-medium">Undo</span>
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#663F23] hover:bg-[#D4AF37]/30 rounded transition-colors disabled:opacity-40"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={16} />
                        <span className="text-xs font-medium">Redo</span>
                    </button>
                    <div className="w-px h-5 bg-[#663F23]/30 mx-1" />
                    <button
                        onClick={rotateSelected}
                        disabled={!selectedId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#663F23] hover:bg-[#D4AF37]/30 rounded transition-colors disabled:opacity-40"
                        title="Rotate (R)"
                    >
                        <RotateCw size={16} />
                        <span className="text-xs font-medium">Rotate</span>
                    </button>
                    <button
                        onClick={deleteSelected}
                        disabled={!selectedId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#663F23] hover:bg-[#D4AF37]/30 rounded transition-colors disabled:opacity-40"
                        title="Delete (Del)"
                    >
                        <Trash2 size={16} />
                        <span className="text-xs font-medium">Delete</span>
                    </button>
                    <div className="w-px h-5 bg-[#663F23]/30 mx-1" />
                    <button
                        onClick={() => setSnapToGrid(!snapToGrid)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                            snapToGrid
                                ? "bg-[#663F23] text-white"
                                : "text-[#663F23] hover:bg-[#D4AF37]/30"
                        }`}
                        title="Snap to Grid"
                    >
                        <Grid3X3 size={16} />
                        <span className="text-xs font-medium">Snap</span>
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-[#663F23]">
                        <button
                            onClick={() => setScale((s) => Math.max(0.2, s * 0.8))}
                            className="p-1 hover:bg-[#D4AF37]/30 rounded transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-medium min-w-[50px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => setScale((s) => Math.min(10, s * 1.2))}
                            className="p-1 hover:bg-[#D4AF37]/30 rounded transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div
                        ref={containerRef}
                        className="flex-1 relative bg-[#FAF8F5] overflow-hidden"
                        style={{ cursor: panState ? "grabbing" : dragState ? "move" : "default" }}
                    >
                        <svg
                            ref={svgRef}
                            width="100%"
                            height="100%"
                            onMouseDown={handleCanvasMouseDown}
                            onWheel={handleWheel}
                            className="select-none"
                        >
                            <g transform={`translate(${panX}, ${panY}) scale(${scale})`}>
                                <rect
                                    x={-2000}
                                    y={-2000}
                                    width={roomWidthCm + 4000}
                                    height={roomDepthCm + 4000}
                                    fill="#FAF8F5"
                                />

                                {snapToGrid && (
                                    <>
                                        <defs>
                                            <pattern
                                                id="gridPattern"
                                                width={gridSpacingPx}
                                                height={gridSpacingPx}
                                                patternUnits="userSpaceOnUse"
                                            >
                                                <path
                                                    d={`M ${gridSpacingPx} 0 L 0 0 0 ${gridSpacingPx}`}
                                                    fill="none"
                                                    stroke="#CDAF70"
                                                    strokeWidth={0.3 / scale * 2}
                                                    strokeDasharray={`${1 / scale * 2} ${1 / scale * 2}`}
                                                    opacity={0.4}
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            x={0}
                                            y={0}
                                            width={roomWidthCm}
                                            height={roomDepthCm}
                                            fill="url(#gridPattern)"
                                        />
                                    </>
                                )}

                                <rect
                                    x={0}
                                    y={0}
                                    width={roomWidthCm}
                                    height={roomDepthCm}
                                    fill="#F5F1E8"
                                    stroke="#663F23"
                                    strokeWidth={2 / scale}
                                    opacity={0.5}
                                />

                                <rect
                                    x={0}
                                    y={0}
                                    width={roomWidthCm}
                                    height={roomDepthCm}
                                    fill="none"
                                    stroke="#663F23"
                                    strokeWidth={2 / scale}
                                />

                                <text
                                    x={roomWidthCm / 2}
                                    y={-8 / scale}
                                    textAnchor="middle"
                                    fontSize={10 / scale}
                                    fill="#663F23"
                                    fontWeight="500"
                                >
                                    {(roomWidthCm / 100).toFixed(1)}m
                                </text>
                                <text
                                    x={-8 / scale}
                                    y={roomDepthCm / 2}
                                    textAnchor="middle"
                                    fontSize={10 / scale}
                                    fill="#663F23"
                                    fontWeight="500"
                                    transform={`rotate(-90, ${-8 / scale}, ${roomDepthCm / 2})`}
                                >
                                    {(roomDepthCm / 100).toFixed(1)}m
                                </text>

                                {items.map((item) => {
                                    const isSelected = item.id === selectedId;
                                    const color = getCategoryColor(item.category);
                                    const modelType = getModelType(item.category, item.name);
                                    return (
                                        <g
                                            key={item.id}
                                            data-item-id={item.id}
                                            transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation}, ${item.width / 2}, ${item.depth / 2})`}
                                            onMouseDown={(e) => handleItemMouseDown(e, item.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {/* Detailed furniture top view */}
                                            <FurnitureTopView
                                                w={item.width}
                                                d={item.depth}
                                                color={color}
                                                type={modelType}
                                                id={item.id}
                                            />
                                            {/* Front indicator line */}
                                            <line
                                                x1={item.width * 0.3}
                                                y1={0}
                                                x2={item.width * 0.7}
                                                y2={0}
                                                stroke={isSelected ? "#2563EB" : color}
                                                strokeWidth={2 / scale}
                                            />
                                            {/* Name label */}
                                            <text
                                                x={item.width / 2}
                                                y={item.depth / 2}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fontSize={Math.min(
                                                    item.width * 0.13,
                                                    item.depth * 0.18,
                                                    11 / scale
                                                )}
                                                fill="#1C1C1C"
                                                fontWeight="600"
                                                style={{ pointerEvents: "none" }}
                                                paintOrder="stroke"
                                                stroke="white"
                                                strokeWidth={2.5 / scale}
                                                strokeLinejoin="round"
                                            >
                                                {item.name.length > 14
                                                    ? item.name.slice(0, 12) + "..."
                                                    : item.name}
                                            </text>
                                            <text
                                                x={item.width / 2}
                                                y={item.depth / 2 + Math.min(item.depth * 0.18, 11 / scale)}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fontSize={Math.min(
                                                    item.width * 0.09,
                                                    item.depth * 0.11,
                                                    7 / scale
                                                )}
                                                fill="#1C1C1C"
                                                fillOpacity={0.6}
                                                style={{ pointerEvents: "none" }}
                                                paintOrder="stroke"
                                                stroke="white"
                                                strokeWidth={2 / scale}
                                                strokeLinejoin="round"
                                            >
                                                {item.width.toFixed(0)} x {item.depth.toFixed(0)} cm
                                            </text>

                                            {isSelected && (
                                                <>
                                                    {[
                                                        [0, 0],
                                                        [item.width, 0],
                                                        [0, item.depth],
                                                        [item.width, item.depth],
                                                    ].map(([hx, hy], idx) => (
                                                        <circle
                                                            key={idx}
                                                            cx={hx}
                                                            cy={hy}
                                                            r={4 / scale}
                                                            fill="white"
                                                            stroke="#2563EB"
                                                            strokeWidth={1.5 / scale}
                                                        />
                                                    ))}
                                                    <circle
                                                        cx={item.width / 2}
                                                        cy={-12 / scale}
                                                        r={5 / scale}
                                                        fill="#2563EB"
                                                        stroke="white"
                                                        strokeWidth={1.5 / scale}
                                                        style={{ cursor: "pointer" }}
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            rotateSelected();
                                                        }}
                                                    />
                                                    <line
                                                        x1={item.width / 2}
                                                        y1={0}
                                                        x2={item.width / 2}
                                                        y2={-12 / scale}
                                                        stroke="#2563EB"
                                                        strokeWidth={1 / scale}
                                                    />
                                                </>
                                            )}
                                        </g>
                                    );
                                })}
                            </g>

                            <g transform={`translate(20, ${(containerRef.current?.clientHeight || 600) - 40})`}>
                                <line
                                    x1={0}
                                    y1={0}
                                    x2={scale * 100}
                                    y2={0}
                                    stroke="#663F23"
                                    strokeWidth={2}
                                />
                                <line x1={0} y1={-5} x2={0} y2={5} stroke="#663F23" strokeWidth={2} />
                                <line
                                    x1={scale * 100}
                                    y1={-5}
                                    x2={scale * 100}
                                    y2={5}
                                    stroke="#663F23"
                                    strokeWidth={2}
                                />
                                <text
                                    x={scale * 50}
                                    y={-8}
                                    textAnchor="middle"
                                    fontSize={11}
                                    fill="#663F23"
                                    fontWeight="500"
                                >
                                    1 meter
                                </text>
                            </g>
                        </svg>

                        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-[#663F23] font-medium border border-[#E5E5E5]">
                            <Move size={10} className="inline mr-1" />
                            Scroll: Zoom | Middle-click: Pan | Ctrl+Drag: Pan
                        </div>
                    </div>

                    <div className="w-[340px] bg-white border-l border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.05)]">
                        <div className="flex border-b border-[#E5E5E5]">
                            <button
                                onClick={() => setSidebarTab("furniture")}
                                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
                                    sidebarTab === "furniture"
                                        ? "text-[#663F23] border-b-2 border-[#663F23]"
                                        : "text-[#1C1C1C]/50 hover:text-[#1C1C1C]"
                                }`}
                            >
                                Furniture
                            </button>
                            <button
                                onClick={() => setSidebarTab("properties")}
                                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
                                    sidebarTab === "properties"
                                        ? "text-[#663F23] border-b-2 border-[#663F23]"
                                        : "text-[#1C1C1C]/50 hover:text-[#1C1C1C]"
                                }`}
                            >
                                Properties
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {sidebarTab === "furniture" && (
                                <div className="p-3">
                                    <input
                                        type="text"
                                        placeholder="Search furniture..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-[#FAF8F5] focus:outline-none focus:border-[#C6A75E] mb-3"
                                    />
                                    {filteredGroups.length === 0 && (
                                        <p className="text-sm text-[#1C1C1C]/40 text-center py-8">
                                            No products found
                                        </p>
                                    )}
                                    {filteredGroups.map(([category, prods]) => (
                                        <div key={category} className="mb-4">
                                            <h3 className="text-xs font-bold text-[#663F23] uppercase tracking-wider mb-2 px-1">
                                                {category}
                                            </h3>
                                            <div className="space-y-1">
                                                {prods.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        onClick={() => addProduct(product)}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-[#F5F1E8] transition-colors group"
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center"
                                                            style={{
                                                                backgroundColor:
                                                                    getCategoryColor(product.category) + "33",
                                                            }}
                                                        >
                                                            <div
                                                                className="w-4 h-3 rounded-sm"
                                                                style={{
                                                                    backgroundColor: getCategoryColor(
                                                                        product.category
                                                                    ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-[#1C1C1C] truncate">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-[#1C1C1C]/40">
                                                                {(product.width * DIM_SCALE).toFixed(0)} x{" "}
                                                                {(product.depth * DIM_SCALE).toFixed(0)} cm
                                                            </p>
                                                        </div>
                                                        <Plus
                                                            size={14}
                                                            className="text-[#C6A75E] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sidebarTab === "properties" && (
                                <div className="p-4">
                                    {!selectedItem ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#F5F1E8] flex items-center justify-center mb-3">
                                                <Move size={20} className="text-[#C6A75E]" />
                                            </div>
                                            <p className="text-sm text-[#1C1C1C]/40 font-medium">
                                                Select an item to view properties
                                            </p>
                                            <p className="text-xs text-[#1C1C1C]/30 mt-1">
                                                Click on a furniture piece in the canvas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            <div>
                                                <h3 className="text-base font-semibold text-[#1C1C1C] mb-1">
                                                    {selectedItem.name}
                                                </h3>
                                                <span
                                                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            getCategoryColor(selectedItem.category) + "20",
                                                        color: getCategoryColor(selectedItem.category),
                                                    }}
                                                >
                                                    {selectedItem.category}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-[#663F23] uppercase tracking-wider">
                                                    Position
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-[#1C1C1C]/50 mb-1 block">
                                                            X (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={Math.round(selectedItem.x)}
                                                            onChange={(e) =>
                                                                updateSelectedProperty(
                                                                    "x",
                                                                    parseFloat(e.target.value) || 0
                                                                )
                                                            }
                                                            className="w-full px-2 py-1.5 text-sm border border-[#E5E5E5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#C6A75E]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-[#1C1C1C]/50 mb-1 block">
                                                            Y (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={Math.round(selectedItem.y)}
                                                            onChange={(e) =>
                                                                updateSelectedProperty(
                                                                    "y",
                                                                    parseFloat(e.target.value) || 0
                                                                )
                                                            }
                                                            className="w-full px-2 py-1.5 text-sm border border-[#E5E5E5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#C6A75E]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-[#663F23] uppercase tracking-wider">
                                                    Rotation
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        value={Math.round(selectedItem.rotation)}
                                                        onChange={(e) =>
                                                            updateSelectedProperty(
                                                                "rotation",
                                                                parseFloat(e.target.value) || 0
                                                            )
                                                        }
                                                        className="flex-1 px-2 py-1.5 text-sm border border-[#E5E5E5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#C6A75E]"
                                                    />
                                                    <span className="text-xs text-[#1C1C1C]/40">deg</span>
                                                    <button
                                                        onClick={rotateSelected}
                                                        className="p-1.5 border border-[#E5E5E5] rounded hover:bg-[#F5F1E8] transition-colors"
                                                        title="Rotate +15"
                                                    >
                                                        <RotateCw size={14} className="text-[#663F23]" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-[#663F23] uppercase tracking-wider">
                                                    Dimensions
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-[#1C1C1C]/50 mb-1 block">
                                                            Width
                                                        </label>
                                                        <div className="px-2 py-1.5 text-sm border border-[#E5E5E5] rounded bg-[#F5F1E8] text-[#1C1C1C]/60">
                                                            {selectedItem.width.toFixed(1)} cm
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-[#1C1C1C]/50 mb-1 block">
                                                            Depth
                                                        </label>
                                                        <div className="px-2 py-1.5 text-sm border border-[#E5E5E5] rounded bg-[#F5F1E8] text-[#1C1C1C]/60">
                                                            {selectedItem.depth.toFixed(1)} cm
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-[#E5E5E5]">
                                                <button
                                                    onClick={deleteSelected}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    Remove from layout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#E5E5E5] p-3">
                            <div className="text-xs text-[#1C1C1C]/40 space-y-0.5">
                                <p>
                                    <span className="font-medium text-[#1C1C1C]/60">R</span> Rotate
                                    &nbsp;&nbsp;
                                    <span className="font-medium text-[#1C1C1C]/60">Del</span> Delete
                                    &nbsp;&nbsp;
                                    <span className="font-medium text-[#1C1C1C]/60">Esc</span> Deselect
                                </p>
                                <p>
                                    <span className="font-medium text-[#1C1C1C]/60">Arrows</span> Move
                                    &nbsp;&nbsp;
                                    <span className="font-medium text-[#1C1C1C]/60">Ctrl+S</span> Save
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TwoDLayoutEditor() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#663F23]" />
                </div>
            }
        >
            <TwoDLayoutEditorInner />
        </Suspense>
    );
}
