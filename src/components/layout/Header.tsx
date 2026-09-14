"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search, ShieldCheck, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  // Get dynamic page title from pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    const parts = pathname.split("/");
    const section = parts[parts.length - 1];
    if (!section) return "Overview";
    return section.charAt(0).toUpperCase() + section.slice(1);
  };

  const getBreadcrumbs = () => {
    if (pathname === "/") return ["Dashboard", "Overview"];
    const parts = pathname.split("/").filter(Boolean);
    const breadcrumbs = ["Dashboard"];
    parts.forEach((p) => {
      breadcrumbs.push(p.charAt(0).toUpperCase() + p.slice(1));
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur px-6 shadow-sm shadow-gray-100/10">
      {/* Left side: Hamburger (mobile) + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-1.5 text-gray-500 hover:text-gray-900 lg:hidden rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <span className="text-gray-300">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? "text-gray-900 font-semibold" : ""}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="sm:hidden text-base font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>

      {/* Right side: Search, Status, Profile Info */}
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Connection
        </div>

        {/* Search */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings, workers..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-xs placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Theme Toggle Icon */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-600 ring-2 ring-white" />
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        {/* Profile Card */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900">Admin Controls</p>
            <p className="text-[10px] text-gray-400 font-medium">Root Access</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-200">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
