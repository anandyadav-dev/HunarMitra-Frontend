"use client";

import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Users,
  HardHat,
  Building2,
  PhoneCall,
  AlertCircle,
  RefreshCw,
  Star,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, workersData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getWorkers({ limit: 5 }) // Fetch recent/top workers
      ]);
      setStats(statsData);
      setWorkers(workersData.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-50 p-3 ring-8 ring-red-100/50">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mt-4 text-base font-bold text-gray-900">Failed to Load Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{error}</p>
        <button
          onClick={fetchData}
          className="mt-6 inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
            Platform Overview
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor customer call history and verify worker profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Customers</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-gray-900">{stats?.total_users || 0}</span>
          </div>
        </div>

        {/* Workers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Workers</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <HardHat className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-gray-900">{stats?.total_workers || 0}</span>
          </div>
        </div>

        {/* Pending KYC */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending KYCs</span>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tight ${stats?.pending_kycs_count > 0 ? "text-orange-600" : "text-gray-900"}`}>
              {stats?.pending_kycs_count || 0}
            </span>
          </div>
          <div className="mt-2">
            <Link href="/workers" className="text-[10px] font-bold text-orange-600 hover:underline">
              Review Action Required &rarr;
            </Link>
          </div>
        </div>

        {/* Contractors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Contractors</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-gray-900">{stats?.total_contractors || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workers List */}
        <div className="rounded-xl border border-gray-200 bg-white flex flex-col shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <HardHat className="h-4 w-4 text-emerald-600" /> Workers Roster
              </h3>
              <p className="text-xs text-gray-500 mt-1">Recently registered or verified workers.</p>
            </div>
            <Link href="/workers" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
              View All
            </Link>
          </div>
          <div className="p-2 flex-1 flex flex-col">
            {workers.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {workers.map((worker) => (
                  <div key={worker.id} className="p-3 flex items-center gap-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-emerald-700 font-bold text-sm">
                        {worker.user?.full_name?.charAt(0) || "W"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {worker.user?.full_name || "Unknown"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400" /> {worker.rating || "New"}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" /> {worker.pricing_per_hour}/hr
                        </span>
                        {worker.kyc_status === 'approved' && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/workers/${worker.id}`}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <HardHat className="h-10 w-10 text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-600">No Workers Found</p>
                <p className="text-xs text-gray-400 mt-1">Workers will appear here once registered.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Call History (Placeholder) */}
        <div className="rounded-xl border border-gray-200 bg-white flex flex-col shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-blue-600" /> Customer Call History
            </h3>
            <p className="text-xs text-gray-500 mt-1">Track which customer called which worker.</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 rounded-b-xl">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <PhoneCall className="h-8 w-8 text-blue-300" />
            </div>
            <p className="text-sm font-bold text-gray-700">Call Logging Active</p>
            <p className="text-xs text-gray-500 mt-2 max-w-[250px]">
              When customers start calling workers from the mobile app, the connection history will be displayed here.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Monitoring Incoming App Calls
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
