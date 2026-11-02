"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/data/types";
import { seedOrders } from "@/data/seed-orders";

interface OrderState {
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => boolean;
  getById: (id: string) => Order | undefined;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      placeOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      cancelOrder: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order || order.status !== "Processing") return false;
        
        // Restore stock
        const { useProductStore } = require("@/store/product-store");
        useProductStore.getState().restoreStock(order.items);

        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o)),
        }));
        return true;
      },
      getById: (id) => get().orders.find((o) => o.id === id),
      reset: () => set({ orders: seedOrders }),
    }),
    { name: "eshop-orders", version: 1 }
  )
);
