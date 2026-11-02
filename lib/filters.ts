import type { Product } from "@/data/types";

export type SortKey =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"
  | "discount";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Biggest Discount" },
];

export interface ShopFilters {
  categories: string[];
  brands: string[];
  priceMin: number | null;
  priceMax: number | null;
  minRating: number;
  inStockOnly: boolean;
  minDiscount: number;
  colors: string[];
}

export const defaultFilters: ShopFilters = {
  categories: [],
  brands: [],
  priceMin: null,
  priceMax: null,
  minRating: 0,
  inStockOnly: false,
  minDiscount: 0,
  colors: [],
};

export function applyFilters(products: Product[], f: ShopFilters): Product[] {
  return products.filter((p) => {
    if (f.categories.length > 0 && !f.categories.includes(p.category)) return false;
    if (f.brands.length > 0 && !f.brands.includes(p.brand)) return false;
    if (f.priceMin != null && p.price < f.priceMin) return false;
    if (f.priceMax != null && p.price > f.priceMax) return false;
    if (f.minRating > 0 && p.rating < f.minRating) return false;
    if (f.inStockOnly && p.stock <= 0) return false;
    if (f.minDiscount > 0 && p.discount < f.minDiscount) return false;
    if (f.colors.length > 0 && !p.colors.some((c) => f.colors.includes(c))) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "discount":
      return arr.sort((a, b) => b.discount - a.discount);
    case "newest":
      return arr.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    case "recommended":
    default:
      return arr;
  }
}

export function activeFilterCount(f: ShopFilters): number {
  let n = f.categories.length + f.brands.length + f.colors.length;
  if (f.priceMin != null) n++;
  if (f.priceMax != null) n++;
  if (f.minRating > 0) n++;
  if (f.inStockOnly) n++;
  if (f.minDiscount > 0) n++;
  return n;
}
