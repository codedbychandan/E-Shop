"use client";

import { Search, SearchX } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { SORT_OPTIONS, sortProducts, type SortKey } from "@/lib/filters";
import { useProductStore } from "@/store/product-store";

function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [sort, setSort] = useState<SortKey>("recommended");
  const loading = useSimulatedLoad(380);

  useEffect(() => setInput(q), [q]);

  const products = useProductStore((s) => s.products);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const filtered = products.filter((p) =>
      [p.name, p.brand, p.category, p.subcategory, p.description, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
    return sortProducts(filtered, sort);
  }, [products, q, sort]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = input.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="max-w-xl">
        <h1 className="heading-2">Search</h1>
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products, brands, categories…"
              aria-label="Search products"
              className="input h-12 pl-11"
            />
          </div>
          <button type="submit" className="btn-primary h-12 shrink-0 px-6">
            Search
          </button>
        </form>
      </div>

      {q.trim() && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{results.length}</span> result
            {results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-ink">“{q}”</span>
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort results"
            className="input h-10 w-auto cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6">
        {!q.trim() ? (
          <EmptyState
            icon={<Search size={26} />}
            title="Search the catalogue"
            description="Type a product, brand or category above — try “headphones” or “sneakers”."
          />
        ) : loading ? (
          <ProductGrid products={[]} loading />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchX size={26} />}
            title="No products found"
            description={`Nothing matched “${q}”. Check the spelling or try a different keyword.`}
            actionLabel="Clear search"
            onAction={() => router.push("/search")}
            secondaryLabel="Browse all products"
            onSecondary={() => router.push("/shop")}
          />
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-16" />}>
      <SearchClient />
    </Suspense>
  );
}
