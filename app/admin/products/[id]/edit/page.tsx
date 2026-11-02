"use client";

import { ArrowLeft, PackageX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProductStore } from "@/store/product-store";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const product = useProductStore((s) => s.products.find((p) => p.id === params.id));

  if (!product) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<PackageX size={26} />}
          title="Product not found"
          description="This product may have been deleted."
          actionLabel="Back to products"
          actionHref="/admin/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={15} /> Back to products
      </Link>
      <h1 className="heading-2 mt-4">Edit Product</h1>
      <p className="mt-1 text-sm text-muted">
        Editing <span className="font-medium text-ink">{product.name}</span> — changes go live in
        the shop instantly.
      </p>
      <div className="mt-8">
        <ProductForm initial={product} />
      </div>
    </div>
  );
}
