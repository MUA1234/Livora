"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Users,
  Edit3,
  X,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Search,
  Crown,
  Eye,
  Settings,
  UserCheck,
  Lock,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const ALL_PERMISSIONS = [
  "manage_products",
  "manage_orders",
  "manage_consultations",
  "manage_designs",
  "manage_users",
  "manage_promo_codes",
  "view_analytics",
  "manage_inventory",
  "manage_settings",
  "manage_templates",
] as const;

type Permission = (typeof ALL_PERMISSIONS)[number];

const ROLE_OPTIONS = ["lead_designer", "manager", "designer", "viewer"] as const;
type AdminRole = (typeof ROLE_OPTIONS)[number];

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  adminRole: AdminRole;
  permissions: Permission[];
  createdAt: string;
}

interface RoleDefaults {
  lead_designer: Permission[];
  manager: Permission[];
  designer: Permission[];
  viewer: Permission[];
}

const permissionLabels: Record<Permission, string> = {
  manage_products: "Manage Products",
  manage_orders: "Manage Orders",
  manage_consultations: "Manage Consultations",
  manage_designs: "Manage Designs",
  manage_users: "Manage Users",
  manage_promo_codes: "Manage Promo Codes",
  view_analytics: "View Analytics",
  manage_inventory: "Manage Inventory",
  manage_settings: "Manage Settings",
  manage_templates: "Manage Templates",
};

const permissionIcons: Record<Permission, React.ReactNode> = {
  manage_products: <Settings className="w-3.5 h-3.5" />,
  manage_orders: <Settings className="w-3.5 h-3.5" />,
  manage_consultations: <Users className="w-3.5 h-3.5" />,
  manage_designs: <Edit3 className="w-3.5 h-3.5" />,
  manage_users: <UserCheck className="w-3.5 h-3.5" />,
  manage_promo_codes: <Settings className="w-3.5 h-3.5" />,
  view_analytics: <Eye className="w-3.5 h-3.5" />,
  manage_inventory: <Settings className="w-3.5 h-3.5" />,
  manage_settings: <Lock className="w-3.5 h-3.5" />,
  manage_templates: <Settings className="w-3.5 h-3.5" />,
};

const roleConfig: Record<AdminRole, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  lead_designer: { label: "Lead Designer", color: "text-[#92400E]", bg: "bg-amber-100", icon: <Crown className="w-4 h-4" /> },
  manager: { label: "Manager", color: "text-[#1E40AF]", bg: "bg-blue-100", icon: <Shield className="w-4 h-4" /> },
  designer: { label: "Designer", color: "text-[#065F46]", bg: "bg-emerald-100", icon: <Edit3 className="w-4 h-4" /> },
  viewer: { label: "Viewer", color: "text-[#6B7280]", bg: "bg-gray-100", icon: <Eye className="w-4 h-4" /> },
};

export default function RoleManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleDefaults, setRoleDefaults] = useState<RoleDefaults | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([...ALL_PERMISSIONS]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<AdminRole>("viewer");
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Permission matrix visibility
  const [showMatrix, setShowMatrix] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [usersRes, permissionsRes] = await Promise.all([
        api.get("/api/admin/roles/users"),
        api.get("/api/admin/roles/permissions"),
      ]);
      const usersData = usersRes.data.data || usersRes.data;
      setUsers(usersData?.users || usersData || []);
      const permData = permissionsRes.data.data || permissionsRes.data;
      if (permData?.permissions) {
        setAllPermissions(permData.permissions);
      }
      if (permData?.roleDefaults) {
        setRoleDefaults(permData.roleDefaults);
      }
      // Also extract from combined users endpoint if permissions came bundled
      if (usersData?.allPermissions) {
        setAllPermissions(usersData.allPermissions);
      }
      if (usersData?.roleDefaults) {
        setRoleDefaults(usersData.roleDefaults);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load role data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setEditRole(user.adminRole);
    setEditPermissions([...user.permissions]);
    setIsRoleDropdownOpen(false);
  };

  const handleRoleChange = (role: AdminRole) => {
    setEditRole(role);
    if (roleDefaults && roleDefaults[role]) {
      setEditPermissions([...roleDefaults[role]]);
    }
    setIsRoleDropdownOpen(false);
  };

  const togglePermission = (perm: Permission) => {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      setIsSaving(true);
      await api.put(`/api/admin/roles/users/${editingUser._id}`, {
        adminRole: editRole,
        permissions: editPermissions,
      });
      setToastConfig({ message: "Role updated successfully!", type: "success" });
      setEditingUser(null);
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update role.";
      setToastConfig({ message: msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#663F23]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#663F23]" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-[#1C1C1C] leading-snug">Role Management</h1>
                <p className="text-[13px] font-medium text-[#8C8C8C]">Manage admin roles and permissions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto space-y-6">
          {/* Role Overview Cards */}
          {!isLoading && !error && roleDefaults && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLE_OPTIONS.map((role) => {
                const config = roleConfig[role];
                const defaults = roleDefaults[role] || [];
                const userCount = users.filter((u) => u.adminRole === role).length;
                return (
                  <div
                    key={role}
                    className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#1C1C1C]">{config.label}</h3>
                        <p className="text-[11px] font-medium text-[#8C8C8C]">
                          {userCount} user{userCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {defaults.slice(0, 4).map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F5F1E8] text-[10px] font-semibold text-[#663F23]"
                        >
                          {permissionLabels[perm as Permission] || perm}
                        </span>
                      ))}
                      {defaults.length > 4 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F5F1E8] text-[10px] font-semibold text-[#8C8C8C]">
                          +{defaults.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Search and Matrix Toggle */}
          {!isLoading && !error && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-[500px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#A8A8A8]" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-medium text-[#1C1C1C] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#D4C3A3]/50 focus:border-[#D4C3A3] transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowMatrix(!showMatrix)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[13px] font-bold text-[#663F23] hover:bg-[#F5F1E8] transition-all shadow-sm"
              >
                <Shield className="w-4 h-4" />
                {showMatrix ? "Hide" : "Show"} Permission Matrix
              </button>
            </div>
          )}

          {/* Permission Matrix */}
          {showMatrix && roleDefaults && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F8F6F0]">
                <h2 className="text-[15px] font-bold text-[#1C1C1C]">Permission Matrix</h2>
                <p className="text-[12px] text-[#8C8C8C] mt-0.5">Default permissions for each role</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="text-left px-6 py-3 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                        Permission
                      </th>
                      {ROLE_OPTIONS.map((role) => (
                        <th key={role} className="text-center px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${roleConfig[role].bg} ${roleConfig[role].color}`}>
                            {roleConfig[role].icon}
                            {roleConfig[role].label}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions.map((perm, idx) => (
                      <tr
                        key={perm}
                        className={`border-b border-[#E5E5E5]/50 ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}`}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[#8C8C8C]">{permissionIcons[perm as Permission]}</span>
                            <span className="text-[13px] font-semibold text-[#1C1C1C]">
                              {permissionLabels[perm as Permission] || perm}
                            </span>
                          </div>
                        </td>
                        {ROLE_OPTIONS.map((role) => {
                          const hasIt = roleDefaults[role]?.includes(perm);
                          return (
                            <td key={role} className="text-center px-4 py-3">
                              {hasIt ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600">
                                  <Check className="w-4 h-4" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-300">
                                  <X className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admin Users Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#1C1C1C]">Admin Users</h2>
                <p className="text-[12px] text-[#8C8C8C] mt-0.5">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-[#663F23] animate-spin" />
                <p className="text-[#A8A8A8] font-medium">Loading users...</p>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-4">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-[#1C1C1C]">Something went wrong</h3>
                  <p className="text-[#A8A8A8] mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-6 py-2 bg-[#663F23] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  Try Again
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Users className="w-12 h-12 text-[#EBE7DF]" />
                <p className="text-[#A8A8A8] font-semibold">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      {["User", "Email", "Role", "Permissions", "Joined", "Actions"].map((h) => (
                        <th
                          key={h}
                          className={`px-6 py-3 text-[11px] font-bold text-[#A8A8A8] uppercase tracking-widest ${h === "Actions" ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => {
                      const rc = roleConfig[user.adminRole] || roleConfig.viewer;
                      return (
                        <tr
                          key={user._id}
                          className={`border-b border-[#E5E5E5]/50 hover:bg-[#F4F1ED]/50 transition-colors ${idx === filteredUsers.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#F5F1E8] flex items-center justify-center border border-[#EBE7DF]">
                                <span className="text-[12px] font-bold text-[#663F23]">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <span className="text-[14px] font-bold text-[#1C1C1C]">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-medium text-[#6C6C6C]">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${rc.bg} ${rc.color}`}>
                              {rc.icon}
                              {rc.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F5F1E8] text-[12px] font-bold text-[#663F23]">
                              {user.permissions?.length || 0} permission{(user.permissions?.length || 0) !== 1 ? "s" : ""}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-medium text-[#6C6C6C]">
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold text-[#663F23] hover:bg-[#F5F1E8] transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit Role
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Poppins',_sans-serif]">
          <div
            className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSaving && setEditingUser(null)}
          />
          <div className="relative bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E5E5E5]/60 flex items-center justify-between bg-white rounded-t-2xl">
              <div>
                <h3 className="text-[18px] font-bold text-[#1C1C1C]">Edit Role</h3>
                <p className="text-[13px] text-[#8C8C8C] mt-0.5">{editingUser.name}</p>
              </div>
              <button
                onClick={() => !isSaving && setEditingUser(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] text-[#A8A8A8] hover:text-[#1C1C1C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Role Selector */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[14px] font-semibold text-[#1C1C1C] hover:border-[#D4C3A3] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {roleConfig[editRole] && (
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold ${roleConfig[editRole].bg} ${roleConfig[editRole].color}`}>
                          {roleConfig[editRole].icon}
                          {roleConfig[editRole].label}
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#8C8C8C] transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isRoleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10 overflow-hidden">
                      {ROLE_OPTIONS.map((role) => {
                        const rc = roleConfig[role];
                        return (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F5F1E8] transition-colors ${editRole === role ? "bg-[#F5F1E8]" : ""}`}
                          >
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold ${rc.bg} ${rc.color}`}>
                              {rc.icon}
                              {rc.label}
                            </span>
                            {editRole === role && <Check className="w-4 h-4 text-[#663F23] ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-[12px] font-bold text-[#8C8C8C] uppercase tracking-widest mb-2">
                  Permissions ({editPermissions.length})
                </label>
                <div className="space-y-2">
                  {allPermissions.map((perm) => {
                    const isChecked = editPermissions.includes(perm);
                    const isDefault = roleDefaults?.[editRole]?.includes(perm);
                    return (
                      <label
                        key={perm}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isChecked ? "bg-white border border-[#663F23]/20" : "bg-white/50 border border-transparent hover:bg-white"}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 rounded accent-[#663F23]"
                        />
                        <span className="text-[#8C8C8C]">{permissionIcons[perm as Permission]}</span>
                        <span className="text-[13px] font-semibold text-[#1C1C1C] flex-1">
                          {permissionLabels[perm as Permission] || perm}
                        </span>
                        {isDefault && (
                          <span className="text-[10px] font-bold text-[#8C8C8C] bg-[#F5F1E8] px-2 py-0.5 rounded-md">
                            Default
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E5E5]/60 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => setEditingUser(null)}
                disabled={isSaving}
                className="px-4 py-2.5 text-[13px] font-bold text-[#1C1C1C] bg-transparent border border-[#E5E5E5] rounded-xl hover:bg-[#F5F1E8] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-[#663F23] rounded-xl hover:bg-[#4A2D19] transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastConfig && (
        <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(null)} />
      )}
    </div>
  );
}
