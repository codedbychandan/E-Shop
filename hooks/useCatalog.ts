"use client";

import { useMemo, useState } from "react";
import {
  applyFilters,
  defaultFilters,
  sortProducts,
  type ShopFilters,
  type SortKey,
} from "@/lib/filters";
import { useProductStore } from "@/store/product-store";

export function useCatalog(initial?: Partial<ShopFilters>) {
  const products = useProductStore((s) => s.products);
  const [filters, setFilters] = useState<ShopFilters>({
    ...defaultFilters,
    ...initial,
  });
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(
    () => sortProducts(applyFilters(products, filters), sort),
    [products, filters, sort]
  );

  return {
    products,
    filters,
    setFilters,
    sort,
    setSort,
    filtered,
    reset: () => {
      setFilters({ ...defaultFilters });
      setSort("recommended");
    },
  };
}
