"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rating } from "@/components/ui/Rating";
import { inr } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "@/store/toast-store";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);
  const products = useProductStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);

  const saved = products.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="container-page py-16">
        <h1 className="heading-2 mb-8">Wishlist</h1>
        <EmptyState
          icon={<Heart size={26} />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          actionLabel="Explore Products"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <h1 className="heading-2">Wishlist</h1>
      <p className="mt-1 text-sm text-muted">
        {saved.length} saved {saved.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {saved.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-lg"
          >
            <Link
              href={`/product/${p.id}`}
              className="relative block aspect-square w-full overflow-hidden bg-surface2"
            >
              <ProductImage
                src={p.images[0]}
                alt={p.name}
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]"
              />
              {p.discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
                  -{p.discount}%
                </span>
              )}
            </Link>

            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{p.brand}</p>
              <Link href={`/product/${p.id}`} className="line-clamp-2 font-medium leading-snug hover:text-brand-600">
                {p.name}
              </Link>
              <div className="flex items-center gap-1.5">
                <Rating value={p.rating} />
                <span className="text-xs text-muted">({p.reviewCount.toLocaleString("en-IN")})</span>
              </div>
              <div className="mt-auto flex items-baseline gap-2 pt-1.5">
                <span className="font-bold">{inr(p.price)}</span>
                <span className="text-sm text-muted line-through">{inr(p.originalPrice)}</span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addItem(p, 1, p.colors[0], p.sizes?.[0]);
                    toast("Added to cart", "success");
                  }}
                  disabled={p.stock <= 0}
                  className="btn-primary h-10 flex-1 text-sm"
                >
                  <ShoppingBag size={15} /> {p.stock <= 0 ? "Out of stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => {
                    remove(p.id);
                    toast("Removed from wishlist", "info");
                  }}
                  aria-label={`Remove ${p.name} from wishlist`}
                  className="btn-outline h-10 w-10 shrink-0 p-0 text-muted hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
