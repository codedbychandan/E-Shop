"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, PackageX, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { OrderTimeline } from "@/components/OrderTimeline";
import { InvoiceModal } from "@/components/InvoiceModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductImage } from "@/components/ProductImage";
import { formatDateTime, inr } from "@/lib/format";
import { getTimeline, STATUS_META } from "@/lib/orders";
import { useOrderStore } from "@/store/order-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === params.id));
  const cancelOrder = useOrderStore((s) => s.cancelOrder);

  const [showInvoice, setShowInvoice] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!order) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<PackageX size={26} />}
          title="Order not found"
          description="We couldn't find that order in your history."
          actionLabel="View all orders"
          actionHref="/orders"
        />
      </div>
    );
  }

  const handleCancelOrder = () => {
    const success = cancelOrder(order.id);
    if (success) {
      toast("Order cancelled and stock restored", "info");
      setConfirmCancel(false);
    } else {
      toast("Unable to cancel this order", "error");
    }
  };

  const meta = STATUS_META[order.status];
  const timeline = getTimeline(order.status);
  const cancelled = order.status === "Cancelled";
  const canCancel = order.status === "Processing";

  return (
    <div className="container-page py-8 lg:py-10">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={15} /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-2">Order {order.id}</h1>
          <p className="mt-1 text-sm text-muted">{formatDateTime(order.date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="btn-outline h-9 px-3.5 text-xs sm:text-sm gap-1.5"
          >
            <Download size={15} /> Invoice
          </button>
          <Badge tone={cancelled ? "red" : "brand"}>
            <span className={cn("mr-1.5 inline-block h-2 w-2 rounded-full", meta.dot)} />
            {order.status}
          </Badge>
        </div>
      </div>

      {cancelled && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30">
          This order was cancelled. If you were charged, the refund will reach you within 5–7
          business days.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Items */}
          <section className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="heading-3 mb-4">Items</h2>
            <ul className="divide-y divide-line">
              {order.items.map((it, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/product/${it.productId}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface2"
                  >
                    <ProductImage src={it.image} alt={it.name} className="h-full w-full" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">{it.brand}</p>
                    <Link href={`/product/${it.productId}`} className="line-clamp-1 font-semibold hover:text-brand-600">
                      {it.name}
                    </Link>
                    <p className="text-xs text-muted">
                      Qty {it.quantity}
                      {it.color || it.size ? ` · ${[it.color, it.size].filter(Boolean).join(" / ")}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold">{inr(it.price * it.quantity)}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{inr(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount {order.coupon && `(${order.coupon})`}</span>
                  <span>-{inr(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax</span><span>{inr(order.tax)}</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <span>Total</span><span>{inr(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Tracking */}
          <section className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="heading-3 mb-6 flex items-center gap-2">
              <Truck size={18} className="text-brand-600" /> Order Tracking
            </h2>
            <OrderTimeline steps={timeline} />
          </section>
        </div>

        {/* Side info */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="heading-3">Delivery address</h3>
            <div className="mt-3 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-ink">{order.address.fullName}</p>
              <p>{order.address.line}</p>
              <p>
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="mt-2">{order.address.phone}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="heading-3">Details</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Payment</dt>
                <dd className="font-medium">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Est. delivery</dt>
                <dd className="font-medium">{order.deliveryEstimate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Order status</dt>
                <dd className="font-medium">{order.status}</dd>
              </div>
            </dl>
          </section>

          {canCancel && (
            <section className="rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-500/5 p-6">
              <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Cancel Order</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Need to cancel? You can cancel your order while it is still processing. Items will be returned to stock immediately.
              </p>
              {confirmCancel ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-red-600">Are you sure you want to cancel?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-300 dark:border-red-800 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-colors"
                >
                  <XCircle size={14} /> Request Cancellation
                </button>
              )}
            </section>
          )}

          <Button href="/shop" variant="outline" fullWidth>
            Continue Shopping
          </Button>
        </aside>
      </div>

      <InvoiceModal
        order={order}
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
}
