"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentState {
  ids: string[];
  addRecent: (id: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      addRecent: (id) =>
        set((s) => ({
          ids: [id, ...s.ids.filter((existingId) => existingId !== id)].slice(0, 8),
        })),
      clearRecent: () => set({ ids: [] }),
    }),
    { name: "eshop-recently-viewed" }
  )
);
