"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={15} /> Back to products
      </Link>
      <h1 className="heading-2 mt-4">Add Product</h1>
      <p className="mt-1 text-sm text-muted">
        The product will appear in the shop immediately after saving.
      </p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
