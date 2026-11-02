"use client";

import { motion } from "framer-motion";
import { Eye, PackageX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/skeletons";
import type { OrderStatus } from "@/data/types";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { formatDateTime, inr } from "@/lib/format";
import { STATUS_FLOW, STATUS_META } from "@/lib/orders";
import { useOrderStore } from "@/store/order-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";

const statusOptions: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const loading = useSimulatedLoad(380);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const changeStatus = (id: string, status: OrderStatus) => {
    updateStatus(id, status);
    toast(`Order ${id} marked as ${status}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-2">Orders</h1>
          <p className="mt-1 text-sm text-muted">
            {orders.length} total orders · status changes sync to the customer&apos;s order page.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | "All")}
          aria-label="Filter by status"
          className="input h-10 w-auto cursor-pointer"
        >
          <option value="All">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={7} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<PackageX size={26} />}
              title="No orders here"
              description="There are no orders with this status yet."
              actionLabel="Clear filter"
              onAction={() => setFilter("All")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Payment</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-line last:border-b-0 hover:bg-surface2"
                  >
                    <td className="px-6 py-3.5 font-semibold">{o.id}</td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium">{o.address.fullName}</p>
                      <p className="text-xs text-muted">{o.address.city}</p>
                    </td>
                    <td className="px-6 py-3.5 font-semibold">{inr(o.total)}</td>
                    <td className="px-6 py-3.5 text-muted">{o.paymentMethod}</td>
                    <td className="px-6 py-3.5 text-muted">{formatDateTime(o.date)}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Badge tone="neutral">
                          <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", STATUS_META[o.status].dot)} />
                          {o.status}
                        </Badge>
                        <select
                          value={o.status}
                          onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                          aria-label={`Change status for order ${o.id}`}
                          className="input h-8 w-auto cursor-pointer px-2 py-0 text-xs"
                        >
                          {STATUS_FLOW.concat("Cancelled").map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end">
                        <Link
                          href={`/orders/${o.id}`}
                          aria-label={`View order ${o.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
