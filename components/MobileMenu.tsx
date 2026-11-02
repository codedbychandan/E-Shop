"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LayoutGrid,
  LogIn,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { firstName } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-r border-line bg-surface"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-lg font-bold">
                E-<span className="text-brand-600 dark:text-brand-400">Shop</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="btn-ghost h-9 w-9 rounded-full p-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                        pathname === l.href
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                          : "text-ink hover:bg-surface2"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { href: "/wishlist", label: "Wishlist", icon: Heart },
                  { href: "/orders", label: "Orders", icon: Package },
                  { href: "/cart", label: "Cart", icon: ShoppingBag },
                  { href: "/account", label: "Profile", icon: User },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-2xl border border-line bg-surface2 px-3 py-3 text-sm font-medium transition-colors hover:border-brand-300"
                  >
                    <item.icon size={16} className="text-muted" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-line p-4">
              {user ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      Hi, {firstName(user.name)}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      useAuthStore.getState().logout();
                      setOpen(false);
                    }}
                    className="btn-outline h-9 px-4 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="btn-outline h-10 text-sm"
                  >
                    <LogIn size={16} /> Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary h-10 text-sm"
                  >
                    <UserPlus size={16} /> Register
                  </Link>
                </div>
              )}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-muted">
                {[
                  { href: "/faq", label: "FAQ", icon: Settings },
                  { href: "/deals", label: "Deals", icon: Percent },
                  { href: "/categories", label: "Categories", icon: LayoutGrid },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-2 py-2 transition-colors hover:bg-surface2 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}
