"use client";

import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SalesChart } from "@/components/admin/SalesChart";
import { Badge } from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/skeletons";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { formatDateTime, inr } from "@/lib/format";
import { STATUS_META } from "@/lib/orders";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const users = useAuthStore((s) => s.users);
  const loading = useSimulatedLoad(450);

  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSales = validOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Sales", value: inr(totalSales), icon: IndianRupee, tint: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300" },
    { label: "Orders", value: String(orders.length), icon: ShoppingCart, tint: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300" },
    { label: "Customers", value: String(users.length), icon: Users, tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { label: "Products", value: String(products.length), icon: Package, tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="heading-2">Dashboard</h1>
        <div className="mt-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-2">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your store&apos;s performance.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary h-10 text-sm">
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-line bg-surface p-5">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", s.tint)}>
              <s.icon size={18} />
            </span>
            <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + recent orders */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-line bg-surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="heading-3">Sales — last 7 days</h2>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="mt-4">
            <SalesChart orders={orders} />
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-3">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 rounded-2xl bg-surface2 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{o.id}</p>
                  <p className="truncate text-xs text-muted">{o.address.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{inr(o.total)}</p>
                  <span className={cn("inline-block h-1.5 w-1.5 rounded-full", STATUS_META[o.status].dot)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full recent orders table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="border-b border-line px-6 py-4">
          <h2 className="heading-3">Latest orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-line last:border-b-0 hover:bg-surface2">
                  <td className="px-6 py-3.5 font-semibold">{o.id}</td>
                  <td className="px-6 py-3.5">{o.address.fullName}</td>
                  <td className="px-6 py-3.5 font-semibold">{inr(o.total)}</td>
                  <td className="px-6 py-3.5">
                    <Badge tone="neutral">
                      <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", STATUS_META[o.status].dot)} />
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-muted">{formatDateTime(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
