"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/data/types";
import { lineKey, computeCart } from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { useProductStore } from "@/store/product-store";

interface CartState {
  items: CartLine[];
  coupon: string | null;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1, color, size) => {
        const key = lineKey({ productId: product.id, color, size });
        set((s) => {
          const existing = s.items.find((i) => lineKey(i) === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                lineKey(i) === key
                  ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
                  : i
              ),
            };
          }
          return { items: [...s.items, { productId: product.id, quantity, color, size }] };
        });
      },

      removeItem: (key) =>
        set((s) => ({ items: s.items.filter((i) => lineKey(i) !== key) })),

      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              lineKey(i) === key ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [], coupon: null }),

      applyCoupon: (code) => {
        const { items } = get();
        const products = useProductStore.getState().products;
        const { subtotal } = computeCart(items, products, null);
        const result = validateCoupon(code, subtotal);
        if (result.ok) {
          set({ coupon: code.trim().toUpperCase() });
        }
        return result;
      },

      removeCoupon: () => set({ coupon: null }),
    }),
    { name: "eshop-cart" }
  )
);
