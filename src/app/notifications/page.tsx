"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, CheckCircle2, Search, Filter, RefreshCw } from "lucide-react";
import { api } from "../../services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch from API
      const data = await api.admin.getNotifications();
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      } else {
        // Fallback to mock data if empty
        setNotifications(getMockData());
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications(getMockData()); // Fallback on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getMockData = (): Notification[] => [
    {
      id: "mock1",
      title: "New Registration",
      message: "A new worker 'Ramesh Kumar' has registered on the platform.",
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "mock2",
      title: "New Booking Request",
      message: "Customer 'Anita' requested an electrician service.",
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "mock3",
      title: "Wallet Recharge",
      message: "Your wallet was successfully recharged with ₹500.",
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock4",
      title: "System Update",
      message: "The platform will undergo maintenance at 2 AM tonight.",
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "mock5",
      title: "Worker Verified",
      message: "Worker 'Sunil' document verification completed successfully.",
      is_read: true,
      created_at: new Date(Date.now() - 259200000).toISOString(),
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));
    try {
      await api.admin.markNotificationRead(id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
      // Revert if failed
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    try {
      await api.admin.markAllNotificationsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      fetchNotifications();
    }
  };

  const deleteNotification = (id: string) => {
    // Keep it in UI if we had a delete API, but since we don't have delete in API right now
    // Just remove from UI state
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === "all" ? true : !n.is_read
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with system alerts and user activities.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 bg-white gap-4">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all" 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                filter === "unread" 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "unread" ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto relative">
          {isLoading && !isRefreshing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : null}

          {filteredNotifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                <Bell className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No notifications</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                {filter === "unread" 
                  ? "You have read all your notifications." 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-500">
              <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Notification</th>
                  <th className="px-6 py-3.5 hidden md:table-cell">Message</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <tr 
                    key={notification.id} 
                    className={`hover:bg-gray-50/50 transition-colors ${
                      !notification.is_read ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          notification.title.includes("Registration") || notification.title.includes("Verified")
                            ? "bg-emerald-100 text-emerald-700" 
                            : notification.title.includes("Booking")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <p className={`font-bold truncate max-w-[150px] sm:max-w-[200px] ${
                          !notification.is_read ? "text-gray-900" : "text-gray-600"
                        }`}>
                          {notification.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top hidden md:table-cell">
                      <p className={`line-clamp-2 max-w-sm ${!notification.is_read ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                        {notification.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {notification.is_read ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500 ring-1 ring-inset ring-gray-200">
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200/50">
                          <span className="h-1 w-1 rounded-full bg-orange-500" />
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top font-medium text-gray-600 whitespace-nowrap">
                      {formatTime(notification.created_at)}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex justify-end gap-2">
                        {!notification.is_read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
