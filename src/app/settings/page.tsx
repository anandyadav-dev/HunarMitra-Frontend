"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Settings,
  Database,
  Link2,
  HardHat,
  CheckCircle,
  AlertCircle,
  Server,
  FileCode,
  ShieldAlert,
} from "lucide-react";

export default function SettingsPage() {
  const [sysStatus, setSysStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemDiagnostics();
  }, []);

  const fetchSystemDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch stats to test connection and get totals
      const stats = await api.admin.getStats();
      setSysStatus({
        status: "online",
        apiVersion: "v1.0.0",
        dbConnection: "healthy",
        apiEndpoint: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
        metrics: {
          totalUsers: stats.total_users,
          totalBookings: stats.total_bookings,
          totalRevenue: stats.total_revenue,
        },
      });
    } catch (err: any) {
      setError(err.message || "FastAPI backend is offline or unreachable.");
      setSysStatus({
        status: "offline",
        apiVersion: "unknown",
        dbConnection: "unreachable",
        apiEndpoint: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
        metrics: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">System Diagnostics & Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          View FastAPI backend parameters, database connection details, and administrative policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Connection Diagnostics Card */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Server className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">Connection Diagnostics</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              
              {/* Endpoint check */}
              <div className="flex flex-col gap-1 border-b border-gray-50 pb-2">
                <span className="text-gray-400 font-medium">API Base Endpoint</span>
                <span className="font-semibold text-gray-800 break-all">{sysStatus?.apiEndpoint}</span>
              </div>

              {/* API status check */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-400 font-medium">FastAPI Backend Status</span>
                {sysStatus?.status === "online" ? (
                  <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] text-green-700 border border-green-150">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] text-red-700 border border-red-150 animate-pulse">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Offline
                  </span>
                )}
              </div>

              {/* DB check */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-400 font-medium">MySQL DB Connection</span>
                {sysStatus?.dbConnection === "healthy" ? (
                  <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                    <Database className="h-3.5 w-3.5 text-green-500" />
                    Healthy
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-semibold animate-pulse">
                    <Database className="h-3.5 w-3.5 text-red-500" />
                    Offline
                  </span>
                )}
              </div>

              {/* Version check */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-400 font-medium">API Version</span>
                <span className="font-bold text-gray-800">{sysStatus?.apiVersion}</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={fetchSystemDiagnostics}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Run Diagnostic Checks
            </button>
          </div>
        </div>

        {/* System Settings & Policy Info */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Link2 className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">Database Schema Configurations</h3>
          </div>

          <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
            <div className="flex items-start gap-3">
              <FileCode className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">Hierarchical RBAC Policy</h4>
                <p className="mt-1 text-gray-500">
                  User accounts inherit roles recursively. For example, role <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-800 font-semibold border border-gray-100">plumber</code> parent references <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-800 font-semibold border border-gray-100">worker</code>, granting inheritances of general artisan attributes automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-gray-50 pt-4">
              <ShieldAlert className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">Financial Ledger Policy</h4>
                <p className="mt-1 text-gray-500">
                  Marketplace completions verify 6-digit cryptographic OTP tokens shared from customers. On verification, wallet transfers deduct from the customer&apos;s balance and deposit payouts directly to the worker&apos;s wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
