"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { useDebounce } from "@/hooks/useDebounce";
import { inr } from "@/lib/format";
import { useProductStore } from "@/store/product-store";
import { useUIStore } from "@/store/ui-store";

const TRENDING = ["headphones", "smartwatch", "sneakers", "backpack", "serum"];

export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const products = useProductStore((s) => s.products);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 180);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.brand, p.category, p.subcategory, p.description, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 7);
  }, [debounced, products]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-24 sm:px-6"
            role="dialog"
            aria-label="Search products"
          >
            <form
              onSubmit={submit}
              className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card-lg"
            >
              <div className="flex items-center gap-3 border-b border-line px-5">
                <Search size={20} className="shrink-0 text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories…"
                  className="h-16 w-full bg-transparent text-base text-ink placeholder:text-muted/70 focus:outline-none"
                  aria-label="Search products"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="text-muted hover:text-ink"
                >
                  <X size={20} />
                </button>
              </div>

              {query.trim() === "" ? (
                <div className="px-5 py-6">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    <TrendingUp size={14} /> Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/search?q=${encodeURIComponent(t)}`);
                        }}
                        className="rounded-full border border-line bg-surface2 px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-brand-300 hover:text-brand-600"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="font-semibold">No products found</p>
                  <p className="mt-1 text-sm text-muted">
                    Try a different keyword — or browse the full catalogue.
                  </p>
                </div>
              ) : (
                <ul className="max-h-[52vh] overflow-y-auto py-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-surface2"
                      >
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface2">
                          <ProductImage
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{p.name}</span>
                          <span className="block text-xs text-muted">{p.category}</span>
                        </span>
                        <span className="text-sm font-bold">{inr(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-line px-5 pt-3">
                    <button
                      onClick={submit}
                      className="w-full rounded-full bg-surface2 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 dark:hover:bg-surface2"
                    >
                      View all results for “{debounced.trim()}”
                    </button>
                  </li>
                </ul>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
