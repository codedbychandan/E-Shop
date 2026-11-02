"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/types";
import { categories } from "@/data/categories";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { uid } from "@/lib/utils";
import { useProductStore } from "@/store/product-store";
import { toast } from "@/store/toast-store";

interface ProductFormProps {
  initial?: Product;
}

export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? categories[0].name,
    subcategory: initial?.subcategory ?? "",
    brand: initial?.brand ?? "",
    price: initial?.price?.toString() ?? "",
    originalPrice: initial?.originalPrice?.toString() ?? "",
    stock: initial?.stock?.toString() ?? "",
    rating: initial?.rating?.toString() ?? "4.5",
    image: initial?.images?.[0] ?? "",
    tags: initial?.tags?.join(", ") ?? "",
    colors: initial?.colors?.join(", ") ?? "",
    sizes: initial?.sizes?.join(", ") ?? "",
    featured: initial?.featured ?? false,
    bestSeller: initial?.bestSeller ?? false,
    newArrival: initial?.newArrival ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 3) er.name = "Product name is required (min 3 characters).";
    if (form.description.trim().length < 10) er.description = "Description is required (min 10 characters).";
    if (!form.brand.trim()) er.brand = "Brand is required.";
    const price = Number(form.price);
    const original = Number(form.originalPrice) || price;
    if (!price || price <= 0) er.price = "Enter a valid price.";
    if (original < price) er.originalPrice = "Original price can't be lower than price.";
    if (form.stock === "" || Number(form.stock) < 0) er.stock = "Enter stock (0 or more).";
    if (form.image.trim() && !/^https?:\/\//.test(form.image.trim())) er.image = "Enter a valid image URL.";
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      const discount = Math.round(((original - price) / original) * 100);
      const data: Product = {
        id: initial?.id ?? uid("p-").toLowerCase(),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        subcategory: form.subcategory.trim() || "General",
        price,
        originalPrice: original,
        discount: discount > 0 ? discount : 0,
        rating: Math.min(5, Math.max(0, Number(form.rating) || 4.5)),
        reviewCount: initial?.reviewCount ?? 0,
        images: form.image.trim()
          ? [form.image.trim()]
          : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
        stock: Number(form.stock),
        brand: form.brand.trim(),
        colors: form.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        sizes: form.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
      };

      if (initial) updateProduct(initial.id, data);
      else addProduct(data);

      setSaving(false);
      toast(initial ? "Product updated" : "Product added to shop");
      router.push("/admin/products");
    }, 500);
  };

  const checkbox =
    "h-4 w-4 rounded border-line accent-brand-600";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="heading-3">Basic information</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Product name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} placeholder="e.g. Aura ANC Wireless Headphones" />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} placeholder="Describe the product, its features and who it's for…" />
          </div>
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            options={categories.map((c) => ({ value: c.name, label: c.name }))}
          />
          <Input label="Subcategory" value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. Audio" />
          <Input label="Brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} error={errors.brand} placeholder="e.g. Aura" />
          <div className="sm:col-span-2">
            <Input label="Image URL" value={form.image} onChange={(e) => set("image", e.target.value)} error={errors.image} placeholder="https://…" hint="Leave empty to use a default placeholder image." />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="heading-3">Pricing & inventory</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label="Price (₹)" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} error={errors.price} placeholder="2999" />
          <Input label="Original price (₹)" type="number" min={0} value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} error={errors.originalPrice} placeholder="4999" />
          <Input label="Stock" type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} error={errors.stock} placeholder="50" />
          <Input label="Rating (0–5)" type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="heading-3">Attributes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label="Colours (comma separated)" value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Black, White, Sage" />
          <Input label="Sizes (comma separated, optional)" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL" />
          <div className="sm:col-span-2">
            <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="audio, wireless, headphones" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          {([
            ["featured", "Featured"],
            ["bestSeller", "Best Seller"],
            ["newArrival", "New Arrival"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className={checkbox}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-outline">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary min-w-[160px]">
          {saving ? <Loader2 size={17} className="animate-spin" /> : null}
          {initial ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
