"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useDialog } from "../../hooks/useDialog";
import {
  LayoutDashboard,
  Users,
  HardHat,
  Building2,
  Calendar,
  Layers,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Shield,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { confirm } = useDialog();

  const handleLogoutClick = () => {
    confirm(
      "Confirm Session End",
      "Are you sure you want to terminate your administration session and log out?",
      logout
    );
  };

  const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Workers", href: "/workers", icon: HardHat },
    { name: "Contractors", href: "/contractors", icon: Building2 },
    { name: "Services", href: "/services", icon: Layers },
    { name: "Wallets & Earnings", href: "/wallets", icon: Wallet },
    { name: "System Roles", href: "/roles", icon: Shield },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 bg-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-lg shadow-sm">
              HM
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              Hunar Mitra <span className="text-orange-600 font-medium">Admin</span>
            </span>
          </Link>
          <button
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Platform Navigation
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon
                  className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Profile at Bottom */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white font-semibold text-sm">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-gray-900">Admin Owner</p>
                <p className="text-xs truncate text-gray-500">System Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
