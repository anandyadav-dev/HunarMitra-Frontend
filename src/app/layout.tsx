import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { DialogProvider } from "../hooks/useDialog";
import AppContent from "./AppContent";
import GlobalLoader from "../components/GlobalLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Hunar Mitra - Administration Dashboard",
  description: "Operations dashboard for managing Customers, Artisans, and bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans h-full antialiased`}>
        <AuthProvider>
          <DialogProvider>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
              <AppContent>{children}</AppContent>
            </Suspense>
            <GlobalLoader />
          </DialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

