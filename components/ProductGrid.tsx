"use client";

import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons";

interface ProductGridProps {
  products: Product[];
  layout?: "grid" | "list";
  loading?: boolean;
}

export function ProductGrid({ products, layout = "grid", loading }: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4",
          layout === "list" && "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4",
        layout === "list" && "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant={layout === "list" ? "list" : "grid"} />
      ))}
    </div>
  );
}
