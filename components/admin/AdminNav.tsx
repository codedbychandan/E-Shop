"use client";

import { BarChart3, LayoutDashboard, Package, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Admin">
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-muted hover:bg-surface2 hover:text-ink"
                )}
              >
                <l.icon size={15} /> {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand-600"
        >
          <Store size={15} /> View store
        </Link>
      </div>
    </div>
  );
}
