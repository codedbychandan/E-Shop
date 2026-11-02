"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { inr } from "@/lib/format";
import { computeCart, lineKey } from "@/lib/cart";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "@/store/toast-store";

export default function CartPage() {
  const { items, coupon, setQuantity, removeItem, clear, applyCoupon, removeCoupon } =
    useCartStore();
  const products = useProductStore((s) => s.products);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistIds = useWishlistStore((s) => s.ids);

  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; message: string } | null>(null);

  const totals = computeCart(items, products, coupon);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    setCouponMsg(result);
    toast(result.message, result.ok ? "success" : "error");
    if (result.ok) setCode("");
  };

  const moveToWishlist = (productId: string, key: string) => {
    const added = toggleWishlist(productId);
    if (added) {
      removeItem(key);
      toast("Moved to wishlist", "info");
    }
  };

  if (totals.items.length === 0) {
    return (
      <div className="container-page py-16">
        <h1 className="heading-2 mb-8">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore the shop and find something you love."
          actionLabel="Explore products"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <h1 className="heading-2">Your Cart</h1>
      <p className="mt-1 text-sm text-muted">
        {totals.items.length} {totals.items.length === 1 ? "item" : "items"} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div>
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {totals.items.map((line) => {
                const key = lineKey(line);
                const inWishlist = wishlistIds.includes(line.product.id);
                return (
                  <motion.li
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="flex gap-4 rounded-3xl border border-line bg-surface p-4 sm:gap-5"
                  >
                    <Link
                      href={`/product/${line.product.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface2 sm:h-28 sm:w-28"
                    >
                      <ProductImage
                        src={line.product.images[0]}
                        alt={line.product.name}
                        className="h-full w-full"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            {line.product.brand}
                          </p>
                          <Link
                            href={`/product/${line.product.id}`}
                            className="line-clamp-1 font-semibold hover:text-brand-600"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted">
                            {[line.color, line.size].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span className="shrink-0 font-bold">
                          {inr(line.product.price * line.quantity)}
                        </span>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQuantity(key, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink disabled:opacity-40"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(key, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveToWishlist(line.product.id, key)}
                            disabled={inWishlist}
                            aria-label="Move to wishlist"
                            title={inWishlist ? "Already in wishlist" : "Move to wishlist"}
                            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted transition-colors hover:bg-surface2 hover:text-ink disabled:opacity-40"
                          >
                            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
                            Wishlist
                          </button>
                          <button
                            onClick={() => {
                              removeItem(key);
                              toast("Removed from cart", "info");
                            }}
                            aria-label={`Remove ${line.product.name} from cart`}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <button
            onClick={() => {
              clear();
              toast("Cart cleared", "info");
            }}
            className="mt-4 text-sm font-medium text-muted transition-colors hover:text-red-500"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-24 rounded-3xl border border-line bg-surface p-6">
            <h2 className="heading-3">Order Summary</h2>

            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="mt-5">
              <label htmlFor="coupon" className="label">
                Coupon code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="input h-11 pl-9 uppercase"
                    disabled={!!coupon}
                  />
                </div>
                {coupon ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setCouponMsg(null);
                    }}
                    className="btn-outline h-11 px-4"
                  >
                    Remove
                  </button>
                ) : (
                  <button type="submit" className="btn-primary h-11 px-5">
                    Apply
                  </button>
                )}
              </div>
              {couponMsg && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    couponMsg.ok ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {couponMsg.message}
                </p>
              )}
              <p className="mt-2 text-xs text-muted">
                Try <button type="button" onClick={() => setCode("ESHOP10")} className="font-semibold text-brand-600 hover:underline">ESHOP10</button>,{" "}
                <button type="button" onClick={() => setCode("SAVE20")} className="font-semibold text-brand-600 hover:underline">SAVE20</button> or{" "}
                <button type="button" onClick={() => setCode("WELCOME15")} className="font-semibold text-brand-600 hover:underline">WELCOME15</button>
              </p>
            </form>

            <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">{inr(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Discount</span>
                <span className={totals.discount > 0 ? "font-medium text-emerald-600" : "font-medium"}>
                  {totals.discount > 0 ? `-${inr(totals.discount)}` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-medium">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    inr(totals.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax (5% GST)</span>
                <span className="font-medium">{inr(totals.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <span>Total</span>
                <span>{inr(totals.total)}</span>
              </div>
              <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                Standard delivery is free. Express delivery (+₹99) available at checkout.
              </p>
            </div>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Proceed to Checkout <ArrowRight size={17} />
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck size={14} className="text-emerald-600" /> Secure checkout · Pay via UPI,
              card or COD
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
