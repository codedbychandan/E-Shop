"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review } from "@/data/types";
import { seedReviews } from "@/data/reviews";

interface ReviewState {
  reviews: Review[];
  add: (r: Review) => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: seedReviews,
      add: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),
    }),
    { name: "eshop-reviews", version: 1 }
  )
);
