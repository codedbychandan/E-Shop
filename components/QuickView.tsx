"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { Modal } from "@/components/ui/Modal";
import { Rating } from "@/components/ui/Rating";
import { getColorHex } from "@/data/colors";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/store/toast-store";

export function QuickView() {
  const quickViewId = useUIStore((s) => s.quickViewId);
  const close = useUIStore((s) => s.closeQuickView);
  const products = useProductStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const product = products.find((p) => p.id === quickViewId);
  const [color, setColor] = useState<string | undefined>(product?.colors[0]);
  const [size, setSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);

  // Reset selection whenever a different product opens
  useEffect(() => {
    if (product) {
      setColor(product.colors[0]);
      setSize(product.sizes?.[0]);
      setQty(1);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = (buyNow: boolean) => {
    if (!product) return;
    addItem(product, qty, color, size);
    toast("Added to cart", "success");
    close();
    if (buyNow) router.push("/checkout");
  };

  return (
    <Modal open={!!product} onClose={close} title={product?.name ?? ""} size="lg">
      {product && (
        <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-surface2">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              className="aspect-square w-full"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {product.brand}
            </p>
            <h3 className="mt-1 text-base sm:text-lg font-semibold leading-snug">{product.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <Rating value={product.rating} />
              <span className="text-xs text-muted">
                {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("en-IN")} reviews
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold">{inr(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-muted line-through">
                  {inr(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-bold text-brand-600">
                  -{product.discount}%
                </span>
              )}
            </div>

            <p className="mt-2.5 sm:mt-3 line-clamp-3 text-xs sm:text-sm text-muted">{product.description}</p>

            <div className="mt-4 space-y-3">
              {product.colors.length > 1 && (
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      aria-label={c}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                        color === c ? "border-brand-600 ring-2 ring-brand-500/30" : "border-line"
                      )}
                      style={{ backgroundColor: getColorHex(c) }}
                    />
                  ))}
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-full border px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-semibold transition-colors",
                        size === s
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-line text-ink hover:border-brand-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-line">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 sm:h-10 sm:w-10 text-base sm:text-lg text-muted hover:text-ink"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="h-9 w-9 sm:h-10 sm:w-10 text-base sm:text-lg text-muted hover:text-ink"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs sm:text-sm text-muted">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 font-medium">In stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAdd(false)}
                disabled={product.stock <= 0}
                className="btn-primary h-10 sm:h-11 px-3 text-xs sm:text-sm font-semibold truncate"
              >
                <ShoppingBag size={16} className="shrink-0" />
                <span className="truncate">Add to Cart</span>
              </button>
              <button
                onClick={() => handleAdd(true)}
                disabled={product.stock <= 0}
                className="btn-dark h-10 sm:h-11 px-3 text-xs sm:text-sm font-semibold truncate"
              >
                <Zap size={16} className="shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
            <button
              onClick={() => {
                close();
                router.push(`/product/${product.id}`);
              }}
              className="mt-3 text-center text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View full details →
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
