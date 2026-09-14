"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLoaderEvent = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setIsLoading(customEvent.detail);
    };

    window.addEventListener("global-loader", handleLoaderEvent);
    return () => {
      window.removeEventListener("global-loader", handleLoaderEvent);
    };
  }, []);

  // Dismiss loader on route change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Intercept anchor clicks for instant loading feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as Element).closest('a');
      
      // If it's a valid internal link and not just an anchor on the same page
      if (target && target.href && !target.target && !e.ctrlKey && !e.metaKey) {
        try {
          const url = new URL(target.href);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
            setIsLoading(true);
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        {/* Outer glowing ring */}
        <div className="absolute w-24 h-24 border-[3px] border-[var(--orange)]/20 rounded-full animate-ping"></div>
        
        {/* Inner spinning rings */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-full h-full border-[3px] border-t-[var(--orange)] border-r-[var(--orange-bright)] border-b-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,94,0,0.4)]"></div>
          <div className="absolute w-10 h-10 border-[3px] border-b-[var(--orange-press)] border-l-[var(--orange)] border-t-transparent border-r-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>
        
        {/* Loading Text */}
        <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-[var(--orange-text)] uppercase animate-pulse">
          Processing...
        </p>
      </div>
    </div>
  );
}
