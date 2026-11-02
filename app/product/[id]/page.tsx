"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  PackageX,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { ReviewModal } from "@/components/ReviewModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rating } from "@/components/ui/Rating";
import { DetailsSkeleton } from "@/components/skeletons";
import { getColorHex } from "@/data/colors";
import { getReviewsForProduct } from "@/data/reviews";
import type { Product } from "@/data/types";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useReviewStore } from "@/store/review-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRecentStore } from "@/store/recent-store";
import { toast } from "@/store/toast-store";

type Tab = "description" | "specifications" | "shipping" | "returns";

const tabs: { id: Tab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
];

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const products = useProductStore((s) => s.products);
  const product = products.find((p) => p.id === id);
  const loading = useSimulatedLoad(380);
  const router = useRouter();

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.ids.includes(id));
  const addRecent = useRecentStore((s) => s.addRecent);
  const recentIds = useRecentStore((s) => s.ids);

  const [color, setColor] = useState(product?.colors[0]);
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [reviewOpen, setReviewOpen] = useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message?: string;
    express?: boolean;
  }>({ checked: false, valid: false });

  useEffect(() => {
    if (product) {
      setColor(product.colors[0]);
      setSize(product.sizes?.[0]);
      setQty(1);
      addRecent(product.id);
    }
  }, [product?.id, addRecent]); // eslint-disable-line react-hooks/exhaustive-deps

  const storedReviews = useReviewStore((s) => s.reviews);
  const reviews = useMemo(() => {
    const forProduct = storedReviews.filter((r) => r.productId === id);
    return forProduct.length > 0 ? forProduct : getReviewsForProduct(id);
  }, [storedReviews, id]);

  const ratingBreakdown = useMemo(() => {
    const total = reviews.length > 0 ? reviews.length : 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const starCount = reviews.filter((r) => Math.round(r.rating) === star).length;
      const percentage = Math.round((starCount / total) * 100);
      return { star, count: starCount, percentage };
    });
  }, [reviews]);

  const related = useMemo(
    () =>
      products.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4),
    [products, product, id]
  );

  const recentProducts = useMemo(() => {
    return recentIds
      .filter((rid) => rid !== id)
      .map((rid) => products.find((p) => p.id === rid))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 4);
  }, [recentIds, products, id]);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: "Please enter a valid 6-digit Pincode",
      });
      return;
    }
    const isMetro = ["11", "40", "56", "60", "70", "50", "20", "12"].some((prefix) =>
      clean.startsWith(prefix)
    );
    const eta = new Date();
    eta.setDate(eta.getDate() + (isMetro ? 2 : 4));
    const etaText = eta.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    setPincodeStatus({
      checked: true,
      valid: true,
      express: isMetro,
      message: isMetro
        ? `Express Delivery by ${etaText} · Free Shipping & COD available`
        : `Standard Delivery by ${etaText} · Cash on Delivery available`,
    });
  };

  const handleShare = async () => {
    if (!product) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on E-Shop!`,
          url,
        });
        return;
      } catch (err) {}
    }
    navigator.clipboard.writeText(url);
    toast("Product link copied to clipboard!", "success");
  };

  if (loading) {
    return (
      <div className="py-10">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<PackageX size={26} />}
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          actionLabel="Back to shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const stockLabel =
    product.stock === 0
      ? { text: "Out of stock", cls: "text-red-500" }
      : product.stock < 15
      ? { text: `Low stock — only ${product.stock} left`, cls: "text-amber-600" }
      : { text: "In stock", cls: "text-emerald-600" };

  const handleAdd = (buyNow = false) => {
    if (product.stock <= 0) return;
    addItem(product, qty, color, size);
    toast("Added to cart", "success");
    if (buyNow) router.push("/checkout");
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product.id);
    toast(added ? "Added to wishlist" : "Removed from wishlist", added ? "success" : "info");
  };

  const specs: [string, string][] = [
    ["Brand", product.brand],
    ["Category", product.category],
    ["Subcategory", product.subcategory],
    ["Colours", product.colors.join(", ")],
    ["Sizes", product.sizes?.join(", ") ?? "—"],
    ["Model", `NX-${product.id.toUpperCase()}`],
    ["Tags", product.tags.join(", ")],
  ];

  return (
    <div className="container-page py-8 lg:py-12 pb-24 sm:pb-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-brand-600">Shop</Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-brand-600"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="truncate font-medium text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              {product.brand}
            </p>
            {product.newArrival && <Badge tone="green">New</Badge>}
            {product.bestSeller && <Badge tone="amber">Best Seller</Badge>}
          </div>

          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} size={16} showValue />
            <span className="text-sm text-muted">
              {product.reviewCount.toLocaleString("en-IN")} ratings · {reviews.length} reviews
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{inr(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-muted line-through">
                {inr(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-bold text-brand-600">
                Save {product.discount}%
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Inclusive of all taxes · EMI options available
          </p>

          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          {/* Colour */}
          {product.colors.length > 1 && (
            <div className="mt-6">
              <p className="label">
                Colour: <span className="font-medium text-ink">{color}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={c}
                    aria-label={`Colour ${c}`}
                    aria-pressed={color === c}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                      color === c ? "border-brand-600 ring-2 ring-brand-500/30" : "border-line"
                    )}
                    style={{ backgroundColor: getColorHex(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="label">
                Size: <span className="font-medium text-ink">{size}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cn(
                      "min-w-[48px] rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      size === s
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-line text-ink hover:border-brand-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + stock */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className={cn("text-sm font-medium", stockLabel.cls)}>{stockLabel.text}</span>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:gap-3">
              <button
                onClick={() => handleAdd(false)}
                disabled={product.stock <= 0}
                className="btn-primary h-11 sm:h-12 flex-1 text-xs sm:text-base font-semibold px-2 sm:px-5"
              >
                <ShoppingBag size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="truncate">Add to Cart</span>
              </button>
              <button
                onClick={() => handleAdd(true)}
                disabled={product.stock <= 0}
                className="btn-dark h-11 sm:h-12 flex-1 text-xs sm:text-base font-semibold px-2 sm:px-5"
              >
                <Zap size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleWishlist}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "btn-outline h-10 sm:h-12 flex-1 sm:w-12 sm:flex-initial p-0 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold",
                  wishlisted && "border-rose-200 text-rose-500 bg-rose-50/50 dark:bg-rose-950/20"
                )}
              >
                <Heart size={16} className="sm:w-[19px] sm:h-[19px]" fill={wishlisted ? "currentColor" : "none"} />
                <span className="sm:hidden">{wishlisted ? "Saved" : "Wishlist"}</span>
              </button>
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="btn-outline h-10 sm:h-12 flex-1 sm:w-12 sm:flex-initial p-0 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold"
                title="Share / Copy Link"
              >
                <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>

          {/* Pincode Delivery Check */}
          <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-600" /> Check Delivery & Services
            </p>
            <form onSubmit={checkPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Pincode (e.g. 110001)"
                className="input h-10 text-xs sm:text-sm flex-1"
              />
              <button
                type="submit"
                className="btn-primary h-10 px-4 text-xs font-semibold shrink-0"
              >
                Check
              </button>
            </form>
            {pincodeStatus.checked && (
              <div className="mt-2.5 flex items-start gap-1.5 text-xs">
                {pincodeStatus.valid ? (
                  <>
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                      {pincodeStatus.message}
                    </span>
                  </>
                ) : (
                  <span className="text-rose-600 font-medium">{pincodeStatus.message}</span>
                )}
              </div>
            )}
          </div>

          {/* Delivery perks */}
          <div className="mt-5 grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 text-sm">
              <Truck size={17} className="shrink-0 text-brand-600" />
              <span>Free delivery over ₹1,499</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <RotateCcw size={17} className="shrink-0 text-brand-600" />
              <span>7-day easy returns</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <ShieldCheck size={17} className="shrink-0 text-brand-600" />
              <span>1-year warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-1 overflow-x-auto border-b border-line no-scrollbar" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.id ? "text-brand-600" : "text-muted hover:text-ink"
              )}
            >
              {t.label}
              {tab === t.id && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "description" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-4 leading-relaxed text-muted"
            >
              <p>{product.description}</p>
              <p>
                Every {product.brand} product is tested against strict quality standards and
                backed by E-Shop&apos;s satisfaction promise. If it isn&apos;t right, we&apos;ll make it right.
              </p>
            </motion.div>
          )}

          {tab === "specifications" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3.5 text-sm">
                    <dt className="font-medium text-muted">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}

          {tab === "shipping" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted"
            >
              <p>
                <span className="font-semibold text-ink">Standard delivery</span> — free on orders
                above ₹1,499, otherwise ₹49. Arrives in 2–5 business days across India.
              </p>
              <p>
                <span className="font-semibold text-ink">Express delivery</span> — ₹99, arrives in
                1–2 business days in major metros.
              </p>
              <p>
                Orders placed before 6 PM ship the same day. You&apos;ll receive tracking details by
                SMS and email as soon as your order leaves our warehouse.
              </p>
            </motion.div>
          )}

          {tab === "returns" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted"
            >
              <p>
                Not happy? Return within 7 days of delivery for a full refund or exchange — no
                questions asked.
              </p>
              <p>Items must be unused, in original packaging with all tags intact.</p>
              <p>
                Refunds are processed to the original payment method within 5–7 business days of
                the return being received.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[340px_1fr]">
        <div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="text-center">
              <p className="text-5xl font-bold">{product.rating.toFixed(1)}</p>
              <div className="mt-2 flex justify-center">
                <Rating value={product.rating} size={18} />
              </div>
              <p className="mt-2 text-sm text-muted">
                Based on {product.reviewCount.toLocaleString("en-IN")} ratings
              </p>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="mt-6 space-y-2 border-t border-line pt-5">
              {ratingBreakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-2 text-xs">
                  <span className="w-6 font-medium text-muted">{b.star} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${Math.max(b.percentage, b.count > 0 ? 15 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-muted">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setReviewOpen(true)} className="btn-primary mt-6 w-full">
              <Star size={16} /> Write a Review
            </button>
          </div>
        </div>

        <div>
          <h2 className="heading-3 mb-5">Customer reviews</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-line bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={r.user} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{r.user}</p>
                    <p className="text-xs text-muted">{r.date}</p>
                  </div>
                  <span className="ml-auto">
                    <Rating value={r.rating} size={13} />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="heading-2 mb-6">You might also like</h2>
          <ProductGrid products={related} />
        </div>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="mt-16 border-t border-line pt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="heading-2">Recently Viewed</h2>
              <p className="mt-1 text-sm text-muted">Products you checked out recently</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all products →
            </Link>
          </div>
          <ProductGrid products={recentProducts} />
        </div>
      )}

      {/* Sticky Mobile Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-md sm:hidden shadow-lg">
        <div>
          <p className="text-[11px] text-muted">Total Price</p>
          <p className="text-base font-bold text-ink">{inr(product.price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdd(false)}
            disabled={product.stock <= 0}
            className="btn-primary h-10 px-3.5 text-xs font-semibold"
          >
            <ShoppingBag size={15} /> Add to Cart
          </button>
          <button
            onClick={() => handleAdd(true)}
            disabled={product.stock <= 0}
            className="btn-dark h-10 px-3.5 text-xs font-semibold"
          >
            <Zap size={15} /> Buy Now
          </button>
        </div>
      </div>

      <ReviewModal
        productId={product.id}
        productName={product.name}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </div>
  );
}
