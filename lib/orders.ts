import type { OrderStatus, TimelineStep } from "@/data/types";

export const STATUS_FLOW: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export function nextOrderId(): string {
  return "NX-" + Math.floor(10000 + Math.random() * 89999).toString();
}

export function getTimeline(status: OrderStatus): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: "Order Placed", description: "We received your order", done: true },
    { label: "Confirmed", description: "Payment verified & packed", done: false },
    { label: "Shipped", description: "Handed to our courier partner", done: false },
    { label: "Out for Delivery", description: "Arriving at your address", done: false },
    { label: "Delivered", description: "Enjoy your order!", done: false },
  ];

  if (status === "Cancelled") {
    return steps.map((s) => ({ ...s, done: false }));
  }

  const idx = STATUS_FLOW.indexOf(status);
  const resolved = idx < 0 ? 0 : idx;
  return steps.map((s, i) => ({
    ...s,
    done: i <= resolved,
    current: i === resolved && status !== "Delivered",
  }));
}

export const STATUS_META: Record<
  OrderStatus,
  { badge: string; dot: string; label: string }
> = {
  Processing: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Processing",
  },
  Shipped: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Shipped",
  },
  "Out for Delivery": {
    badge: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
    dot: "bg-brand-500",
    label: "Out for Delivery",
  },
  Delivered: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Delivered",
  },
  Cancelled: {
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Cancelled",
  },
};
