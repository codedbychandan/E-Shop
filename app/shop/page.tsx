"use client";

import { SlidersHorizontal, LayoutGrid, List, SearchX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCatalog } from "@/hooks/useCatalog";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { SORT_OPTIONS, type SortKey } from "@/lib/filters";
import { activeFilterCount } from "@/lib/filters";
import { cn } from "@/lib/utils";

function ShopClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");

  const { products, filters, setFilters, sort, setSort, filtered, reset } =
    useCatalog();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const loading = useSimulatedLoad(420);

  // Sync URL params into state
  useEffect(() => {
    if (categoryParam) {
      setFilters((f) => ({ ...f, categories: [categoryParam] }));
    }
  }, [categoryParam, setFilters]);

  useEffect(() => {
    const valid = SORT_OPTIONS.some((o) => o.value === sortParam);
    if (valid) setSort(sortParam as SortKey);
  }, [sortParam, setSort]);

  const count = filtered.length;

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-2">Shop</h1>
          <p className="mt-1 text-sm text-muted">
            {count} {count === 1 ? "product" : "products"}
            {filters.categories[0] ? ` in ${filters.categories[0]}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFilters(true)}
            className="btn-outline h-10 gap-2 px-4 text-sm lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount(filters) > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {activeFilterCount(filters)}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="input h-10 w-auto flex-1 min-w-0 sm:flex-initial sm:min-w-[170px] cursor-pointer text-xs sm:text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="hidden items-center rounded-full border border-line p-1 sm:flex">
            <button
              onClick={() => setLayout("grid")}
              aria-label="Grid view"
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-full transition-colors",
                layout === "grid" ? "bg-surface2 text-ink" : "text-muted hover:text-ink"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayout("list")}
              aria-label="List view"
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-full transition-colors",
                layout === "list" ? "bg-surface2 text-ink" : "text-muted hover:text-ink"
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              products={products}
              filters={filters}
              onChange={setFilters}
              onClear={reset}
            />
          </div>
        </aside>

        <div>
          {!loading && count === 0 ? (
            <EmptyState
              icon={<SearchX size={26} />}
              title="No products found"
              description="Nothing matches your current filters. Try clearing them or adjusting your search."
              actionLabel="Clear all filters"
              onAction={reset}
            />
          ) : (
            <ProductGrid products={filtered} layout={layout} loading={loading} />
          )}
        </div>
      </div>

      <Modal
        open={mobileFilters}
        onClose={() => setMobileFilters(false)}
        title="Filters"
        size="md"
      >
        <div className="p-5">
          <FilterSidebar
            products={products}
            filters={filters}
            onChange={setFilters}
            onClear={reset}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10">
          <div className="h-8 w-32 animate-pulse rounded-xl bg-surface2" />
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-surface2" />
            ))}
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
