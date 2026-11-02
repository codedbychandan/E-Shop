"use client";

import { ChevronDown, RotateCcw, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/data/types";
import { categories } from "@/data/categories";
import { getColorHex } from "@/data/colors";
import { cn } from "@/lib/utils";
import type { ShopFilters } from "@/lib/filters";

interface FilterSidebarProps {
  products: Product[];
  filters: ShopFilters;
  onChange: (f: ShopFilters) => void;
  onClear: () => void;
}

const discountOptions = [
  { value: 0, label: "Any" },
  { value: 10, label: "10% or more" },
  { value: 25, label: "25% or more" },
  { value: 40, label: "40% or more" },
  { value: 50, label: "50% or more" },
];

const ratingOptions = [
  { value: 0, label: "Any rating" },
  { value: 4.5, label: "4.5 ★ & up" },
  { value: 4, label: "4 ★ & up" },
  { value: 3, label: "3 ★ & up" },
];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function FilterSidebar({ products, filters, onChange, onClear }: FilterSidebarProps) {
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );
  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors))).sort(),
    [products]
  );

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const hasActive =
    filters.categories.length ||
    filters.brands.length ||
    filters.colors.length ||
    filters.priceMin != null ||
    filters.priceMax != null ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.minDiscount > 0;

  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between pb-2">
        <h2 className="heading-3">Filters</h2>
        {hasActive && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <RotateCcw size={13} /> Clear all
          </button>
        )}
      </div>

      <Section title="Category">
        <div className="space-y-2">
          {categories.map((c) => {
            const active = filters.categories.includes(c.name);
            return (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    onChange({ ...filters, categories: toggle(filters.categories, c.name) })
                  }
                  className="h-4 w-4 rounded border-line accent-brand-600"
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Brand">
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {brands.map((b) => {
            const active = filters.brands.includes(b);
            return (
              <label
                key={b}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onChange({ ...filters, brands: toggle(filters.brands, b) })}
                  className="h-4 w-4 rounded border-line accent-brand-600"
                />
                {b}
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMin: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="input h-10 px-3"
            aria-label="Minimum price"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMax: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="input h-10 px-3"
            aria-label="Maximum price"
          />
        </div>
      </Section>

      <Section title="Rating">
        <div className="space-y-2">
          {ratingOptions.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r.value}
                onChange={() => onChange({ ...filters, minRating: r.value })}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="flex items-center gap-1">
                {r.value > 0 && <Star size={13} className="fill-amber-400 text-amber-400" />}
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Availability" defaultOpen={false}>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            className="h-4 w-4 rounded border-line accent-brand-600"
          />
          In stock only
        </label>
      </Section>

      <Section title="Discount" defaultOpen={false}>
        <div className="space-y-2">
          {discountOptions.map((d) => (
            <label
              key={d.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
            >
              <input
                type="radio"
                name="discount"
                checked={filters.minDiscount === d.value}
                onChange={() => onChange({ ...filters, minDiscount: d.value })}
                className="h-4 w-4 accent-brand-600"
              />
              {d.label}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Colour" defaultOpen={false}>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => {
            const active = filters.colors.includes(c);
            return (
              <button
                key={c}
                onClick={() => onChange({ ...filters, colors: toggle(filters.colors, c) })}
                title={c}
                aria-label={`Filter by colour ${c}`}
                aria-pressed={active}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                  active ? "border-brand-600 ring-2 ring-brand-500/30" : "border-line"
                )}
                style={{ backgroundColor: getColorHex(c) }}
              />
            );
          })}
        </div>
      </Section>
    </div>
  );
}
