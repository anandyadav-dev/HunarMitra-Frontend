"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600" />
          <p className="text-sm font-semibold text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // The Login page has its own standalone full-screen layout
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Workspace Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation & Status bar */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl page-container-fade" key={pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
