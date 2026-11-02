"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ProductImage } from "@/components/ProductImage";
import { inr } from "@/lib/format";
import { computeCart, lineKey } from "@/lib/cart";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useUIStore } from "@/store/ui-store";
import { toast } from "@/store/toast-store";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const products = useProductStore((s) => s.products);

  const { items: resolved, subtotal, total, discount } = computeCart(items, products, null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="heading-3 flex items-center gap-2">
                <ShoppingBag size={18} /> Your Cart
                <span className="text-sm font-normal text-muted">
                  ({resolved.length} {resolved.length === 1 ? "item" : "items"})
                </span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="btn-ghost h-9 w-9 rounded-full p-0"
              >
                <X size={18} />
              </button>
            </div>

            {resolved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface2 text-muted">
                  <ShoppingBag size={26} />
                </div>
                <div>
                  <p className="font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted">
                    Looks like you haven&apos;t added anything yet.
                  </p>
                </div>
                <button onClick={() => setOpen(false)} className="btn-primary">
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {resolved.map((line) => {
                        const key = lineKey(line);
                        return (
                          <motion.li
                            key={key}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            className="flex gap-3"
                          >
                            <Link
                              href={`/product/${line.product.id}`}
                              onClick={() => setOpen(false)}
                              className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface2"
                            >
                              <ProductImage
                                src={line.product.images[0]}
                                alt={line.product.name}
                                className="h-full w-full"
                              />
                            </Link>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {line.product.name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-muted">
                                    {[line.color, line.size].filter(Boolean).join(" · ") ||
                                      line.product.brand}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    removeItem(key);
                                    toast("Removed from cart", "info");
                                  }}
                                  aria-label={`Remove ${line.product.name} from cart`}
                                  className="text-muted transition-colors hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="flex items-center rounded-full border border-line">
                                  <button
                                    onClick={() => setQuantity(key, line.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink disabled:opacity-40"
                                    disabled={line.quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-7 text-center text-sm font-semibold tabular-nums">
                                    {line.quantity}
                                  </span>
                                  <button
                                    onClick={() => setQuantity(key, line.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="text-sm font-bold">
                                  {inr(line.product.price * line.quantity)}
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-line px-5 py-4">
                  <div className="mb-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal</span>
                      <span>{inr(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-{inr(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 text-base font-bold">
                      <span>Total</span>
                      <span>{inr(total)}</span>
                    </div>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="btn-outline w-full"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn-primary mt-2 w-full"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
