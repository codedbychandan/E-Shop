"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Download, MapPin, PackageX, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceModal } from "@/components/InvoiceModal";
import { Confetti } from "@/components/Confetti";
import { formatDateTime, inr } from "@/lib/format";
import { useOrderStore } from "@/store/order-store";

export default function OrderSuccessPage() {
  const params = useParams<{ id: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === params.id));
  const [showInvoice, setShowInvoice] = useState(false);

  if (!order) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<PackageX size={26} />}
          title="Order not found"
          description="We couldn't find that order. It may have been removed."
          actionLabel="Go to shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page flex justify-center py-12 lg:py-20 relative">
      <Confetti />
      <div className="w-full max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 200 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white"
          >
            <Check size={30} strokeWidth={3} />
          </motion.span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="heading-1 mt-8">Order Confirmed!</h1>
          <p className="mt-3 text-lg text-muted">
            Your order has been successfully placed. A confirmation has been sent to{" "}
            <span className="font-medium text-ink">{order.address.email}</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 rounded-3xl border border-line bg-surface p-6 text-left"
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Order ID</dt>
              <dd className="mt-1 font-bold text-ink">{order.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Order date</dt>
              <dd className="mt-1 font-semibold text-ink">{formatDateTime(order.date)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Total paid</dt>
              <dd className="mt-1 font-bold text-ink">{inr(order.total)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Payment method</dt>
              <dd className="mt-1 font-semibold text-ink">{order.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Delivery estimate</dt>
              <dd className="mt-1 font-semibold text-ink">{order.deliveryEstimate}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Items</dt>
              <dd className="mt-1 font-semibold text-ink">
                {order.items.reduce((n, i) => n + i.quantity, 0)} item
                {order.items.reduce((n, i) => n + i.quantity, 0) === 1 ? "" : "s"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-surface2 p-4 text-sm text-muted">
            <MapPin size={17} className="mt-0.5 shrink-0 text-brand-600" />
            <p>
              {order.address.fullName} · {order.address.line}, {order.address.city},{" "}
              {order.address.state} — {order.address.pincode}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => setShowInvoice(true)}
            className="btn-primary px-6"
          >
            <Download size={17} /> Download Invoice
          </button>
          <Link href={`/orders/${order.id}`} className="btn-outline">
            <ReceiptText size={17} /> Track Order
          </Link>
          <Link href="/shop" className="btn-ghost">
            Continue Shopping
          </Link>
        </motion.div>

        <InvoiceModal
          order={order}
          open={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      </div>
    </div>
  );
}
