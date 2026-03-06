"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast } from "@/components/ui/Toast";
import {
    LayoutDashboard,
    Monitor,
    LayoutTemplate,
    FileText,
    Users,
    Settings,
    Sofa,
    Search,
    Download,
    Plus,
    X,
    Pencil,
    ChevronDown,
    Upload,
    LogOut
} from "lucide-react";
import Image from "next/image";

// Product type
interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    colors: string[];
    materials: string[];
    image: string;
    description: string;
    width: number;
    height: number;
    depth: number;
}

// Sample data
const initialProducts: Product[] = [
    {
        id: 1,
        name: "Hampton 3-Seater Sofa",
        sku: "SOF-0912",
        category: "Sofas",
        price: 257999.0,
        colors: ["#C6A75E", "#1C1C1C", "#663F23"],
        materials: ["Fabric", "Wood"],
        image: "",
        description: "Elegant 3-seater sofa with premium fabric upholstery and solid wood legs.",
        width: 210,
        height: 85,
        depth: 90,
    },
    {
        id: 2,
        name: "Oskar Dining Chair",
        sku: "CHR-4431",
        category: "Chairs",
        price: 12999.0,
        colors: ["#1C1C1C", "#E5E5E5"],
        materials: ["Wood"],
        image: "",
        description: "Minimalist wooden dining chair featuring an ergonomic curved backrest and a comfortable upholstered seat.",
        width: 45,
        height: 85,
        depth: 50,
    },
    {
        id: 3,
        name: "Aura Marble Coffee Table",
        sku: "TBL-1029",
        category: "Tables",
        price: 22599.0,
        colors: ["#E5E5E5", "#1C1C1C"],
        materials: ["Marble", "Metal"],
        image: "",
        description: "Stunning marble top coffee table with sleek metal base.",
        width: 120,
        height: 45,
        depth: 60,
    },
    {
        id: 4,
        name: "Luna Upholstered Bed",
        sku: "BED-7762",
        category: "Beds",
        price: 349999.0,
        colors: ["#E5E5E5", "#663F23"],
        materials: ["Fabric", "Wood"],
        image: "",
        description: "Luxurious upholstered bed frame with padded headboard.",
        width: 180,
        height: 120,
        depth: 210,
    },
];

const allMaterials = ["Wood", "Fabric", "Metal", "Leather", "Velvet", "Marble"];
const allCategories = ["Sofas", "Chairs", "Tables", "Beds", "Lighting", "Storage", "Rugs"];
const allColorOptions = [
    { name: "Black", hex: "#1C1C1C" },
    { name: "White", hex: "#E5E5E5" },
    { name: "Brown", hex: "#663F23" },
    { name: "Gold", hex: "#C6A75E" },
    { name: "Gray", hex: "#9CA3AF" },
    { name: "Beige", hex: "#D2B48C" },
];

export default function CatalogueManagement() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedMaterial, setSelectedMaterial] = useState("All materials");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<Product | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        name: "",
        sku: "",
        category: "Sofa",
        price: 0,
        description: "",
        image: "",
    });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    // Filter products
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All categories" || p.category === selectedCategory;
        const matchesMaterial =
            selectedMaterial === "All materials" ||
            p.materials.some((m) => m === selectedMaterial);
        return matchesSearch && matchesCategory && matchesMaterial;
    });

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setEditForm({ ...product });
    };

    const handleCloseEdit = () => {
        setEditingProduct(null);
        setEditForm(null);
    };

    const handleSaveChanges = () => {
        if (!editForm) return;
        setProducts(products.map((p) => (p.id === editForm.id ? editForm : p)));
        handleCloseEdit();
    };

    const handleDeleteProduct = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!editForm) return;
        setProducts(products.filter((p) => p.id !== editForm.id));
        setToastMessage("Product deleted successfully");
        setIsDeleteModalOpen(false);
        handleCloseEdit();
    };

    const handleAddProductSubmit = () => {
        const newProduct: Product = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: addForm.name,
            sku: addForm.sku,
            category: addForm.category,
            price: addForm.price,
            description: addForm.description,
            image: addForm.image || "",
            colors: [],
            materials: [],
            width: 0,
            height: 0,
            depth: 0,
        };
        setProducts([...products, newProduct]);
        setIsAddModalOpen(false);
        setToastMessage("Product added successfully");
        setAddForm({
            name: "",
            sku: "",
            category: "Sofa",
            price: 0,
            description: "",
            image: "",
        });
    };

    const toggleMaterial = (material: string) => {
        if (!editForm) return;
        const newMaterials = editForm.materials.includes(material)
            ? editForm.materials.filter((m) => m !== material)
            : [...editForm.materials, material];
        setEditForm({ ...editForm, materials: newMaterials });
    };

    const toggleColor = (hex: string) => {
        if (!editForm) return;
        const newColors = editForm.colors.includes(hex)
            ? editForm.colors.filter((c) => c !== hex)
            : [...editForm.colors, hex];
        setEditForm({ ...editForm, colors: newColors });
    };

    const formatPrice = (price: number) => {
        return `Rs.${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Stats
    const totalProducts = products.length;
    const totalCategories = [...new Set(products.map((p) => p.category))].length;
    const totalMaterials = [...new Set(products.flatMap((p) => p.materials))].length;

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans text-[#1C1C1C]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#F5F1E8] border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    <div className="h-20 flex items-center px-8 border-b border-[#E5E5E5]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#663F23] flex items-center justify-center relative overflow-hidden">
                                <span className="text-[#663F23] text-xs font-bold">LV</span>
                            </div>
                            <span className="text-2xl font-bold text-[#663F23] tracking-tight">Livora</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1 mt-4">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutDashboard size={20} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>

                        <Link href="/admin/room-setup" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Monitor size={20} />
                            <span className="font-medium text-sm">Room Setup</span>
                        </Link>

                        <Link href="/admin/catalogue" className="flex items-center gap-3 px-4 py-3 bg-[#663F23] text-white rounded-lg transition-colors">
                            <Sofa size={20} />
                            <span className="font-medium text-sm">Catalogue</span>
                        </Link>

                        <Link href="/admin/compare-designs" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <LayoutTemplate size={20} />
                            <span className="font-medium text-sm">Compare Designs</span>
                        </Link>

                        <Link href="/admin/cost-summary" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <FileText size={20} />
                            <span className="font-medium text-sm">Cost Summary</span>
                        </Link>

                        <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors">
                            <Users size={20} />
                            <span className="font-medium text-sm">Consultations</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-[#E5E5E5]/50 shrink-0">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1C]/70 hover:bg-[#E5E5E5]/50 hover:text-[#1C1C1C] rounded-lg transition-colors mb-2">
                        <Settings size={20} />
                        <span className="font-medium text-sm">Settings</span>
                    </Link>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors mb-4 focus:outline-none cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>

                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#E5E5E5]/50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1C1C1C]">Sara Samarasinghe</span>
                            <span className="text-[10px] text-[#1C1C1C]/50">Lead Designer</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F5F1E8]">
                <div className="flex h-screen">
                    {/* Product List Section */}
                    <div className={`${editingProduct ? "flex-1" : "flex-1"} p-8 overflow-y-auto`}>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">Furniture Catalogue Management</h1>
                                <p className="text-sm text-[#1C1C1C]/50">Add, edit and organise products for every design project.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-sm font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors">
                                    <Download size={16} />
                                    Export CSV
                                </button>
                                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#663F23] text-white rounded-lg text-sm font-medium hover:bg-[#4A2D19] transition-colors">
                                    <Plus size={16} />
                                    Add Product
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E5E5E5]/50 text-sm">
                                <Sofa size={14} className="text-[#1C1C1C]/50" />
                                <span className="font-medium">{totalProducts} products</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E5E5E5]/50 text-sm">
                                <span className="text-[#1C1C1C]/50">⊞</span>
                                <span className="font-medium">{totalCategories} categories</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E5E5E5]/50 text-sm">
                                <Pencil size={14} className="text-[#1C1C1C]/50" />
                                <span className="font-medium">{totalMaterials} materials / textures</span>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex gap-3 mb-6">
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40" />
                                <input
                                    type="text"
                                    placeholder="Search products by name or SKU..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none px-4 py-2.5 pr-10 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]"
                                >
                                    <option>All categories</option>
                                    {allCategories.map((cat) => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                    className="appearance-none px-4 py-2.5 pr-10 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]"
                                >
                                    <option>All materials</option>
                                    {allMaterials.map((mat) => (
                                        <option key={mat}>{mat}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none px-4 py-2.5 pr-10 bg-white rounded-lg border border-[#E5E5E5] text-sm font-medium cursor-pointer focus:outline-none focus:border-[#663F23]">
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Price Low</option>
                                    <option>Sort by: Price High</option>
                                    <option>Sort by: Name A-Z</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="bg-white rounded-xl border border-[#E5E5E5]/50 overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-[#E5E5E5]/50 text-xs font-medium text-[#1C1C1C]/50 uppercase tracking-wider">
                                <span>Product details</span>
                                <span>Category</span>
                                <span>Price</span>
                                <span>Available colours</span>
                                <span>Materials / textures</span>
                                <span>Actions</span>
                            </div>

                            {/* Product Rows */}
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-[#E5E5E5]/30 items-center hover:bg-[#F5F1E8]/30 transition-colors ${editingProduct?.id === product.id ? "bg-[#F5F1E8]/50" : ""}`}
                                >
                                    {/* Product Details */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-lg bg-[#F5F1E8] border border-[#E5E5E5]/50 flex items-center justify-center shrink-0 overflow-hidden">
                                            <Sofa size={20} className="text-[#1C1C1C]/30" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1C1C1C] leading-tight">{product.name}</p>
                                            <p className="text-xs text-[#1C1C1C]/40 mt-0.5">SKU: {product.sku}</p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span className="px-3 py-1 bg-[#F5F1E8] text-[#663F23] text-xs font-medium rounded-full">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <span className="text-sm font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</span>
                                    </div>

                                    {/* Colors */}
                                    <div className="flex items-center gap-1.5">
                                        {product.colors.slice(0, 3).map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 rounded-full border border-[#E5E5E5]"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        {product.colors.length > 3 && (
                                            <span className="text-xs text-[#1C1C1C]/50 ml-1">+{product.colors.length - 3}</span>
                                        )}
                                    </div>

                                    {/* Materials */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.materials.map((mat) => (
                                            <span key={mat} className="px-2 py-0.5 bg-[#F5F1E8] text-[#1C1C1C]/70 text-[11px] font-medium rounded">
                                                {mat}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F1E8] text-[#1C1C1C]/40 hover:text-[#663F23] transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="px-6 py-12 text-center text-sm text-[#1C1C1C]/40">
                                    No products found matching your search.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Edit Panel */}
                    {editingProduct && editForm && (
                        <div className="w-[380px] bg-white border-l border-[#E5E5E5] h-screen overflow-y-auto p-6 shrink-0">
                            {/* Edit Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-[#1C1C1C]">Edit product</h2>
                                    <p className="text-xs text-[#1C1C1C]/50 mt-0.5">Update details, pricing, colours and textures.</p>
                                </div>
                                <button
                                    onClick={handleCloseEdit}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F1E8] text-[#1C1C1C]/40 hover:text-[#1C1C1C] transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Product Image Upload */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-3">Product Image</p>
                                <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#663F23]/50 transition-colors bg-[#FAFAF8]">
                                    <Upload size={24} className="text-[#1C1C1C]/30 mb-2" />
                                    <p className="text-sm font-medium text-[#1C1C1C]/60">Click to upload product image</p>
                                    <p className="text-xs text-[#1C1C1C]/30 mt-1">PNG or JPG · Up to 5MB</p>
                                </div>
                            </div>

                            {/* Basic Details */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-3">Basic Details</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Product name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            autoComplete="off"
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={editForm.category}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    className="appearance-none w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm cursor-pointer focus:outline-none focus:border-[#663F23]"
                                                >
                                                    {allCategories.map((cat) => (
                                                        <option key={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Price</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#1C1C1C]/40">Rs.</span>
                                                <input
                                                    type="text"
                                                    value={editForm.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value.replace(/,/g, ""));
                                                        if (!isNaN(val)) setEditForm({ ...editForm, price: val });
                                                    }}
                                                    autoComplete="off"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                                />
                                            </div>
                                            <p className="text-[10px] text-[#1C1C1C]/40 mt-1">Set the retail price for this product.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Description</label>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors resize-none"
                                        />
                                        <p className="text-[10px] text-[#1C1C1C]/40 mt-1">Short marketing description shown in the public catalogue.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-3">Dimensions (CM)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#1C1C1C]/60 mb-1.5">Width</label>
                                        <input
                                            type="number"
                                            value={editForm.width}
                                            onChange={(e) => setEditForm({ ...editForm, width: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#1C1C1C]/60 mb-1.5">Height</label>
                                        <input
                                            type="number"
                                            value={editForm.height}
                                            onChange={(e) => setEditForm({ ...editForm, height: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#1C1C1C]/60 mb-1.5">Depth</label>
                                        <input
                                            type="number"
                                            value={editForm.depth}
                                            onChange={(e) => setEditForm({ ...editForm, depth: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Available Colours */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-3">Available Colours</p>
                                <div className="flex gap-3 flex-wrap">
                                    {allColorOptions.map((color) => (
                                        <button
                                            key={color.hex}
                                            onClick={() => toggleColor(color.hex)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${editForm.colors.includes(color.hex) ? "border-[#663F23] scale-110 shadow-md" : "border-[#E5E5E5]"}`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                    <button className="w-10 h-10 rounded-full border-2 border-dashed border-[#E5E5E5] flex items-center justify-center text-[#1C1C1C]/30 hover:border-[#663F23] hover:text-[#663F23] transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-[#1C1C1C]/40 mt-2">Select existing swatches or add a new colour option.</p>
                            </div>

                            {/* Materials */}
                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-[#1C1C1C]/50 uppercase tracking-wider mb-3">Manage Textures / Materials</p>
                                <div className="flex flex-wrap gap-2">
                                    {allMaterials.map((mat) => (
                                        <button
                                            key={mat}
                                            onClick={() => toggleMaterial(mat)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${editForm.materials.includes(mat) ? "bg-[#663F23] text-white" : "bg-white border border-[#E5E5E5] text-[#1C1C1C]/70 hover:border-[#663F23]"}`}
                                        >
                                            {mat}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-[#1C1C1C]/40 mt-2">Toggle which materials are available for this product.</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]/50">
                                <button
                                    onClick={handleDeleteProduct}
                                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Delete product
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCloseEdit}
                                        className="px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative bg-[#F5F1E8] rounded-xl shadow-2xl max-w-lg w-full p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-[#1C1C1C]">Add New Product</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-[#1C1C1C]/40 hover:text-[#1C1C1C]">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Product Name</label>
                                <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">SKU</label>
                                <input type="text" value={addForm.sku} onChange={e => setAddForm({ ...addForm, sku: e.target.value })} className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Category</label>
                                <div className="relative">
                                    <select value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} className="appearance-none w-full px-3 py-2.5 pr-10 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23]">
                                        <option value="Sofa">Sofa</option>
                                        <option value="Chair">Chair</option>
                                        <option value="Table">Table</option>
                                        <option value="Bed">Bed</option>
                                        <option value="Storage">Storage</option>
                                        <option value="Lighting">Lighting</option>
                                        <option value="Decor">Decor</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#1C1C1C]/40">Rs.</span>
                                    <input type="number" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: Number(e.target.value) })} className="w-full pl-9 pr-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Description</label>
                                <textarea value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-white rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#663F23] resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">Image Upload</label>
                                <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#663F23]/50 transition-colors bg-[#FAFAF8] relative">
                                    {addForm.image ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-sm text-[#663F23] truncate max-w-[250px]">Image selected</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload size={20} className="text-[#1C1C1C]/30" />
                                            <p className="text-sm font-medium text-[#1C1C1C]/60">Click to upload</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setAddForm({ ...addForm, image: URL.createObjectURL(e.target.files[0]) });
                                        }
                                    }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]/50">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#1C1C1C] bg-white border border-[#E5E5E5] rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleAddProductSubmit} className="px-4 py-2 text-sm font-medium text-[#F5F1E8] bg-[#663F23] rounded-lg hover:bg-[#4A2D19] transition-colors shadow-sm">Add Product</button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
            )}

            {isDeleteModalOpen && editForm && (
                <ConfirmModal
                    title="Delete Product"
                    message={`Are you sure you want to delete ${editForm.name}? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}

            {isLogoutModalOpen && (
                <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout from Livora admin panel?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
            )}
        </div>
    );
}