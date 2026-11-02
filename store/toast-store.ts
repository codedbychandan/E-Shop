"use client";

import { create } from "zustand";
import type { ToastMessage } from "@/data/types";
import { uid } from "@/lib/utils";

interface ToastState {
  toasts: ToastMessage[];
  push: (message: string, type?: ToastMessage["type"]) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (message, type = "success") =>
    set((s) => ({ toasts: [...s.toasts, { id: uid("t-"), message, type }] })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, type: ToastMessage["type"] = "success") {
  useToastStore.getState().push(message, type);
}
