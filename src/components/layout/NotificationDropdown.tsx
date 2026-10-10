"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Trash2, X } from "lucide-react";
import { api } from "../../services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await api.admin.getNotifications();
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else {
          setNotifications(getMockData());
        }
      } catch (error) {
        setNotifications(getMockData());
      }
    };
    
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    }
  ];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));
    if (!id.startsWith("mock")) {
      try {
        await api.admin.markNotificationRead(id);
      } catch (e) {}
    }
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    try {
      await api.admin.markAllNotificationsRead();
    } catch (e) {}
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
      >
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-bright opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary ring-2 ring-white"></span>
          </span>
        )}
        <Bell className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-200/20 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary-bright font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">No notifications</p>
                <p className="text-xs text-gray-500 mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`group relative p-4 hover:bg-gray-50 transition-colors flex gap-3 ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    {!notification.is_read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>
                    )}
                    
                    <div className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      notification.title.includes("Registration") 
                        ? "bg-success/10 text-success" 
                        : notification.title.includes("Booking")
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-medium truncate ${
                          !notification.is_read 
                            ? "text-gray-900" 
                            : "text-gray-600"
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {formatTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.is_read && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                          className="p-1.5 text-gray-400 hover:text-success hover:bg-success/10 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-md transition-colors"
                        title="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 bg-gray-50 text-center">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors inline-block w-full py-1"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
