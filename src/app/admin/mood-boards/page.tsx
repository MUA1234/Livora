"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import api from "@/lib/api";
import {
    Plus,
    Loader2,
    Save,
    Trash2,
    Palette,
    Type,
    ImageIcon,
    ChevronDown,
    RotateCw,
    ArrowUp,
    ArrowDown,
    X,
    Pencil,
    Layers,
    AlertCircle,
    Move,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface BoardItem {
    id: string;
    type: "color" | "text" | "image";
    content: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    rotation: number;
    zIndex: number;
}

interface MoodBoard {
    _id: string;
    name: string;
    description: string;
    items: BoardItem[];
    createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MoodBoardsPage() {
    /* ---- state ---- */
    const [boards, setBoards] = useState<MoodBoard[]>([]);
    const [activeBoard, setActiveBoard] = useState<MoodBoard | null>(null);
    const [items, setItems] = useState<BoardItem[]>([]);
    const [boardName, setBoardName] = useState("");
    const [boardDesc, setBoardDesc] = useState("");

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const [isListLoading, setIsListLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const [showMobileList, setShowMobileList] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editingItemText, setEditingItemText] = useState<string | null>(null);

    /* ---- fetch boards ---- */
    const fetchBoards = useCallback(async () => {
        try {
            setIsListLoading(true);
            const res = await api.get("/api/mood-boards");
            const list: MoodBoard[] = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
            setBoards(list);
        } catch {
            setToastConfig({ message: "Failed to load mood boards.", type: "error" });
        } finally {
            setIsListLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    /* ---- select board ---- */
    const selectBoard = (board: MoodBoard) => {
        setActiveBoard(board);
        setItems(board.items ?? []);
        setBoardName(board.name);
        setBoardDesc(board.description);
        setSelectedItemId(null);
        setShowMobileList(false);
    };

    /* ---- create board ---- */
    const createBoard = async () => {
        try {
            const res = await api.post("/api/mood-boards", {
                name: "Untitled Board",
                description: "",
                items: [],
            });
            const created: MoodBoard = res.data?.data ?? res.data;
            setBoards((prev) => [created, ...prev]);
            selectBoard(created);
            setToastConfig({ message: "Board created!", type: "success" });
        } catch {
            setToastConfig({ message: "Failed to create board.", type: "error" });
        }
    };

    /* ---- save board ---- */
    const saveBoard = async () => {
        if (!activeBoard) return;
        try {
            setIsSaving(true);
            await api.put(`/api/mood-boards/${activeBoard._id}`, {
                name: boardName,
                description: boardDesc,
                items,
            });
            setBoards((prev) =>
                prev.map((b) =>
                    b._id === activeBoard._id ? { ...b, name: boardName, description: boardDesc, items } : b
                )
            );
            setActiveBoard((prev) => (prev ? { ...prev, name: boardName, description: boardDesc, items } : prev));
            setToastConfig({ message: "Board saved!", type: "success" });
        } catch {
            setToastConfig({ message: "Failed to save board.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    /* ---- delete board ---- */
    const deleteBoard = async (id: string) => {
        try {
            await api.delete(`/api/mood-boards/${id}`);
            setBoards((prev) => prev.filter((b) => b._id !== id));
            if (activeBoard?._id === id) {
                setActiveBoard(null);
                setItems([]);
                setBoardName("");
                setBoardDesc("");
                setSelectedItemId(null);
            }
            setToastConfig({ message: "Board deleted.", type: "success" });
        } catch {
            setToastConfig({ message: "Failed to delete board.", type: "error" });
        } finally {
            setConfirmDelete(null);
        }
    };

    /* ---- add items ---- */
    const addColor = () => {
        const item: BoardItem = {
            id: uid(),
            type: "color",
            content: "#663F23",
            position: { x: 40, y: 40 },
            size: { width: 100, height: 100 },
            rotation: 0,
            zIndex: items.length + 1,
        };
        setItems((prev) => [...prev, item]);
        setSelectedItemId(item.id);
    };

    const addText = () => {
        const item: BoardItem = {
            id: uid(),
            type: "text",
            content: "New note",
            position: { x: 60, y: 60 },
            size: { width: 180, height: 80 },
            rotation: 0,
            zIndex: items.length + 1,
        };
        setItems((prev) => [...prev, item]);
        setSelectedItemId(item.id);
        setEditingItemText(item.id);
    };

    const addImageFromUrl = (url: string) => {
        if (!url.trim()) return;
        const item: BoardItem = {
            id: uid(),
            type: "image",
            content: url.trim(),
            position: { x: 80, y: 80 },
            size: { width: 200, height: 150 },
            rotation: 0,
            zIndex: items.length + 1,
        };
        setItems((prev) => [...prev, item]);
        setSelectedItemId(item.id);
        setShowImageModal(false);
        setImageUrl("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                addImageFromUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    /* ---- item manipulation ---- */
    const updateItem = (id: string, patch: Partial<BoardItem>) => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selectedItemId === id) setSelectedItemId(null);
    };

    const bringForward = (id: string) => {
        const maxZ = Math.max(...items.map((i) => i.zIndex), 0);
        updateItem(id, { zIndex: maxZ + 1 });
    };

    const sendBackward = (id: string) => {
        const minZ = Math.min(...items.map((i) => i.zIndex), 0);
        updateItem(id, { zIndex: minZ - 1 });
    };

    /* ---- drag handlers ---- */
    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        if (editingItemText === id) return;
        e.preventDefault();
        e.stopPropagation();
        setSelectedItemId(id);
        setDraggingId(id);
        const item = items.find((i) => i.id === id);
        if (!item || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left - item.position.x,
            y: e.clientY - rect.top - item.position.y,
        };
    };

    useEffect(() => {
        if (!draggingId) return;

        const handleMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.max(0, e.clientX - rect.left - dragOffset.current.x);
            const y = Math.max(0, e.clientY - rect.top - dragOffset.current.y);
            updateItem(draggingId, { position: { x, y } });
        };

        const handleUp = () => setDraggingId(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingId]);

    /* ---- touch drag handlers ---- */
    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        if (editingItemText === id) return;
        setSelectedItemId(id);
        setDraggingId(id);
        const item = items.find((i) => i.id === id);
        if (!item || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        dragOffset.current = {
            x: touch.clientX - rect.left - item.position.x,
            y: touch.clientY - rect.top - item.position.y,
        };
    };

    useEffect(() => {
        if (!draggingId) return;

        const handleTouchMove = (e: TouchEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const x = Math.max(0, touch.clientX - rect.left - dragOffset.current.x);
            const y = Math.max(0, touch.clientY - rect.top - dragOffset.current.y);
            updateItem(draggingId, { position: { x, y } });
        };

        const handleTouchEnd = () => setDraggingId(null);

        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingId]);

    /* ---- selected item ---- */
    const selectedItem = items.find((i) => i.id === selectedItemId) ?? null;

    /* ------------------------------------------------------------------ */
    /* Render                                                              */
    /* ------------------------------------------------------------------ */

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-[#F5F1E8] flex flex-col">
                {/* Header */}
                <div className="px-4 pt-16 md:pt-6 pb-4 sm:px-6 md:px-8 lg:px-12 border-b border-[#E5E5E5]/60 bg-[#F5F1E8]">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-[#663F23]">Mood Boards</h1>
                            <p className="text-sm text-[#1C1C1C]/50 mt-0.5">Create visual inspiration boards for your designs.</p>
                        </div>
                        {activeBoard && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={saveBoard}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#663F23] text-white rounded-xl font-semibold text-sm hover:bg-[#533520] transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(activeBoard._id)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl font-medium text-sm border border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    <span className="hidden sm:inline">Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* ---- Left panel (desktop) / dropdown (mobile) ---- */}
                    <div className="hidden md:flex w-72 lg:w-80 border-r border-[#E5E5E5]/60 bg-white flex-col shrink-0">
                        <div className="p-4 border-b border-[#E5E5E5]/40">
                            <button
                                onClick={createBoard}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#663F23] text-white rounded-xl font-semibold text-sm hover:bg-[#533520] transition-colors"
                            >
                                <Plus size={18} /> New Board
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {isListLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#663F23]" />
                                </div>
                            ) : boards.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <Layers className="w-10 h-10 text-[#E5E5E5] mx-auto mb-3" />
                                    <p className="text-sm text-[#A8A8A8]">No mood boards yet.</p>
                                </div>
                            ) : (
                                boards.map((b) => (
                                    <button
                                        key={b._id}
                                        onClick={() => selectBoard(b)}
                                        className={`w-full text-left px-5 py-4 border-b border-[#E5E5E5]/30 transition-colors hover:bg-[#F5F1E8]/50 ${
                                            activeBoard?._id === b._id ? "bg-[#F5F1E8] border-l-4 border-l-[#663F23]" : ""
                                        }`}
                                    >
                                        <p className="font-semibold text-sm text-[#1C1C1C] truncate">{b.name}</p>
                                        <p className="text-xs text-[#A8A8A8] mt-1">
                                            {b.items?.length ?? 0} items &middot;{" "}
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Mobile board selector */}
                    <div className="md:hidden px-4 pt-3 bg-[#F5F1E8]">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowMobileList(!showMobileList)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#E5E5E5] text-sm font-medium"
                                >
                                    <span className="truncate">{activeBoard?.name || "Select a board..."}</span>
                                    <ChevronDown size={16} className={`shrink-0 ml-2 transition-transform ${showMobileList ? "rotate-180" : ""}`} />
                                </button>
                                {showMobileList && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-[#E5E5E5] shadow-lg z-40 max-h-64 overflow-y-auto">
                                        {isListLoading ? (
                                            <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#663F23]" /></div>
                                        ) : boards.length === 0 ? (
                                            <p className="p-4 text-sm text-[#A8A8A8] text-center">No boards yet</p>
                                        ) : (
                                            boards.map((b) => (
                                                <button
                                                    key={b._id}
                                                    onClick={() => selectBoard(b)}
                                                    className={`w-full text-left px-4 py-3 text-sm border-b border-[#E5E5E5]/30 hover:bg-[#F5F1E8] transition-colors ${
                                                        activeBoard?._id === b._id ? "bg-[#F5F1E8] font-bold text-[#663F23]" : ""
                                                    }`}
                                                >
                                                    {b.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={createBoard}
                                className="shrink-0 w-12 h-12 flex items-center justify-center bg-[#663F23] text-white rounded-xl hover:bg-[#533520] transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* ---- Right panel: canvas ---- */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {!activeBoard ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
                                <Layers className="w-16 h-16 text-[#E5E5E5]" />
                                <h3 className="text-xl font-bold text-[#1C1C1C]">No Board Selected</h3>
                                <p className="text-[#8C8C8C] max-w-sm">
                                    Select an existing mood board from the list or create a new one to get started.
                                </p>
                                <button
                                    onClick={createBoard}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#663F23] text-white rounded-xl font-semibold text-sm hover:bg-[#533520] transition-colors mt-2"
                                >
                                    <Plus size={18} /> Create New Board
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Board name / description */}
                                <div className="px-4 sm:px-6 py-3 bg-white/60 border-b border-[#E5E5E5]/40 flex flex-col sm:flex-row sm:items-center gap-2">
                                    <input
                                        type="text"
                                        value={boardName}
                                        onChange={(e) => setBoardName(e.target.value)}
                                        placeholder="Board name"
                                        className="text-lg font-bold text-[#1C1C1C] bg-transparent border-b-2 border-transparent focus:border-[#663F23] outline-none transition-colors px-1 py-0.5 flex-1 min-w-0"
                                    />
                                    <input
                                        type="text"
                                        value={boardDesc}
                                        onChange={(e) => setBoardDesc(e.target.value)}
                                        placeholder="Add a description..."
                                        className="text-sm text-[#8C8C8C] bg-transparent border-b border-transparent focus:border-[#663F23]/50 outline-none transition-colors px-1 py-0.5 flex-1 min-w-0"
                                    />
                                </div>

                                {/* Toolbar */}
                                <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E5E5E5]/40 flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={addColor}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F1E8] rounded-lg text-sm font-medium text-[#663F23] hover:bg-[#E8E0D0] transition-colors"
                                    >
                                        <Palette size={16} /> Add Color
                                    </button>
                                    <button
                                        onClick={addText}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F1E8] rounded-lg text-sm font-medium text-[#663F23] hover:bg-[#E8E0D0] transition-colors"
                                    >
                                        <Type size={16} /> Add Text
                                    </button>
                                    <button
                                        onClick={() => setShowImageModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F1E8] rounded-lg text-sm font-medium text-[#663F23] hover:bg-[#E8E0D0] transition-colors"
                                    >
                                        <ImageIcon size={16} /> Add Image
                                    </button>

                                    {/* Selection controls */}
                                    {selectedItem && (
                                        <div className="flex items-center gap-1.5 ml-auto border-l border-[#E5E5E5] pl-3">
                                            {selectedItem.type === "color" && (
                                                <input
                                                    type="color"
                                                    value={selectedItem.content}
                                                    onChange={(e) => updateItem(selectedItem.id, { content: e.target.value })}
                                                    className="w-8 h-8 rounded border border-[#E5E5E5] cursor-pointer"
                                                    title="Change color"
                                                />
                                            )}
                                            <div className="flex items-center gap-1 bg-[#F5F1E8] rounded-lg px-2 py-1">
                                                <RotateCw size={12} className="text-[#8C8C8C]" />
                                                <input
                                                    type="number"
                                                    value={selectedItem.rotation}
                                                    onChange={(e) => updateItem(selectedItem.id, { rotation: Number(e.target.value) })}
                                                    className="w-12 text-xs text-center bg-transparent outline-none"
                                                    title="Rotation (degrees)"
                                                />
                                                <span className="text-[10px] text-[#A8A8A8]">deg</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-[#F5F1E8] rounded-lg px-2 py-1">
                                                <span className="text-[10px] text-[#A8A8A8]">W</span>
                                                <input
                                                    type="number"
                                                    value={selectedItem.size.width}
                                                    onChange={(e) =>
                                                        updateItem(selectedItem.id, {
                                                            size: { ...selectedItem.size, width: Math.max(20, Number(e.target.value)) },
                                                        })
                                                    }
                                                    className="w-12 text-xs text-center bg-transparent outline-none"
                                                />
                                                <span className="text-[10px] text-[#A8A8A8]">H</span>
                                                <input
                                                    type="number"
                                                    value={selectedItem.size.height}
                                                    onChange={(e) =>
                                                        updateItem(selectedItem.id, {
                                                            size: { ...selectedItem.size, height: Math.max(20, Number(e.target.value)) },
                                                        })
                                                    }
                                                    className="w-12 text-xs text-center bg-transparent outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => bringForward(selectedItem.id)}
                                                className="p-1.5 rounded hover:bg-[#E5E5E5] transition-colors"
                                                title="Bring forward"
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => sendBackward(selectedItem.id)}
                                                className="p-1.5 rounded hover:bg-[#E5E5E5] transition-colors"
                                                title="Send backward"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(selectedItem.id)}
                                                className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete item"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Canvas */}
                                <div className="flex-1 overflow-auto p-4 sm:p-6">
                                    <div
                                        ref={canvasRef}
                                        className="relative bg-white rounded-2xl border-2 border-dashed border-[#E5E5E5] shadow-inner"
                                        style={{ width: "100%", minHeight: 600, height: "100%" }}
                                        onClick={() => {
                                            setSelectedItemId(null);
                                            setEditingItemText(null);
                                        }}
                                    >
                                        {items.length === 0 && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                                                <Move className="w-12 h-12 text-[#E5E5E5] mb-3" />
                                                <p className="text-[#A8A8A8] text-sm font-medium">
                                                    Use the toolbar above to add colors, text, or images.
                                                </p>
                                                <p className="text-[#C5C5C5] text-xs mt-1">
                                                    Drag items to reposition them on the canvas.
                                                </p>
                                            </div>
                                        )}

                                        {items.map((item) => {
                                            const isSelected = selectedItemId === item.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`absolute cursor-grab active:cursor-grabbing select-none ${
                                                        isSelected ? "ring-2 ring-[#663F23] ring-offset-2" : ""
                                                    }`}
                                                    style={{
                                                        left: item.position.x,
                                                        top: item.position.y,
                                                        width: item.size.width,
                                                        height: item.size.height,
                                                        zIndex: item.zIndex,
                                                        transform: `rotate(${item.rotation}deg)`,
                                                    }}
                                                    onMouseDown={(e) => handleMouseDown(e, item.id)}
                                                    onTouchStart={(e) => handleTouchStart(e, item.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedItemId(item.id);
                                                    }}
                                                >
                                                    {/* Color swatch */}
                                                    {item.type === "color" && (
                                                        <div
                                                            className="w-full h-full rounded-xl shadow-md border border-[#E5E5E5]"
                                                            style={{ backgroundColor: item.content }}
                                                        >
                                                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-white/80 px-1.5 py-0.5 rounded">
                                                                {item.content.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Text note */}
                                                    {item.type === "text" && (
                                                        <div className="w-full h-full bg-[#FFF9E6] rounded-lg shadow-md border border-[#F0E6C0] p-3 overflow-hidden">
                                                            {editingItemText === item.id ? (
                                                                <textarea
                                                                    autoFocus
                                                                    value={item.content}
                                                                    onChange={(e) => updateItem(item.id, { content: e.target.value })}
                                                                    onBlur={() => setEditingItemText(null)}
                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                    className="w-full h-full bg-transparent text-sm text-[#1C1C1C] outline-none resize-none"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="w-full h-full text-sm text-[#1C1C1C] whitespace-pre-wrap overflow-hidden"
                                                                    onDoubleClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingItemText(item.id);
                                                                    }}
                                                                >
                                                                    {item.content}
                                                                    <span className="block text-[10px] text-[#C5C5C5] mt-1 italic">Double-click to edit</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Image */}
                                                    {item.type === "image" && (
                                                        <div className="w-full h-full rounded-lg shadow-md border border-[#E5E5E5] overflow-hidden bg-[#FAFAFA]">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={item.content}
                                                                alt="Board item"
                                                                className="w-full h-full object-cover"
                                                                draggable={false}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "";
                                                                    (e.target as HTMLImageElement).alt = "Failed to load";
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Image URL modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm" onClick={() => setShowImageModal(false)} />
                    <div className="relative bg-[#F5F1E8] rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-[#1C1C1C] mb-4">Add Image</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-1.5">Image URL</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm outline-none focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#E5E5E5]" />
                                <span className="text-xs text-[#A8A8A8]">or</span>
                                <div className="h-px flex-1 bg-[#E5E5E5]" />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-2.5 bg-white rounded-lg border border-dashed border-[#663F23]/40 text-sm font-medium text-[#663F23] hover:bg-[#F5F1E8] transition-colors"
                            >
                                <ImageIcon size={16} className="inline mr-2" />
                                Upload from device
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowImageModal(false); setImageUrl(""); }}
                                className="px-4 py-2 text-sm font-medium text-[#1C1C1C] border border-[#1C1C1C]/20 rounded-lg hover:bg-[#1C1C1C]/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => addImageFromUrl(imageUrl)}
                                disabled={!imageUrl.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#663F23] rounded-lg hover:bg-[#533520] transition-colors disabled:opacity-40"
                            >
                                Add Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {confirmDelete && (
                <ConfirmModal
                    title="Delete Mood Board"
                    message="Are you sure you want to delete this mood board? This action cannot be undone."
                    onConfirm={() => deleteBoard(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {toastConfig && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />}
        </div>
    );
}
