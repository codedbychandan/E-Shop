"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/types";
import { products as seedProducts } from "@/data/products";

interface ProductState {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deductStock: (items: { productId: string; quantity: number }[]) => void;
  restoreStock: (items: { productId: string; quantity: number }[]) => void;
  reset: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: seedProducts,
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      deductStock: (items) =>
        set((s) => ({
          products: s.products.map((p) => {
            const match = items.find((it) => it.productId === p.id);
            if (!match) return p;
            return { ...p, stock: Math.max(0, p.stock - match.quantity) };
          }),
        })),
      restoreStock: (items) =>
        set((s) => ({
          products: s.products.map((p) => {
            const match = items.find((it) => it.productId === p.id);
            if (!match) return p;
            return { ...p, stock: p.stock + match.quantity };
          }),
        })),
      reset: () => set({ products: seedProducts }),
    }),
    { name: "eshop-products" }
  )
);
