"use client";

import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/types";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { Rating } from "@/components/ui/Rating";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/store/toast-store";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.ids.includes(product.id));
  const openQuickView = useUIStore((s) => s.openQuickView);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    toast(added ? "Added to wishlist" : "Removed from wishlist", added ? "success" : "info");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product, 1, product.colors[0], product.sizes?.[0]);
    toast("Added to cart", "success");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id);
  };

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const badge = outOfStock ? (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      Out of stock
    </span>
  ) : lowStock ? (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      Only {product.stock} left
    </span>
  ) : product.discount > 0 ? (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      -{product.discount}%
    </span>
  ) : product.newArrival ? (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      New
    </span>
  ) : null;

  const heartButton = (
    <button
      onClick={handleWishlist}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={cn(
        "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-all hover:scale-110",
        wishlisted ? "text-rose-500" : "text-muted hover:text-ink"
      )}
    >
      <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );

  const titleBlock = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {product.brand}
      </p>
      <Link
        href={`/product/${product.id}`}
        onClick={(e) => e.stopPropagation()}
        className="line-clamp-2 font-medium leading-snug text-ink transition-colors hover:text-brand-600"
      >
        {product.name}
      </Link>
      <div className="flex items-center gap-1.5">
        <Rating value={product.rating} />
        <span className="text-xs text-muted">({product.reviewCount.toLocaleString("en-IN")})</span>
      </div>
    </>
  );

  const priceBlock = (
    <div className="flex items-baseline gap-2">
      <span className="text-base font-bold text-ink">{inr(product.price)}</span>
      {product.originalPrice > product.price && (
        <span className="text-sm text-muted line-through">{inr(product.originalPrice)}</span>
      )}
    </div>
  );

  const actionButtons = (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="btn-primary h-10 flex-1 rounded-full px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={16} />
        {outOfStock ? "Out of stock" : "Add to Cart"}
      </button>
      <button
        onClick={handleQuickView}
        aria-label="Quick view"
        className="btn-outline h-10 w-10 shrink-0 rounded-full p-0"
      >
        <Eye size={17} />
      </button>
    </div>
  );

  if (variant === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative flex gap-4 rounded-3xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-card-lg sm:gap-5"
      >
        <Link
          href={`/product/${product.id}`}
          className="relative block h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface2 sm:h-36 sm:w-36"
        >
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          {titleBlock}
          <div className="mt-auto">
            {priceBlock}
            {actionButtons}
          </div>
        </div>
        {badge}
        {heartButton}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-lg"
    >
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-surface2"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {badge}
        {heartButton}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {titleBlock}
        <div className="mt-auto pt-1">
          {priceBlock}
          {actionButtons}
        </div>
      </div>
    </motion.div>
  );
}
