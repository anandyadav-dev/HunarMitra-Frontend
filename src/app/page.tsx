"use client";

import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  TrendingUp,
  Users,
  HardHat,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.admin.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isLoading && !isRefreshing) {
    return (
      <div className="space-y-8 py-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-gray-150 rounded-xl p-6 space-y-3 shadow-sm">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts & Bottom Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white border border-gray-150 rounded-xl animate-pulse" />
          <div className="h-96 bg-white border border-gray-150 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-50 p-3 ring-8 ring-red-100/50">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mt-4 text-base font-bold text-gray-900">Failed to Load Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="mt-6 inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Format booking status split chart data
  const bookingsStatusChartData = Object.keys(stats?.bookings_by_status || {}).map((key) => ({
    name: key.toUpperCase(),
    bookings: stats.bookings_by_status[key],
  }));

  // Recharts custom tooltips for premium look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-md">
          <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-gray-900">
            Rs. {payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-md">
          <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-gray-900">{payload[0].value} Booking(s)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
            Good morning, Admin
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of your marketplace activities and verified partner performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/services"
            className="inline-flex items-center rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none transition-colors"
          >
            Manage Services
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Users */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Marketplace Users</span>
            <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">{stats?.total_users}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <span>Workers: {stats?.total_workers}</span>
            <span>•</span>
            <span>Contractors: {stats?.total_contractors}</span>
          </div>
        </div>

        {/* Active Workers */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">KYC Status Checklist</span>
            <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
              <HardHat className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${stats?.pending_kycs_count > 0 ? "text-yellow-600" : "text-gray-900"}`}>
              {stats?.pending_kycs_count}
            </span>
            <span className="text-xs text-gray-400 font-medium">Pending reviews</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <Link href="/workers" className="text-[10px] font-bold text-orange-600 hover:text-orange-500 flex items-center gap-0.5">
              Review documents <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Ongoing Bookings</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">{stats?.active_bookings_count}</span>
            <span className="text-xs text-gray-400 font-medium">Active jobs</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <span>Total bookings logged: {stats?.total_bookings}</span>
          </div>
        </div>

        {/* Revenue Volume */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Volume Cleared</span>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-xs text-gray-500 font-bold">Rs.</span>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {stats?.total_revenue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <span>Total Escrows Balance: Rs. {stats?.total_balances.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart (2/3 Width) */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Revenue Ledger volume</h3>
              <p className="text-xs text-gray-400 mt-0.5">Sum of completed booking payments over the last 30 days.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Last 30 Days
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue_by_date} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
                  dy={10}
                  tickFormatter={(tick) => {
                    const d = new Date(tick);
                    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(val) => `Rs.${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff6b00"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Status Split (1/3 Width) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900">Job Bookings Statuses</h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribution of bookings across all statuses.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsStatusChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 9, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="bookings" fill="#111827" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Activity Feed & Service Share Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Feed (2/3 Width) */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-6">Recent Marketplace Activities</h3>
            <div className="space-y-4">
              {stats?.recent_activities?.map((act: any) => {
                const isKyc = act.type === "kyc";
                const isBooking = act.type === "booking";
                
                return (
                  <div key={act.id} className="flex gap-4 items-start text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 shrink-0">
                      {isKyc ? (
                        <div className="h-5 w-5 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                          <HardHat className="h-3 w-3" />
                        </div>
                      ) : isBooking ? (
                        <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Calendar className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                          <Users className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{act.message}</p>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {" - "}
                        {new Date(act.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {stats?.recent_activities?.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400 font-medium">
                  No recent activity logged in the database.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Category Performance share (1/3 Width) */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Service Category Distribution</h3>
          
          <div className="space-y-4">
            {stats?.category_performance?.map((cat: any, index: number) => {
              // Calculate width percentage relative to max count
              const maxCount = Math.max(...stats.category_performance.map((c: any) => c.count)) || 1;
              const widthPct = (cat.count / maxCount) * 100;
              
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>{cat.category}</span>
                    <span className="text-gray-900 font-bold">{cat.count} booking(s)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats?.category_performance?.length === 0 && (
              <div className="text-center py-10 text-xs text-gray-400 font-medium">
                No service bookings logged yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
