"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OverviewData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalConsultations: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
}

function normalizeOverview(raw: any): OverviewData {
  if (raw?.totalRevenue !== undefined) return raw;
  return {
    totalRevenue: raw?.revenue?.amount ?? 0,
    totalOrders: raw?.revenue?.orders ?? raw?.orders?.thisMonth ?? 0,
    totalUsers: raw?.users?.total ?? 0,
    totalConsultations: raw?.consultations?.total ?? 0,
    totalProducts: raw?.products?.total ?? 0,
    revenueGrowth: raw?.revenue?.growth ?? 0,
    orderGrowth: 0,
    userGrowth: raw?.users?.growth ?? 0,
  };
}

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface PopularProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

interface UserGrowthPoint {
  date: string;
  count: number;
}

interface CategoryBreakdown {
  _id: string;
  revenue: number;
  count: number;
}

const PIE_COLORS = [
  "#663F23",
  "#8B5E3C",
  "#C6A75E",
  "#A0522D",
  "#D2B48C",
  "#6B4226",
  "#CD853F",
  "#DEB887",
];

type DateRange = 7 | 30 | 90;

export default function AnalyticsPage() {
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(30);

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);

  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isRevenueLoading, setIsRevenueLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isUserGrowthLoading, setIsUserGrowthLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setIsOverviewLoading(true);
      const res = await api.get("/api/analytics/overview");
      setOverview(normalizeOverview(res.data.data));
    } catch {
      setError("Failed to load overview data");
    } finally {
      setIsOverviewLoading(false);
    }
  }, []);

  const fetchRevenue = useCallback(async (days: number) => {
    try {
      setIsRevenueLoading(true);
      const res = await api.get(`/api/analytics/revenue-chart?days=${days}`);
      const raw = res.data.data || [];
      setRevenueData(raw.map((d: any) => ({ date: d._id || d.date, revenue: d.revenue || 0 })));
    } catch {
      console.error("Failed to load revenue chart");
    } finally {
      setIsRevenueLoading(false);
    }
  }, []);

  const fetchPopularProducts = useCallback(async () => {
    try {
      setIsProductsLoading(true);
      const res = await api.get("/api/analytics/popular-products");
      const raw = res.data.data || [];
      setPopularProducts(raw.map((d: any) => ({ _id: d._id, name: d.name, totalSold: d.totalQuantity || d.totalSold || 0, revenue: d.totalRevenue || d.revenue || 0 })));
    } catch {
      console.error("Failed to load popular products");
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  const fetchUserGrowth = useCallback(async (days: number) => {
    try {
      setIsUserGrowthLoading(true);
      const res = await api.get(`/api/analytics/user-growth?days=${days}`);
      const raw = res.data.data || [];
      setUserGrowthData(raw.map((d: any) => ({ date: d._id || d.date, count: d.count || 0 })));
    } catch {
      console.error("Failed to load user growth");
    } finally {
      setIsUserGrowthLoading(false);
    }
  }, []);

  const fetchCategoryBreakdown = useCallback(async () => {
    try {
      setIsCategoryLoading(true);
      const res = await api.get("/api/analytics/category-breakdown");
      const raw = res.data.data || [];
      setCategoryData(raw.map((d: any) => ({ _id: d._id || "Unknown", revenue: d.revenue || 0, count: d.quantity || d.count || 0 })));
    } catch {
      console.error("Failed to load category breakdown");
    } finally {
      setIsCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchPopularProducts();
    fetchCategoryBreakdown();
  }, [fetchOverview, fetchPopularProducts, fetchCategoryBreakdown]);

  useEffect(() => {
    fetchRevenue(dateRange);
    fetchUserGrowth(dateRange);
  }, [dateRange, fetchRevenue, fetchUserGrowth]);

  const handleRefresh = () => {
    setError(null);
    fetchOverview();
    fetchRevenue(dateRange);
    fetchPopularProducts();
    fetchUserGrowth(dateRange);
    fetchCategoryBreakdown();
    setToastConfig({ message: "Dashboard refreshed", type: "info" });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-US").format(val);

  const statCards = overview
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(overview.totalRevenue),
          growth: overview.revenueGrowth,
          icon: DollarSign,
          color: "bg-[#663F23]",
        },
        {
          title: "Total Orders",
          value: formatNumber(overview.totalOrders),
          growth: overview.orderGrowth,
          icon: ShoppingCart,
          color: "bg-[#8B5E3C]",
        },
        {
          title: "Total Users",
          value: formatNumber(overview.totalUsers),
          growth: overview.userGrowth,
          icon: Users,
          color: "bg-[#C6A75E]",
        },
        {
          title: "Total Products",
          value: formatNumber(overview.totalProducts),
          growth: 0,
          icon: Package,
          color: "bg-[#A0522D]",
        },
      ]
    : [];

  const CustomTooltipRevenue = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3">
          <p className="text-xs text-[#666] mb-1">{label}</p>
          <p className="text-sm font-semibold text-[#663F23]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipProducts = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3">
          <p className="text-xs font-medium text-[#1C1C1C] mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-xs text-[#666]">
            Sold: {formatNumber(payload[0].payload.totalSold)}
          </p>
          <p className="text-xs text-[#666]">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipUserGrowth = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3">
          <p className="text-xs text-[#666] mb-1">{label}</p>
          <p className="text-sm font-semibold text-[#663F23]">
            {formatNumber(payload[0].value)} users
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3">
          <p className="text-xs font-medium text-[#1C1C1C] mb-1">
            {payload[0].payload._id}
          </p>
          <p className="text-xs text-[#666]">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-[#666]">
            Products: {formatNumber(payload[0].payload.count)}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartLoader = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-[#663F23] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-[#1C1C1C] flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E5E5E5]/60 w-full pl-14 md:pl-10">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#663F23]" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                  Analytics Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-[#888] mt-0.5">
                  Monitor your business performance and trends
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="hidden sm:flex items-center bg-[#F5F1E8] rounded-lg p-1">
                {([7, 30, 90] as DateRange[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateRange(d)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      dateRange === d
                        ? "bg-[#663F23] text-white shadow-sm"
                        : "text-[#666] hover:text-[#1C1C1C]"
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-[#F5F1E8] text-[#666] hover:text-[#663F23] transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Date Range */}
        <div className="sm:hidden px-4 pt-4">
          <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
            {([7, 30, 90] as DateRange[]).map((d) => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                  dateRange === d
                    ? "bg-[#663F23] text-white shadow-sm"
                    : "text-[#666] hover:text-[#1C1C1C]"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-4 sm:mx-6 md:mx-10 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={handleRefresh}
              className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-10 py-6 space-y-6">
          {/* Stat Cards */}
          {isOverviewLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40 animate-pulse"
                >
                  <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
                  <div className="h-8 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[#888] uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div
                      className={`${card.color} p-2 rounded-lg`}
                    >
                      <card.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1C1C1C] mb-1">
                    {card.value}
                  </p>
                  {card.growth !== 0 && (
                    <div className="flex items-center gap-1">
                      {card.growth > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          card.growth > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(card.growth).toFixed(1)}%
                      </span>
                      <span className="text-xs text-[#aaa]">vs last period</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#1C1C1C]">
                    Revenue Overview
                  </h3>
                  <p className="text-xs text-[#888] mt-0.5">
                    Last {dateRange} days
                  </p>
                </div>
              </div>
              {isRevenueLoading ? (
                <ChartLoader />
              ) : revenueData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#888]">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No revenue data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#663F23"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#663F23"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E5E5"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltipRevenue />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#663F23"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#663F23", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Popular Products */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1C1C1C]">
                  Popular Products
                </h3>
                <p className="text-xs text-[#888] mt-0.5">
                  By revenue generated
                </p>
              </div>
              {isProductsLoading ? (
                <ChartLoader />
              ) : popularProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#888]">
                  <Package className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No product data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={popularProducts.slice(0, 8)}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E5E5"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#555" }}
                      width={100}
                      tickFormatter={(v) =>
                        v.length > 14 ? v.slice(0, 14) + "..." : v
                      }
                    />
                    <Tooltip content={<CustomTooltipProducts />} />
                    <Bar
                      dataKey="revenue"
                      fill="#663F23"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User Growth */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1C1C1C]">
                  User Growth
                </h3>
                <p className="text-xs text-[#888] mt-0.5">
                  New registrations - last {dateRange} days
                </p>
              </div>
              {isUserGrowthLoading ? (
                <ChartLoader />
              ) : userGrowthData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#888]">
                  <Users className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No user growth data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E5E5"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      dx={-10}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltipUserGrowth />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#663F23"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#663F23", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#663F23", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1C1C1C]">
                  Category Breakdown
                </h3>
                <p className="text-xs text-[#888] mt-0.5">
                  Revenue by product category
                </p>
              </div>
              {isCategoryLoading ? (
                <ChartLoader />
              ) : categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#888]">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No category data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="revenue"
                      nameKey="_id"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categoryData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs text-[#555]">{value}</span>
                      )}
                      iconSize={10}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User Growth (larger, spanning full width on desktop) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]/40 lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1C1C1C]">
                  Top Selling Products
                </h3>
                <p className="text-xs text-[#888] mt-0.5">
                  Ranked by units sold
                </p>
              </div>
              {isProductsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center gap-4 p-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-2 w-20 bg-gray-200 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {popularProducts.slice(0, 10).map((product, idx) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F8F6F0] transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            PIE_COLORS[idx % PIE_COLORS.length],
                        }}
                      >
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1C1C] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#888]">
                          {formatNumber(product.totalSold)} units sold
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#663F23]">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  ))}
                  {popularProducts.length === 0 && (
                    <p className="text-sm text-[#888] text-center py-8">
                      No product data available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}
    </div>
  );
}
