"use client";

import { useEffect, type ReactNode } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { QuickView } from "@/components/QuickView";
import { SearchOverlay } from "@/components/SearchOverlay";
import { Toaster } from "@/components/Toaster";
import { useMounted } from "@/hooks/useMounted";
import { useThemeStore } from "@/store/theme-store";

function ThemeEffect() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
  }, [theme]);
  return null;
}

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  // Render the app only after client hydration. This keeps server-rendered
  // markup in sync with the localStorage-backed stores (cart, wishlist,
  // products, orders…) and avoids React hydration mismatches after users
  // modify data.
  const mounted = useMounted();

  return (
    <>
      <ThemeEffect />
      <ScrollToTop />
      {mounted ? (
        <>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickView />
          <Toaster />
        </>
      ) : (
        <div className="flex min-h-screen items-center justify-center" aria-hidden>
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      )}
    </>
  );
}
