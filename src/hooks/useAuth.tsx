"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial authentication
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("hunarmitra_admin_token");
      
      if (storedToken) {
        // Quick local check for token expiry to avoid hanging or unnecessary API calls
        try {
          const payloadBase64 = storedToken.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));
          const isExpired = payload.exp && (payload.exp * 1000 < Date.now());
          
          if (isExpired) {
            console.warn("Token is expired locally.");
            localStorage.removeItem("hunarmitra_admin_token");
            setToken(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Invalid token format:", e);
          localStorage.removeItem("hunarmitra_admin_token");
          setToken(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          // Verify token by fetching admin stats
          await api.auth.getProfile(storedToken);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed:", error);
          // Token expired or invalid
          localStorage.removeItem("hunarmitra_admin_token");
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const sendOtp = async (phone: string) => {
    await api.auth.sendOtp(phone);
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const res = await api.auth.verifyOtp(phone, otp);
    const accessToken = res.access_token;
    
    // Check if the user has admin roles by calling stats
    try {
      await api.auth.getProfile(accessToken);
      localStorage.setItem("hunarmitra_admin_token", accessToken);
      setToken(accessToken);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err) {
      throw new Error("Access denied. Admin role required to log in to this dashboard.");
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("hunarmitra_admin_token");
    setToken(null);
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  // Auto logout on inactivity (15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const activityEvents = ["mousemove", "mousedown", "keypress", "scroll", "click", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      if (elapsed >= INACTIVITY_TIMEOUT) {
        console.warn("Auto logging out due to 15 minutes of inactivity.");
        logout();
      }
    }, 10000); // Check status every 10 seconds

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(checkInterval);
    };
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, token, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
