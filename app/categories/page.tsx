"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { categories } from "@/data/categories";
import { useProductStore } from "@/store/product-store";

export default function CategoriesPage() {
  const products = useProductStore((s) => s.products);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Categories
        </p>
        <h1 className="heading-1 mt-2">Find your thing</h1>
        <p className="mt-4 text-lg text-muted">
          Six curated collections, hundreds of products. Pick a category and
          start exploring.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const count = products.filter((p) => p.category === c.name).length;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="group relative block h-72 overflow-hidden rounded-3xl border border-line shadow-card transition-shadow hover:shadow-card-lg"
              >
                <ProductImage
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span
                  aria-hidden
                  className="absolute inset-x-5 bottom-5"
                >
                  <span className="block">
                    <span className="font-display text-2xl font-bold text-white">
                      {c.name}
                    </span>
                    <span className="mt-1 block text-sm text-white/75">{c.tagline}</span>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors group-hover:bg-white/25">
                      {count} products <ArrowRight size={13} />
                    </span>
                  </span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
