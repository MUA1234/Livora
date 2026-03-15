"use client";

import { useState } from "react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Lightbulb,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Maximize2,
  Move3D,
  Palette,
  Ruler,
  ChevronDown,
  ChevronRight,
  Box,
  Armchair,
  Lamp,
  RectangleHorizontal,
  Layers,
  SunMedium,
  CloudSun,
  Sunset,
} from "lucide-react";

type LightingEnv = "daylight" | "sunset" | "night" | "studio";
type ShadingMode = "smooth" | "flat" | "wireframe";

export default function ThreeDVisualizationPage() {
  const [lightingEnv, setLightingEnv] = useState<LightingEnv>("daylight");
  const [shadingMode, setShadingMode] = useState<ShadingMode>("smooth");
  const [showShading, setShowShading] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(75);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>("sofa");
  const [panelOpen, setPanelOpen] = useState(true);
  const [customizeOpen, setCustomizeOpen] = useState(true);

  const [furnitureWidth, setFurnitureWidth] = useState(200);
  const [furnitureHeight, setFurnitureHeight] = useState(85);
  const [furnitureDepth, setFurnitureDepth] = useState(90);
  const [furnitureColor, setFurnitureColor] = useState("#663F23");
  const [furnitureTexture, setFurnitureTexture] = useState("leather");

  const lightingEnvs: { key: LightingEnv; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "daylight", label: "Daylight", icon: <Sun className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
    { key: "sunset", label: "Sunset", icon: <Sunset className="w-4 h-4" />, color: "bg-orange-100 text-orange-700" },
    { key: "night", label: "Night", icon: <Moon className="w-4 h-4" />, color: "bg-indigo-100 text-indigo-700" },
    { key: "studio", label: "Studio", icon: <Lightbulb className="w-4 h-4" />, color: "bg-gray-100 text-gray-700" },
  ];

  const textures = [
    { id: "leather", label: "Leather", color: "bg-amber-900" },
    { id: "fabric", label: "Fabric", color: "bg-stone-400" },
    { id: "wood", label: "Wood", color: "bg-yellow-800" },
    { id: "metal", label: "Metal", color: "bg-zinc-400" },
    { id: "velvet", label: "Velvet", color: "bg-purple-900" },
  ];

  const furnitureColors = [
    "#663F23", "#1C1C1C", "#F5F1E8", "#C6A75E", "#8B4513",
    "#2F4F4F", "#800020", "#D2B48C", "#556B2F", "#4A3728",
  ];

  const envGradient: Record<LightingEnv, string> = {
    daylight: "from-sky-100 via-amber-50 to-orange-50",
    sunset: "from-orange-200 via-rose-100 to-purple-100",
    night: "from-indigo-900 via-slate-800 to-gray-900",
    studio: "from-gray-200 via-gray-100 to-white",
  };

  const envFloorColor: Record<LightingEnv, string> = {
    daylight: "bg-amber-100/60",
    sunset: "bg-orange-100/60",
    night: "bg-slate-700/60",
    studio: "bg-gray-200/60",
  };

  const envTextColor: Record<LightingEnv, string> = {
    daylight: "text-charcoal",
    sunset: "text-charcoal",
    night: "text-white/70",
    studio: "text-charcoal",
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Left Sidebar - Controls */}
      <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-silver/60 flex flex-col shrink-0 max-h-[50vh] md:max-h-none overflow-y-auto md:overflow-y-visible">
        {/* Header */}
        <div className="p-5 border-b border-silver/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brown rounded-lg flex items-center justify-center">
              <Move3D className="w-5 h-5 text-cream" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-charcoal">3D Viewer</h1>
              <p className="text-xs text-charcoal/40">Livora Studio</p>
            </div>
          </div>
        </div>

        {/* Scrollable Controls */}
        <div className="flex-1 overflow-y-auto">
          {/* Camera Controls */}
          <div className="p-5 border-b border-silver/30">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-4">Camera Controls</h3>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-cream hover:bg-gold/10 transition-colors group">
                <RotateCcw className="w-5 h-5 text-brown group-hover:text-gold-dark" />
                <span className="text-[10px] text-charcoal/50 font-medium">Rotate</span>
              </button>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-cream hover:bg-gold/10 transition-colors group"
              >
                <ZoomIn className="w-5 h-5 text-brown group-hover:text-gold-dark" />
                <span className="text-[10px] text-charcoal/50 font-medium">Zoom In</span>
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(20, zoomLevel - 10))}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-cream hover:bg-gold/10 transition-colors group"
              >
                <ZoomOut className="w-5 h-5 text-brown group-hover:text-gold-dark" />
                <span className="text-[10px] text-charcoal/50 font-medium">Zoom Out</span>
              </button>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-charcoal/50 mb-1.5">
                <span>Zoom Level</span>
                <span className="font-medium text-brown">{zoomLevel}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-silver rounded-full appearance-none cursor-pointer accent-brown"
              />
            </div>
          </div>

          {/* Lighting */}
          <div className="p-5 border-b border-silver/30">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-4">Lighting</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {lightingEnvs.map((env) => (
                <button
                  key={env.key}
                  onClick={() => setLightingEnv(env.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    lightingEnv === env.key
                      ? "bg-brown text-cream shadow-sm"
                      : "bg-cream text-charcoal/60 hover:bg-gold/10"
                  }`}
                >
                  {env.icon}
                  {env.label}
                </button>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-charcoal/50 mb-1.5">
                <span>Intensity</span>
                <span className="font-medium text-brown">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-silver rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>
          </div>

          {/* Shading */}
          <div className="p-5 border-b border-silver/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Shading</h3>
              <button
                onClick={() => setShowShading(!showShading)}
                className="text-charcoal/40 hover:text-brown transition-colors"
              >
                {showShading ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              {(["smooth", "flat", "wireframe"] as ShadingMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setShadingMode(mode)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    shadingMode === mode
                      ? "bg-gold text-charcoal shadow-sm"
                      : "bg-cream text-charcoal/50 hover:bg-gold/10"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Furniture in Scene */}
          <div className="p-5">
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Furniture in Scene</h3>
              {panelOpen ? <ChevronDown className="w-4 h-4 text-charcoal/30" /> : <ChevronRight className="w-4 h-4 text-charcoal/30" />}
            </button>
            {panelOpen && (
              <div className="space-y-2">
                {[
                  { id: "sofa", label: "Modern Sofa", icon: <Armchair className="w-4 h-4" />, dim: "200 x 85 x 90 cm" },
                  { id: "table", label: "Coffee Table", icon: <RectangleHorizontal className="w-4 h-4" />, dim: "120 x 45 x 60 cm" },
                  { id: "lamp", label: "Floor Lamp", icon: <Lamp className="w-4 h-4" />, dim: "40 x 160 x 40 cm" },
                  { id: "shelf", label: "Bookshelf", icon: <Layers className="w-4 h-4" />, dim: "80 x 180 x 35 cm" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFurniture(item.id === selectedFurniture ? null : item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      selectedFurniture === item.id
                        ? "bg-brown/10 border border-brown/30"
                        : "bg-cream hover:bg-cream/80 border border-transparent"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedFurniture === item.id ? "bg-brown text-cream" : "bg-silver/50 text-charcoal/40"
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal">{item.label}</p>
                      <p className="text-[10px] text-charcoal/35">{item.dim}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-silver/40 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-brown text-cream py-3 rounded-xl font-medium text-sm hover:bg-brown-dark transition-colors">
            <Save className="w-4 h-4" />
            Save Design
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-cream text-charcoal/60 py-2.5 rounded-xl text-sm hover:bg-silver/40 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to 2D
          </button>
        </div>
      </aside>

      {/* Main 3D Viewport */}
      <main className="flex-1 flex flex-col min-h-[50vh]">
        {/* Top Bar */}
        <div className="h-14 bg-white/80 backdrop-blur-sm border-b border-silver/40 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-charcoal">Living Room Design</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Auto-saved</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-cream transition-colors text-charcoal/50 hover:text-charcoal">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative overflow-hidden">
          {/* Gradient background simulating 3D environment */}
          <div className={`absolute inset-0 bg-gradient-to-b ${envGradient[lightingEnv]} transition-all duration-700`} style={{ opacity: lightIntensity / 100 }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.05),transparent_70%)]" />

          {/* Grid floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[40%] perspective-[800px]">
            <div
              className={`w-full h-full ${envFloorColor[lightingEnv]} transition-colors duration-700`}
              style={{
                transform: "rotateX(60deg)",
                transformOrigin: "bottom center",
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Simulated 3D furniture shapes */}
          <div className="absolute inset-0 flex items-end justify-center pb-[22%]">
            <div className="relative" style={{ transform: `scale(${zoomLevel / 100})`, transition: "transform 0.3s ease" }}>
              {/* Sofa */}
              <div
                className={`absolute transition-all duration-300 ${selectedFurniture === "sofa" ? "ring-2 ring-gold ring-offset-4 ring-offset-transparent rounded-lg" : ""}`}
                style={{ bottom: 0, left: -120 }}
              >
                <div className="relative">
                  {/* Back */}
                  <div className="w-[200px] h-[50px] rounded-t-xl" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.9 : 0.7 }} />
                  {/* Seat */}
                  <div className="w-[200px] h-[35px] rounded-b-lg" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.75 : 0.6 }} />
                  {/* Arms */}
                  <div className="absolute left-0 top-[10px] w-[20px] h-[55px] rounded-l-lg" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.85 : 0.65 }} />
                  <div className="absolute right-0 top-[10px] w-[20px] h-[55px] rounded-r-lg" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.85 : 0.65 }} />
                  {/* Cushions */}
                  <div className="absolute top-[52px] left-[25px] w-[70px] h-[28px] rounded-md" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.65 : 0.5 }} />
                  <div className="absolute top-[52px] left-[105px] w-[70px] h-[28px] rounded-md" style={{ backgroundColor: furnitureColor, opacity: showShading ? 0.65 : 0.5 }} />
                  {/* Legs */}
                  <div className="absolute bottom-[-12px] left-[15px] w-[8px] h-[12px] bg-charcoal/30 rounded-b" />
                  <div className="absolute bottom-[-12px] right-[15px] w-[8px] h-[12px] bg-charcoal/30 rounded-b" />
                  {/* Wireframe overlay */}
                  {shadingMode === "wireframe" && (
                    <div className="absolute inset-0 border-2 border-charcoal/30 rounded-xl" />
                  )}
                </div>
              </div>

              {/* Coffee Table */}
              <div
                className={`absolute transition-all duration-300 ${selectedFurniture === "table" ? "ring-2 ring-gold ring-offset-4 ring-offset-transparent rounded-md" : ""}`}
                style={{ bottom: -10, left: 10 }}
              >
                <div className="relative">
                  <div className="w-[100px] h-[8px] bg-yellow-800/80 rounded-md shadow-sm" />
                  <div className="w-[100px] h-[30px] mt-[2px] flex justify-between px-[8px]">
                    <div className="w-[4px] h-full bg-yellow-800/60 rounded-b" />
                    <div className="w-[4px] h-full bg-yellow-800/60 rounded-b" />
                  </div>
                  {shadingMode === "wireframe" && (
                    <div className="absolute inset-0 border-2 border-charcoal/30 rounded-md" />
                  )}
                </div>
              </div>

              {/* Floor Lamp */}
              <div
                className={`absolute transition-all duration-300 ${selectedFurniture === "lamp" ? "ring-2 ring-gold ring-offset-4 ring-offset-transparent rounded-full" : ""}`}
                style={{ bottom: -12, left: 160 }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Shade */}
                  <div className="w-[40px] h-[30px] bg-gold/50 rounded-t-full border-b-2 border-gold/30" />
                  {/* Glow */}
                  {lightingEnv !== "night" && (
                    <div className="absolute top-[10px] w-[60px] h-[60px] bg-gold/10 rounded-full blur-xl" />
                  )}
                  {/* Pole */}
                  <div className="w-[4px] h-[80px] bg-charcoal/30 rounded" />
                  {/* Base */}
                  <div className="w-[30px] h-[6px] bg-charcoal/25 rounded-full" />
                  {shadingMode === "wireframe" && (
                    <div className="absolute inset-0 border-2 border-charcoal/30 rounded" />
                  )}
                </div>
              </div>

              {/* Bookshelf */}
              <div
                className={`absolute transition-all duration-300 ${selectedFurniture === "shelf" ? "ring-2 ring-gold ring-offset-4 ring-offset-transparent rounded-md" : ""}`}
                style={{ bottom: -12, left: -200 }}
              >
                <div className="relative">
                  <div className="w-[60px] h-[130px] bg-yellow-900/50 rounded-sm border border-yellow-900/20">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-[1px] bg-yellow-900/30" style={{ marginTop: i === 0 ? 30 : 24 }} />
                    ))}
                    {/* Books */}
                    <div className="absolute top-[6px] left-[5px] flex gap-[2px]">
                      <div className="w-[6px] h-[22px] bg-brown/60 rounded-[1px]" />
                      <div className="w-[6px] h-[22px] bg-gold/50 rounded-[1px]" />
                      <div className="w-[8px] h-[22px] bg-charcoal/30 rounded-[1px]" />
                      <div className="w-[6px] h-[22px] bg-brown/40 rounded-[1px]" />
                    </div>
                    <div className="absolute top-[34px] left-[5px] flex gap-[2px]">
                      <div className="w-[8px] h-[20px] bg-gold/40 rounded-[1px]" />
                      <div className="w-[6px] h-[20px] bg-brown/50 rounded-[1px]" />
                      <div className="w-[6px] h-[20px] bg-charcoal/20 rounded-[1px]" />
                    </div>
                  </div>
                  {shadingMode === "wireframe" && (
                    <div className="absolute inset-0 border-2 border-charcoal/30 rounded-sm" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Viewport Info Overlay */}
          <div className={`absolute top-4 left-4 flex flex-col gap-2 ${envTextColor[lightingEnv]}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/60 shadow-sm">
              <span className="text-charcoal/30 mr-1">ENV:</span> {lightingEnv.charAt(0).toUpperCase() + lightingEnv.slice(1)}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/60 shadow-sm">
              <span className="text-charcoal/30 mr-1">SHADE:</span> {shadingMode}
            </div>
          </div>

          {/* Compass */}
          <div className="absolute top-4 right-4 w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-2 border-charcoal/10 rounded-full" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] text-[8px] font-bold text-brown">N</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] text-[8px] text-charcoal/30">S</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] text-[8px] text-charcoal/30">W</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] text-[8px] text-charcoal/30">E</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brown rounded-full" />
            </div>
          </div>

          {/* Bottom center zoom indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm flex items-center gap-3">
            <ZoomOut className="w-3.5 h-3.5 text-charcoal/30" />
            <div className="w-32 h-1.5 bg-silver/60 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${((zoomLevel - 20) / 180) * 100}%` }} />
            </div>
            <ZoomIn className="w-3.5 h-3.5 text-charcoal/30" />
            <span className="text-xs text-charcoal/40 font-medium ml-1">{zoomLevel}%</span>
          </div>
        </div>
      </main>

      {/* Right Panel - Customize Furniture */}
      {selectedFurniture && (
        <aside className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-silver/60 flex flex-col shrink-0 max-h-[50vh] md:max-h-none overflow-y-auto md:overflow-y-visible">
          <div className="p-5 border-b border-silver/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/20 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-charcoal">Customize</h2>
                  <p className="text-[10px] text-charcoal/40 capitalize">{selectedFurniture} selected</p>
                </div>
              </div>
              <button onClick={() => setSelectedFurniture(null)} className="text-charcoal/30 hover:text-charcoal transition-colors text-lg">&times;</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Dimensions */}
            <div className="p-5 border-b border-silver/30">
              <button onClick={() => setCustomizeOpen(!customizeOpen)} className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-brown" />
                  <h3 className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Dimensions</h3>
                </div>
                {customizeOpen ? <ChevronDown className="w-4 h-4 text-charcoal/30" /> : <ChevronRight className="w-4 h-4 text-charcoal/30" />}
              </button>
              {customizeOpen && (
                <div className="space-y-4">
                  {[
                    { label: "Width", value: furnitureWidth, setter: setFurnitureWidth, max: 400 },
                    { label: "Height", value: furnitureHeight, setter: setFurnitureHeight, max: 300 },
                    { label: "Depth", value: furnitureDepth, setter: setFurnitureDepth, max: 200 },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-charcoal/50">{dim.label}</span>
                        <span className="font-medium text-brown">{dim.value} cm</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={dim.max}
                        value={dim.value}
                        onChange={(e) => dim.setter(Number(e.target.value))}
                        className="w-full h-1.5 bg-silver rounded-full appearance-none cursor-pointer accent-brown"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color */}
            <div className="p-5 border-b border-silver/30">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-brown" />
                <h3 className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Color</h3>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {furnitureColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFurnitureColor(color)}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      furnitureColor === color ? "ring-2 ring-gold ring-offset-2 scale-110" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="text-xs text-charcoal/40">Custom:</label>
                <input
                  type="color"
                  value={furnitureColor}
                  onChange={(e) => setFurnitureColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-silver"
                />
                <span className="text-xs text-charcoal/50 font-mono">{furnitureColor}</span>
              </div>
            </div>

            {/* Texture */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Box className="w-4 h-4 text-brown" />
                <h3 className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Texture</h3>
              </div>
              <div className="space-y-2">
                {textures.map((tex) => (
                  <button
                    key={tex.id}
                    onClick={() => setFurnitureTexture(tex.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      furnitureTexture === tex.id
                        ? "bg-brown/10 border border-brown/30"
                        : "bg-cream hover:bg-cream/80 border border-transparent"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${tex.color}`} />
                    <span className="text-xs font-medium text-charcoal capitalize">{tex.label}</span>
                    {furnitureTexture === tex.id && (
                      <span className="ml-auto text-xs text-gold font-medium">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-silver/40">
            <button className="w-full bg-gold text-charcoal py-3 rounded-xl font-medium text-sm hover:bg-gold-light transition-colors">
              Apply Changes
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
