"use client";

import { motion } from "framer-motion";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { OrdersSkeleton } from "@/components/skeletons";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { formatDateTime, inr } from "@/lib/format";
import { STATUS_META } from "@/lib/orders";
import { useOrderStore } from "@/store/order-store";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useSimulatedLoad(420);

  return (
    <div className="container-page py-8 lg:py-10">
      <h1 className="heading-2">My Orders</h1>
      <p className="mt-1 text-sm text-muted">
        Track and manage everything you&apos;ve ordered.
      </p>

      <div className="mt-8">
        {loading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package size={26} />}
            title="No orders yet"
            description="When you place an order, it will show up here with live tracking."
            actionLabel="Start shopping"
            actionHref="/shop"
          />
        ) : (
          <ul className="space-y-4">
            {orders.map((o, i) => {
              const meta = STATUS_META[o.status];
              return (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <Link
                    href={`/orders/${o.id}`}
                    className="group flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 transition-shadow hover:shadow-card-lg sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {o.items.slice(0, 3).map((it, j) => (
                          <span
                            key={j}
                            className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-surface bg-surface2"
                          >
                            <ProductImage src={it.image} alt={it.name} className="h-full w-full" />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{o.id}</p>
                        <Badge tone="neutral">
                          <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", meta.dot)} />
                          {o.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {formatDateTime(o.date)} · {o.items.reduce((n, x) => n + x.quantity, 0)} item
                        {o.items.reduce((n, x) => n + x.quantity, 0) === 1 ? "" : "s"} · {o.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-muted">Total</p>
                        <p className="font-bold">{inr(o.total)}</p>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                      />
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
