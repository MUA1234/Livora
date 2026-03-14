"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Plane, Text, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
    Box as BoxIcon,
    Maximize2, Minimize2,
    Sun, Sunset, Moon, Lightbulb,
    ChevronDown, ChevronUp,
    X, Palette, Ruler, Package, ChevronLeft,
    Eye, Camera, Crosshair, ArrowUp, CornerUpRight,
    Loader2, AlertCircle,
    PaintBucket, Grid3X3, Paintbrush, Square,
} from "lucide-react";
import api from "@/lib/api";

interface FurnitureLayoutItem {
    productId: string;
    position: { x: number; y: number; z: number };
    rotation: number;
}

interface ProductData {
    _id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    description?: string;
    width?: number;
    height?: number;
    depth?: number;
    colors: string[];
    materials: string[];
    images: { imageUrl: string; sortOrder: number }[];
}

interface RoomDimensions {
    length: number;
    width: number;
    height: number;
    unit: string;
}

interface RoomData {
    _id: string;
    name: string;
    dimensions: RoomDimensions;
    shape: string;
    flooring?: { type: string; material?: string };
}

interface DesignData {
    _id: string;
    name: string;
    roomId: string;
    layoutData: {
        furniture: FurnitureLayoutItem[];
    };
    status: string;
}

interface SceneFurniture {
    id: string;
    productId: string;
    product: ProductData;
    position: THREE.Vector3;
    rotation: number;
    dimensions: { width: number; height: number; depth: number };
}

type LightingMode = "daylight" | "sunset" | "night" | "studio";
type CameraPreset = "top" | "front" | "side" | "corner";
type FloorType = "tiles" | "hardwood" | "marble" | "concrete" | "carpet";

interface WallColors {
    back: string;
    front: string;
    left: string;
    right: string;
}

interface FloorSettings {
    type: FloorType;
    color: string;
    groutColor?: string;
}

const WALL_PRESETS = [
    { name: "White", color: "#FFFFFF" },
    { name: "Cream", color: "#FFF8E7" },
    { name: "Warm Gray", color: "#D6CFC7" },
    { name: "Sage Green", color: "#B2C9AD" },
    { name: "Sky Blue", color: "#B8D4E3" },
    { name: "Blush Pink", color: "#F2D4D7" },
    { name: "Lavender", color: "#D5CCE6" },
    { name: "Sand", color: "#E8D5B7" },
    { name: "Charcoal", color: "#4A4A4A" },
    { name: "Navy", color: "#2C3E6B" },
    { name: "Olive", color: "#6B7B3A" },
    { name: "Terracotta", color: "#C67B5C" },
];

const FLOOR_PRESETS: { type: FloorType; label: string; icon: string; colors: { name: string; color: string; grout?: string }[] }[] = [
    {
        type: "tiles",
        label: "Tiles",
        icon: "grid",
        colors: [
            { name: "Beige", color: "#D4B896", grout: "#A09080" },
            { name: "White", color: "#F0EDE8", grout: "#C8C0B8" },
            { name: "Gray", color: "#A0A0A0", grout: "#707070" },
            { name: "Terracotta", color: "#C4785A", grout: "#8A5A40" },
            { name: "Slate", color: "#708090", grout: "#4A5A6A" },
            { name: "Marble White", color: "#F5F0E8", grout: "#D0C8C0" },
        ],
    },
    {
        type: "hardwood",
        label: "Hardwood",
        icon: "lines",
        colors: [
            { name: "Oak", color: "#C49A6C" },
            { name: "Walnut", color: "#5C4033" },
            { name: "Cherry", color: "#8B4513" },
            { name: "Maple", color: "#E8C88A" },
            { name: "Ebony", color: "#3C2415" },
            { name: "Ash", color: "#D2B48C" },
        ],
    },
    {
        type: "marble",
        label: "Marble",
        icon: "smooth",
        colors: [
            { name: "Carrara", color: "#F0EDE5" },
            { name: "Calacatta", color: "#F7F3EB" },
            { name: "Emperador", color: "#6B4226" },
            { name: "Black", color: "#2C2C2C" },
            { name: "Green", color: "#4A6B4A" },
            { name: "Cream", color: "#F5E6D0" },
        ],
    },
    {
        type: "concrete",
        label: "Concrete",
        icon: "rough",
        colors: [
            { name: "Natural", color: "#B0A898" },
            { name: "Light", color: "#D0C8C0" },
            { name: "Dark", color: "#6A6460" },
            { name: "Polished", color: "#A8A098" },
        ],
    },
    {
        type: "carpet",
        label: "Carpet",
        icon: "soft",
        colors: [
            { name: "Beige", color: "#D2C4A8" },
            { name: "Gray", color: "#9A9A9A" },
            { name: "Navy", color: "#2C3E6B" },
            { name: "Burgundy", color: "#722F37" },
            { name: "Forest", color: "#3A5A3A" },
            { name: "Cream", color: "#F5E8D0" },
        ],
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    sofa: "#8B5A2B",
    chair: "#6B8E23",
    table: "#A0522D",
    bed: "#4A6FA5",
    wardrobe: "#8B6914",
    lamp: "#DAA520",
    shelf: "#CD853F",
    bookshelf: "#CD853F",
    desk: "#7B68EE",
    cabinet: "#708090",
    dresser: "#B8860B",
    default: "#9B7653",
};

function getCategoryColor(category: string): string {
    const lower = category?.toLowerCase() || "";
    for (const key of Object.keys(CATEGORY_COLORS)) {
        if (lower.includes(key)) return CATEGORY_COLORS[key];
    }
    return CATEGORY_COLORS.default;
}

function convertToMeters(value: number, unit: string): number {
    switch (unit) {
        case "cm": return value / 100;
        case "inch": return value / 39.37;
        case "ft": return value * 0.3048;
        case "m": return value;
        default: return value;
    }
}

function cmToMeters(cm: number): number {
    return cm / 100;
}

function createFloorTexture(
    type: FloorType,
    color: string,
    groutColor: string,
    size: number
): THREE.CanvasTexture {
    const res = 512;
    const canvas = document.createElement("canvas");
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, res, res);

    switch (type) {
        case "tiles": {
            const tileCount = 8;
            const tileSize = res / tileCount;
            const groutW = 3;
            ctx.fillStyle = groutColor;
            for (let i = 0; i <= tileCount; i++) {
                ctx.fillRect(i * tileSize - groutW / 2, 0, groutW, res);
                ctx.fillRect(0, i * tileSize - groutW / 2, res, groutW);
            }
            // Subtle shade variation per tile
            for (let r = 0; r < tileCount; r++) {
                for (let c = 0; c < tileCount; c++) {
                    const shade = ((r + c) % 3 === 0) ? "rgba(0,0,0,0.03)" : ((r + c) % 3 === 1) ? "rgba(255,255,255,0.03)" : "transparent";
                    ctx.fillStyle = shade;
                    ctx.fillRect(c * tileSize + groutW, r * tileSize + groutW, tileSize - groutW * 2, tileSize - groutW * 2);
                }
            }
            break;
        }
        case "hardwood": {
            const plankH = 64;
            const plankCount = Math.ceil(res / plankH);
            for (let i = 0; i < plankCount; i++) {
                const y = i * plankH;
                // Plank gap
                ctx.fillStyle = "rgba(0,0,0,0.15)";
                ctx.fillRect(0, y, res, 1.5);
                // Stagger: offset every other row
                const offset = (i % 2 === 0) ? 0 : res / 3;
                ctx.fillStyle = "rgba(0,0,0,0.08)";
                ctx.fillRect(offset + res / 3, y, 1.5, plankH);
                ctx.fillRect(offset + (res * 2) / 3, y, 1.5, plankH);
                // Wood grain lines
                ctx.strokeStyle = "rgba(0,0,0,0.04)";
                ctx.lineWidth = 0.5;
                for (let g = 0; g < 6; g++) {
                    ctx.beginPath();
                    const gy = y + 4 + g * 10 + Math.random() * 3;
                    ctx.moveTo(0, gy);
                    ctx.bezierCurveTo(res * 0.3, gy + Math.random() * 4 - 2, res * 0.7, gy + Math.random() * 4 - 2, res, gy);
                    ctx.stroke();
                }
                // Slight color variation per plank
                const variation = (i % 3 === 0) ? "rgba(0,0,0,0.02)" : (i % 3 === 1) ? "rgba(255,255,255,0.03)" : "transparent";
                ctx.fillStyle = variation;
                ctx.fillRect(0, y + 2, res, plankH - 3);
            }
            break;
        }
        case "marble": {
            // Subtle veining
            ctx.globalAlpha = 0.08;
            for (let v = 0; v < 12; v++) {
                ctx.strokeStyle = v % 2 === 0 ? "rgba(80,80,80,1)" : "rgba(60,60,60,1)";
                ctx.lineWidth = 0.5 + Math.random() * 1.5;
                ctx.beginPath();
                let x = Math.random() * res;
                let y = Math.random() * res;
                ctx.moveTo(x, y);
                for (let s = 0; s < 8; s++) {
                    x += (Math.random() - 0.5) * 120;
                    y += (Math.random() - 0.5) * 120;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            break;
        }
        case "concrete": {
            // Speckle noise
            const imageData = ctx.getImageData(0, 0, res, res);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 16;
                imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
                imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
                imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);
            break;
        }
        case "carpet": {
            // Fabric-like texture with tiny dots
            ctx.globalAlpha = 0.06;
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * res;
                const y = Math.random() * res;
                ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
                ctx.fillRect(x, y, 1.5, 1.5);
            }
            ctx.globalAlpha = 1;
            break;
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    const repeatFactor = type === "tiles" ? 1 : type === "hardwood" ? 2 : 1;
    tex.repeat.set(size * repeatFactor * 0.5, size * repeatFactor * 0.5);
    return tex;
}

function getFloorMaterialProps(type: FloorType): { roughness: number; metalness: number } {
    switch (type) {
        case "tiles": return { roughness: 0.6, metalness: 0.05 };
        case "hardwood": return { roughness: 0.7, metalness: 0.02 };
        case "marble": return { roughness: 0.2, metalness: 0.15 };
        case "concrete": return { roughness: 0.9, metalness: 0.0 };
        case "carpet": return { roughness: 1.0, metalness: 0.0 };
        default: return { roughness: 0.8, metalness: 0.1 };
    }
}

function FloorPlane({
    length,
    width,
    floorSettings,
}: {
    length: number;
    width: number;
    floorSettings: FloorSettings;
}) {
    const texture = useMemo(() => {
        if (typeof document === "undefined") return null;
        return createFloorTexture(
            floorSettings.type,
            floorSettings.color,
            floorSettings.groutColor || "#A09080",
            Math.max(length, width)
        );
    }, [floorSettings.type, floorSettings.color, floorSettings.groutColor, length, width]);

    const matProps = getFloorMaterialProps(floorSettings.type);

    return (
        <Plane
            args={[length, width]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[length / 2, 0, width / 2]}
            receiveShadow
        >
            <meshStandardMaterial
                map={texture}
                color={texture ? "#ffffff" : floorSettings.color}
                roughness={matProps.roughness}
                metalness={matProps.metalness}
            />
        </Plane>
    );
}

function RoomBox({
    length,
    width,
    height,
    wallColors,
    floorSettings,
}: {
    length: number;
    width: number;
    height: number;
    wallColors: WallColors;
    floorSettings: FloorSettings;
}) {
    const wallThickness = 0.05;
    const wallOpacity = 0.55;

    return (
        <group>
            <FloorPlane length={length} width={width} floorSettings={floorSettings} />

            {/* Back wall (z=0) */}
            <Box
                args={[length, height, wallThickness]}
                position={[length / 2, height / 2, 0]}
            >
                <meshStandardMaterial
                    color={wallColors.back}
                    transparent
                    opacity={wallOpacity}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                />
            </Box>

            {/* Front wall (z=width) */}
            <Box
                args={[length, height, wallThickness]}
                position={[length / 2, height / 2, width]}
            >
                <meshStandardMaterial
                    color={wallColors.front}
                    transparent
                    opacity={wallOpacity}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                />
            </Box>

            {/* Left wall (x=0) */}
            <Box
                args={[wallThickness, height, width]}
                position={[0, height / 2, width / 2]}
            >
                <meshStandardMaterial
                    color={wallColors.left}
                    transparent
                    opacity={wallOpacity}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                />
            </Box>

            {/* Right wall (x=length) */}
            <Box
                args={[wallThickness, height, width]}
                position={[length, height / 2, width / 2]}
            >
                <meshStandardMaterial
                    color={wallColors.right}
                    transparent
                    opacity={wallOpacity}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                />
            </Box>

            <gridHelper
                args={[Math.max(length, width) * 2, Math.max(length, width) * 4, "#ccc", "#e5e5e5"]}
                position={[length / 2, 0.001, width / 2]}
            />
        </group>
    );
}

function FurnitureBox({
    item,
    isSelected,
    onSelect,
}: {
    item: SceneFurniture;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const outlineRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const color = getCategoryColor(item.product.category);
    const { width, height, depth } = item.dimensions;

    useFrame(() => {
        if (outlineRef.current) {
            outlineRef.current.visible = isSelected;
        }
    });

    return (
        <group
            position={[item.position.x, item.position.y + height / 2, item.position.z]}
            rotation={[0, (item.rotation * Math.PI) / 180, 0]}
        >
            <Box
                ref={meshRef}
                args={[width, height, depth]}
                castShadow
                receiveShadow
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = "auto";
                }}
            >
                <meshStandardMaterial
                    color={hovered ? new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.2) : color}
                    roughness={0.6}
                    metalness={0.1}
                />
            </Box>

            <Box ref={outlineRef} args={[width + 0.02, height + 0.02, depth + 0.02]}>
                <meshBasicMaterial color="#C6A75E" wireframe transparent opacity={0.8} />
            </Box>

            <Text
                position={[0, height / 2 + 0.15, 0]}
                fontSize={0.12}
                color="#1C1C1C"
                anchorX="center"
                anchorY="bottom"
                maxWidth={width + 0.5}
            >
                {item.product.name}
            </Text>
        </group>
    );
}

function SceneLighting({
    mode,
    intensity,
}: {
    mode: LightingMode;
    intensity: number;
}) {
    switch (mode) {
        case "daylight":
            return (
                <>
                    <ambientLight intensity={0.6 * intensity} color="#ffffff" />
                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={1.2 * intensity}
                        color="#fffaf0"
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <directionalLight position={[-3, 4, -3]} intensity={0.3 * intensity} color="#e8f4fd" />
                </>
            );
        case "sunset":
            return (
                <>
                    <ambientLight intensity={0.3 * intensity} color="#ff8c42" />
                    <directionalLight
                        position={[8, 3, 2]}
                        intensity={1.0 * intensity}
                        color="#ff6b35"
                        castShadow
                    />
                    <directionalLight position={[-2, 5, -2]} intensity={0.2 * intensity} color="#ffd700" />
                    <pointLight position={[0, 4, 0]} intensity={0.4 * intensity} color="#ff9f43" />
                </>
            );
        case "night":
            return (
                <>
                    <ambientLight intensity={0.15 * intensity} color="#1a237e" />
                    <directionalLight
                        position={[3, 6, 3]}
                        intensity={0.3 * intensity}
                        color="#90caf9"
                        castShadow
                    />
                    <pointLight position={[0, 3, 0]} intensity={0.5 * intensity} color="#bbdefb" distance={10} />
                </>
            );
        case "studio":
            return (
                <>
                    <ambientLight intensity={0.5 * intensity} color="#ffffff" />
                    <pointLight position={[4, 6, 4]} intensity={0.8 * intensity} color="#ffffff" castShadow />
                    <pointLight position={[-4, 6, -4]} intensity={0.6 * intensity} color="#ffffff" />
                    <pointLight position={[4, 6, -4]} intensity={0.4 * intensity} color="#f5f5f5" />
                    <pointLight position={[-4, 6, 4]} intensity={0.4 * intensity} color="#f5f5f5" />
                </>
            );
        default:
            return <ambientLight intensity={0.5 * intensity} />;
    }
}

function CameraController({
    preset,
    focusTarget,
    roomLength,
    roomWidth,
    roomHeight,
    onPresetConsumed,
}: {
    preset: CameraPreset | null;
    focusTarget: THREE.Vector3 | null;
    roomLength: number;
    roomWidth: number;
    roomHeight: number;
    onPresetConsumed: () => void;
}) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const maxDim = Math.max(roomLength, roomWidth, roomHeight);
    const centerX = roomLength / 2;
    const centerZ = roomWidth / 2;

    useEffect(() => {
        if (!preset) return;

        const dist = maxDim * 1.5;
        let pos: THREE.Vector3;
        const target = new THREE.Vector3(centerX, roomHeight * 0.3, centerZ);

        switch (preset) {
            case "top":
                pos = new THREE.Vector3(centerX, maxDim * 2, centerZ + 0.01);
                break;
            case "front":
                pos = new THREE.Vector3(centerX, roomHeight * 0.5, -dist);
                break;
            case "side":
                pos = new THREE.Vector3(-dist, roomHeight * 0.5, centerZ);
                break;
            case "corner":
            default:
                pos = new THREE.Vector3(centerX + dist, dist * 0.8, centerZ + dist);
                break;
        }

        camera.position.copy(pos);
        if (controlsRef.current) {
            controlsRef.current.target.copy(target);
            controlsRef.current.update();
        }
        onPresetConsumed();
    }, [preset, camera, centerX, centerZ, roomHeight, maxDim, onPresetConsumed]);

    useEffect(() => {
        if (!focusTarget) return;

        const offset = new THREE.Vector3(2, 2, 2);
        camera.position.copy(focusTarget.clone().add(offset));
        if (controlsRef.current) {
            controlsRef.current.target.copy(focusTarget);
            controlsRef.current.update();
        }
    }, [focusTarget, camera]);

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.1}
            minDistance={0.5}
            maxDistance={maxDim * 4}
            maxPolarAngle={Math.PI / 2 - 0.05}
        />
    );
}

function ThreeDScene({
    furniture,
    roomDimensions,
    lightingMode,
    lightingIntensity,
    selectedId,
    onSelect,
    cameraPreset,
    focusTarget,
    onPresetConsumed,
    wallColors,
    floorSettings,
}: {
    furniture: SceneFurniture[];
    roomDimensions: { length: number; width: number; height: number };
    lightingMode: LightingMode;
    lightingIntensity: number;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    cameraPreset: CameraPreset | null;
    focusTarget: THREE.Vector3 | null;
    onPresetConsumed: () => void;
    wallColors: WallColors;
    floorSettings: FloorSettings;
}) {
    const { length, width, height } = roomDimensions;

    return (
        <>
            <color attach="background" args={["#EFEBE0"]} />
            <fog attach="fog" args={["#EFEBE0", 15, 30]} />

            <SceneLighting mode={lightingMode} intensity={lightingIntensity} />

            <CameraController
                preset={cameraPreset}
                focusTarget={focusTarget}
                roomLength={length}
                roomWidth={width}
                roomHeight={height}
                onPresetConsumed={onPresetConsumed}
            />

            <RoomBox length={length} width={width} height={height} wallColors={wallColors} floorSettings={floorSettings} />

            {furniture.map((item) => (
                <FurnitureBox
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={onSelect}
                />
            ))}

            <ContactShadows
                position={[length / 2, 0.01, width / 2]}
                opacity={0.4}
                scale={Math.max(length, width) * 2}
                blur={2}
                far={10}
            />

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[length / 2, -0.01, width / 2]}
                onClick={() => onSelect(null)}
            >
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial visible={false} />
            </mesh>
        </>
    );
}

function ThreeDViewerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get("designId");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [design, setDesign] = useState<DesignData | null>(null);
    const [room, setRoom] = useState<RoomData | null>(null);
    const [furniture, setFurniture] = useState<SceneFurniture[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [lightingMode, setLightingMode] = useState<LightingMode>("daylight");
    const [lightingIntensity, setLightingIntensity] = useState(0.85);
    const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>("corner");
    const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [furnitureListOpen, setFurnitureListOpen] = useState(true);
    const [wallColors, setWallColors] = useState<WallColors>({ back: "#F5F1E8", front: "#F5F1E8", left: "#F5F1E8", right: "#F5F1E8" });
    const [floorSettings, setFloorSettings] = useState<FloorSettings>({ type: "tiles", color: "#D4B896", groutColor: "#A09080" });
    const [paintAllWalls, setPaintAllWalls] = useState(true);
    const [roomCustomOpen, setRoomCustomOpen] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedItem = useMemo(
        () => furniture.find((f) => f.id === selectedId) || null,
        [furniture, selectedId]
    );

    const roomDimensions = useMemo(() => {
        if (!room) return { length: 5, width: 4, height: 3 };
        const dims = room.dimensions;
        return {
            length: convertToMeters(dims.length, dims.unit),
            width: convertToMeters(dims.width, dims.unit),
            height: convertToMeters(dims.height, dims.unit),
        };
    }, [room]);

    useEffect(() => {
        if (!designId) {
            setError("No design ID provided. Please go back and select a design.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const designRes = await api.get(`/api/designs/${designId}`);
                const designData: DesignData = designRes.data.data || designRes.data;
                setDesign(designData);

                const roomRes = await api.get(`/api/rooms/${designData.roomId}`);
                const roomData: RoomData = roomRes.data.data || roomRes.data;
                setRoom(roomData);

                const furnitureItems = designData.layoutData?.furniture || [];

                const productPromises = furnitureItems.map((item: FurnitureLayoutItem) =>
                    api.get(`/api/products/${item.productId}`).catch(() => null)
                );
                const productResults = await Promise.all(productPromises);

                const sceneFurniture: SceneFurniture[] = [];
                furnitureItems.forEach((item: FurnitureLayoutItem, index: number) => {
                    const productRes = productResults[index];
                    if (!productRes) return;

                    const product: ProductData = productRes.data.data || productRes.data;
                    const w = product.width ? cmToMeters(product.width) : 0.6;
                    const h = product.height ? cmToMeters(product.height) : 0.6;
                    const d = product.depth ? cmToMeters(product.depth) : 0.6;

                    // DB position is top-left corner (from 2D editor), offset by half dims to get center for Three.js
                    sceneFurniture.push({
                        id: `${product._id}-${index}`,
                        productId: product._id,
                        product,
                        position: new THREE.Vector3(
                            (item.position.x || 0) + w / 2,
                            item.position.y || 0,
                            (item.position.z || item.position.y || 0) + d / 2
                        ),
                        rotation: item.rotation || 0,
                        dimensions: { width: w, height: h, depth: d },
                    });
                });

                setFurniture(sceneFurniture);
            } catch (err: any) {
                const msg = err.response?.data?.message || "Failed to load design data.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [designId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedId(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleToggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const handleFocusItem = useCallback((item: SceneFurniture) => {
        setSelectedId(item.id);
        setFocusTarget(
            new THREE.Vector3(
                item.position.x,
                item.position.y + item.dimensions.height / 2,
                item.position.z
            )
        );
    }, []);

    const handlePresetConsumed = useCallback(() => {
        setCameraPreset(null);
    }, []);

    const handleSelect = useCallback((id: string | null) => {
        setSelectedId(id);
        if (!id) setFocusTarget(null);
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#663F23]" />
                    <p className="text-sm font-medium text-[#1C1C1C]/50">Loading 3D viewer...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
                <div className="flex flex-col items-center gap-6 max-w-md text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1C1C1C]">Unable to Load Viewer</h1>
                    <p className="text-[#1C1C1C]/50">{error}</p>
                    <Link
                        href="/admin/2d-layout"
                        className="px-6 py-3 bg-[#663F23] text-white rounded-xl font-medium hover:bg-[#52321A] transition-colors"
                    >
                        Back to Editor
                    </Link>
                </div>
            </div>
        );
    }

    const lightingModes: { key: LightingMode; label: string; icon: React.ReactNode }[] = [
        { key: "daylight", label: "Daylight", icon: <Sun size={14} /> },
        { key: "sunset", label: "Sunset", icon: <Sunset size={14} /> },
        { key: "night", label: "Night", icon: <Moon size={14} /> },
        { key: "studio", label: "Studio", icon: <Lightbulb size={14} /> },
    ];

    const cameraPresets: { key: CameraPreset; label: string; icon: React.ReactNode }[] = [
        { key: "corner", label: "Corner", icon: <CornerUpRight size={14} /> },
        { key: "top", label: "Top", icon: <ArrowUp size={14} /> },
        { key: "front", label: "Front", icon: <Eye size={14} /> },
        { key: "side", label: "Side", icon: <Crosshair size={14} /> },
    ];

    const intensityPercent = Math.round(((lightingIntensity - 0.2) / (1.5 - 0.2)) * 100);

    return (
        <div ref={containerRef} className="flex h-screen w-full bg-[#f8f6f0] font-sans text-[#1C1C1C] overflow-hidden">
            <div className="w-[300px] bg-[#fdfbf6] border-r border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.02)] h-full overflow-y-auto hidden-scrollbar">
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#7B4B29] rounded-lg flex items-center justify-center text-white shrink-0">
                        <BoxIcon size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#1C1C1C] leading-none">3D Viewer</h1>
                        <p className="text-xs text-[#8C8C8C] mt-1 font-medium">Livora Studio</p>
                    </div>
                </div>

                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Camera size={12} />
                        Camera Views
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {cameraPresets.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => setCameraPreset(p.key)}
                                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs justify-center transition-colors ${
                                    cameraPreset === p.key
                                        ? "bg-[#7B4B29] text-white shadow-sm"
                                        : "bg-[#F4F1ED] text-[#1C1C1C] hover:bg-[#EBE7DF] border border-[#EBE7DF]"
                                }`}
                            >
                                <span className={cameraPreset === p.key ? "text-white" : "text-[#6C6C6C]"}>
                                    {p.icon}
                                </span>
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-4">Lighting</h2>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {lightingModes.map((m) => (
                            <button
                                key={m.key}
                                onClick={() => setLightingMode(m.key)}
                                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs justify-center transition-colors ${
                                    lightingMode === m.key
                                        ? "bg-[#7B4B29] text-white shadow-sm"
                                        : "bg-[#F4F1ED] text-[#1C1C1C] hover:bg-[#EBE7DF]"
                                }`}
                            >
                                <span className={lightingMode === m.key ? "text-white" : "text-[#6C6C6C]"}>
                                    {m.icon}
                                </span>
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-[#8C8C8C]">Intensity</span>
                            <span className="text-xs font-bold text-[#1C1C1C]">{intensityPercent}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.2"
                            max="1.5"
                            step="0.05"
                            value={lightingIntensity}
                            onChange={(e) => setLightingIntensity(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#7B4B29]"
                        />
                    </div>
                </div>

                {/* Room Customization Section */}
                <div className="px-6 py-6 border-b border-[#E5E5E5]">
                    <button
                        onClick={() => setRoomCustomOpen(!roomCustomOpen)}
                        className="flex justify-between items-center mb-4 cursor-pointer w-full"
                    >
                        <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider flex items-center gap-2">
                            <PaintBucket size={12} />
                            Room Customization
                        </h2>
                        {roomCustomOpen ? (
                            <ChevronUp size={14} className="text-[#A8A8A8]" />
                        ) : (
                            <ChevronDown size={14} className="text-[#A8A8A8]" />
                        )}
                    </button>

                    {roomCustomOpen && (
                        <div className="space-y-5">
                            {/* Wall Colors */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[#663F23] flex items-center gap-1.5">
                                        <Paintbrush size={12} />
                                        Wall Paint
                                    </span>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={paintAllWalls}
                                            onChange={(e) => setPaintAllWalls(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-[#ccc] text-[#7B4B29] focus:ring-[#7B4B29]"
                                        />
                                        <span className="text-[10px] text-[#8C8C8C] font-medium">All walls</span>
                                    </label>
                                </div>

                                {/* Color presets grid */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {WALL_PRESETS.map((preset) => (
                                        <button
                                            key={preset.color}
                                            title={preset.name}
                                            onClick={() => {
                                                if (paintAllWalls) {
                                                    setWallColors({ back: preset.color, front: preset.color, left: preset.color, right: preset.color });
                                                } else {
                                                    setWallColors((prev) => ({ ...prev, back: preset.color }));
                                                }
                                            }}
                                            className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110"
                                            style={{
                                                backgroundColor: preset.color,
                                                borderColor: wallColors.back === preset.color ? "#7B4B29" : "#E5E5E5",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Custom color picker */}
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-[10px] text-[#8C8C8C] font-medium w-16">Custom:</label>
                                    <input
                                        type="color"
                                        value={wallColors.back}
                                        onChange={(e) => {
                                            if (paintAllWalls) {
                                                setWallColors({ back: e.target.value, front: e.target.value, left: e.target.value, right: e.target.value });
                                            } else {
                                                setWallColors((prev) => ({ ...prev, back: e.target.value }));
                                            }
                                        }}
                                        className="w-8 h-6 rounded border border-[#E5E5E5] cursor-pointer"
                                    />
                                    <span className="text-[10px] text-[#8C8C8C] font-mono uppercase">{wallColors.back}</span>
                                </div>

                                {/* Per-wall controls (when "All walls" is unchecked) */}
                                {!paintAllWalls && (
                                    <div className="mt-3 space-y-2 p-3 bg-[#F4F1ED] rounded-lg">
                                        {(["back", "front", "left", "right"] as const).map((wall) => (
                                            <div key={wall} className="flex items-center gap-2">
                                                <span className="text-[10px] font-semibold text-[#8C8C8C] capitalize w-10">{wall}</span>
                                                <input
                                                    type="color"
                                                    value={wallColors[wall]}
                                                    onChange={(e) => setWallColors((prev) => ({ ...prev, [wall]: e.target.value }))}
                                                    className="w-7 h-5 rounded border border-[#E5E5E5] cursor-pointer"
                                                />
                                                <div className="flex flex-wrap gap-1">
                                                    {WALL_PRESETS.slice(0, 6).map((p) => (
                                                        <button
                                                            key={p.color}
                                                            title={p.name}
                                                            onClick={() => setWallColors((prev) => ({ ...prev, [wall]: p.color }))}
                                                            className="w-4 h-4 rounded border transition-all hover:scale-110"
                                                            style={{
                                                                backgroundColor: p.color,
                                                                borderColor: wallColors[wall] === p.color ? "#7B4B29" : "#ddd",
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Floor Type */}
                            <div>
                                <span className="text-xs font-bold text-[#663F23] flex items-center gap-1.5 mb-3">
                                    <Grid3X3 size={12} />
                                    Floor Type
                                </span>

                                {/* Floor type buttons */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {FLOOR_PRESETS.map((fp) => (
                                        <button
                                            key={fp.type}
                                            onClick={() => {
                                                const firstColor = fp.colors[0];
                                                setFloorSettings({
                                                    type: fp.type,
                                                    color: firstColor.color,
                                                    groutColor: firstColor.grout,
                                                });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                                                floorSettings.type === fp.type
                                                    ? "bg-[#7B4B29] text-white shadow-sm"
                                                    : "bg-[#F4F1ED] text-[#1C1C1C] hover:bg-[#EBE7DF]"
                                            }`}
                                        >
                                            {fp.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Floor color options for selected type */}
                                {(() => {
                                    const currentPreset = FLOOR_PRESETS.find((f) => f.type === floorSettings.type);
                                    if (!currentPreset) return null;
                                    return (
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentPreset.colors.map((c) => (
                                                <button
                                                    key={c.color}
                                                    title={c.name}
                                                    onClick={() =>
                                                        setFloorSettings({
                                                            type: floorSettings.type,
                                                            color: c.color,
                                                            groutColor: c.grout,
                                                        })
                                                    }
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all border"
                                                    style={{
                                                        backgroundColor: floorSettings.color === c.color ? c.color + "30" : "#F4F1ED",
                                                        borderColor: floorSettings.color === c.color ? "#7B4B29" : "#E5E5E5",
                                                        color: floorSettings.color === c.color ? "#7B4B29" : "#8C8C8C",
                                                    }}
                                                >
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-sm border border-[#ddd]"
                                                        style={{ backgroundColor: c.color }}
                                                    />
                                                    {c.name}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-6">
                    <button
                        onClick={() => setFurnitureListOpen(!furnitureListOpen)}
                        className="flex justify-between items-center mb-4 cursor-pointer w-full"
                    >
                        <h2 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                            Furniture in Scene ({furniture.length})
                        </h2>
                        {furnitureListOpen ? (
                            <ChevronUp size={14} className="text-[#A8A8A8]" />
                        ) : (
                            <ChevronDown size={14} className="text-[#A8A8A8]" />
                        )}
                    </button>
                    {furnitureListOpen && (
                        <div className="flex flex-col gap-2">
                            {furniture.length === 0 && (
                                <p className="text-xs text-[#A8A8A8] text-center py-4">No furniture placed yet.</p>
                            )}
                            {furniture.map((item) => {
                                const isActive = selectedId === item.id;
                                const wCm = Math.round(item.dimensions.width * 100);
                                const hCm = Math.round(item.dimensions.height * 100);
                                const dCm = Math.round(item.dimensions.depth * 100);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleFocusItem(item)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-left w-full transition-colors ${
                                            isActive
                                                ? "bg-[#F4F1ED] border border-[#C6A75E]"
                                                : "bg-white border border-transparent hover:border-[#EBE7DF]"
                                        }`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: getCategoryColor(item.product.category) + "20" }}
                                        >
                                            <Package
                                                size={16}
                                                style={{ color: getCategoryColor(item.product.category) }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xs font-bold text-[#1C1C1C] truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-[10px] text-[#8C8C8C] mt-0.5">
                                                {wCm} x {hCm} x {dCm} cm
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-[#EFEBE0] relative">
                <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href={designId ? `/admin/2d-layout?designId=${designId}` : "/admin/2d-layout"}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1C1C1C] hover:bg-gray-100 shadow-sm transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <h1 className="text-[17px] font-bold text-[#1C1C1C]">
                            {design?.name || "3D Viewer"}
                        </h1>
                        <span className="px-2.5 py-1 text-[10px] font-bold text-[#663F23] bg-[#663F23]/10 rounded-full capitalize">
                            {design?.status || "draft"}
                        </span>
                    </div>
                    <button
                        onClick={handleToggleFullscreen}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#A8A8A8] hover:text-[#1C1C1C] shadow-sm transition-colors"
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </header>

                <div className="absolute top-20 left-8 flex flex-col gap-2 z-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-[#A8A8A8] uppercase">Light:</span>
                        <span className="text-[11px] font-bold text-[#1C1C1C] capitalize">{lightingMode}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-[#A8A8A8] uppercase">Room:</span>
                        <span className="text-[11px] font-bold text-[#1C1C1C]">{room?.name || "Unknown"}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <Canvas
                        shadows
                        camera={{
                            position: [
                                roomDimensions.length * 1.2,
                                roomDimensions.height * 1.5,
                                roomDimensions.width * 1.2,
                            ],
                            fov: 50,
                            near: 0.1,
                            far: 100,
                        }}
                        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                    >
                        <ThreeDScene
                            furniture={furniture}
                            roomDimensions={roomDimensions}
                            lightingMode={lightingMode}
                            lightingIntensity={lightingIntensity}
                            selectedId={selectedId}
                            onSelect={handleSelect}
                            cameraPreset={cameraPreset}
                            focusTarget={focusTarget}
                            onPresetConsumed={handlePresetConsumed}
                            wallColors={wallColors}
                            floorSettings={floorSettings}
                        />
                    </Canvas>
                </div>
            </div>

            {selectedItem && (
                <div className="w-[320px] bg-[#fdfbf6] border-l border-[#E5E5E5] flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)] h-full overflow-y-auto hidden-scrollbar">
                    <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: getCategoryColor(selectedItem.product.category) + "20" }}
                            >
                                <Palette
                                    size={18}
                                    style={{ color: getCategoryColor(selectedItem.product.category) }}
                                />
                            </div>
                            <div>
                                <h2 className="text-[13px] font-bold text-[#1C1C1C] leading-none">
                                    {selectedItem.product.name}
                                </h2>
                                <p className="text-[11px] text-[#8C8C8C] mt-1 font-medium capitalize">
                                    {selectedItem.product.category}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedId(null)}
                            className="text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-6 border-b border-[#E5E5E5]">
                        <div className="flex items-center gap-2 mb-6">
                            <Ruler size={14} className="text-[#A8A8A8]" />
                            <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                Dimensions
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Width", value: selectedItem.dimensions.width },
                                { label: "Height", value: selectedItem.dimensions.height },
                                { label: "Depth", value: selectedItem.dimensions.depth },
                            ].map((dim) => (
                                <div key={dim.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-[#8C8C8C]">{dim.label}</span>
                                        <span className="text-xs font-bold text-[#1C1C1C]">
                                            {Math.round(dim.value * 100)} cm
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full relative">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-[#D4C3A3] rounded-full"
                                            style={{ width: `${Math.min((dim.value / 3) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedItem.product.colors && selectedItem.product.colors.length > 0 && (
                        <div className="p-6 border-b border-[#E5E5E5]">
                            <div className="flex items-center gap-2 mb-5">
                                <Palette size={14} className="text-[#A8A8A8]" />
                                <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                    Colors
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedItem.product.colors.map((color, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[#F4F1ED] rounded-lg">
                                        <div
                                            className="w-4 h-4 rounded-full border border-[#E5E5E5]"
                                            style={{
                                                backgroundColor: color.startsWith("#") ? color : undefined,
                                            }}
                                        />
                                        <span className="text-xs font-semibold text-[#1C1C1C] capitalize">
                                            {color}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedItem.product.materials && selectedItem.product.materials.length > 0 && (
                        <div className="p-6 border-b border-[#E5E5E5]">
                            <div className="flex items-center gap-2 mb-5">
                                <BoxIcon size={14} className="text-[#A8A8A8]" />
                                <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                    Materials
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {selectedItem.product.materials.map((material, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-[#F4F1ED] rounded-xl"
                                    >
                                        <div className="w-5 h-5 rounded bg-[#D4C3A3]" />
                                        <span className="text-[13px] font-bold text-[#1C1C1C] capitalize">
                                            {material}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedItem.product.description && (
                        <div className="p-6">
                            <h3 className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-3">
                                Description
                            </h3>
                            <p className="text-xs text-[#6C6C6C] leading-relaxed">
                                {selectedItem.product.description}
                            </p>
                        </div>
                    )}

                    {!selectedItem.product.colors?.length &&
                        !selectedItem.product.materials?.length &&
                        !selectedItem.product.description && (
                            <div className="p-6">
                                <p className="text-xs text-[#A8A8A8] text-center py-4">
                                    No additional details available for this item.
                                </p>
                            </div>
                        )}
                </div>
            )}

            <style jsx global>{`
                .hidden-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hidden-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #7B4B29;
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #7B4B29;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}

export default function ThreeDViewer() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-[#663F23]" />
                        <p className="text-sm font-medium text-[#1C1C1C]/50">Initializing 3D viewer...</p>
                    </div>
                </div>
            }
        >
            <ThreeDViewerContent />
        </Suspense>
    );
}
