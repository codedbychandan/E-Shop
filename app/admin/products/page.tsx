"use client";

import { motion } from "framer-motion";
import { PackageSearch, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/skeletons";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { inr } from "@/lib/format";
import { useProductStore } from "@/store/product-store";
import { toast } from "@/store/toast-store";

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const [query, setQuery] = useState("");
  const loading = useSimulatedLoad(380);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.brand, p.category, ...p.tags].join(" ").toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct(id);
      toast("Product deleted", "info");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-2">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} products in catalogue
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary h-10 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="input h-11 pl-11"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={7} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<PackageSearch size={26} />}
              title="No products found"
              description={query ? `Nothing matches “${query}”.` : "The catalogue is empty."}
              actionLabel={query ? "Clear search" : "Add a product"}
              onAction={query ? () => setQuery("") : undefined}
              actionHref={query ? undefined : "/admin/products/new"}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Stock</th>
                  <th className="px-6 py-3 font-semibold">Rating</th>
                  <th className="px-6 py-3 font-semibold">Flags</th>
                  <th className="px-6 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-line last:border-b-0 hover:bg-surface2"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface2">
                          <ProductImage src={p.images[0]} alt={p.name} className="h-full w-full" />
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-semibold">{p.name}</p>
                          <p className="text-xs text-muted">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted">{p.category}</td>
                    <td className="px-6 py-3 font-semibold">{inr(p.price)}</td>
                    <td className="px-6 py-3">
                      <span className={p.stock === 0 ? "text-red-500" : p.stock < 15 ? "text-amber-600" : "text-emerald-600"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3">{p.rating.toFixed(1)} ★</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1">
                        {p.featured && <Badge tone="brand">Featured</Badge>}
                        {p.bestSeller && <Badge tone="amber">Best</Badge>}
                        {p.newArrival && <Badge tone="green">New</Badge>}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          aria-label={`Edit ${p.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          aria-label={`Delete ${p.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
