"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Flame,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { useFlashTarget } from "@/hooks/useCountdown";
import { inr } from "@/lib/format";
import { categories } from "@/data/categories";
import type { Product } from "@/data/types";
import { useProductStore } from "@/store/product-store";
import { useRecentStore } from "@/store/recent-store";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function HomePage() {
  const flashTarget = useFlashTarget();
  const products = useProductStore((s) => s.products);
  const flash = [...products]
    .sort((a, b) => b.discount - a.discount)
    .filter((p) => p.discount >= 35)
    .slice(0, 8);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);

  const recentIds = useRecentStore((s) => s.ids);
  const recentProducts = useMemo(() => {
    return recentIds
      .map((rid) => products.find((p) => p.id === rid))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 4);
  }, [recentIds, products]);

  const hero = products.find((p) => p.id === "p1") ?? products[0];
  const heroWatch = products.find((p) => p.id === "p2") ?? hero;
  const heroBuds = products.find((p) => p.id === "p6") ?? hero;

  return (
    <div className="overflow-x-clip">
      {/* ——— Hero ——— */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-gradient-to-br from-brand-400/25 to-indigo-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl"
        />
        <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm"
            >
              <Sparkles size={14} className="text-brand-600" />
              New season · Free shipping over ₹1,499
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="heading-1 mt-6 text-balance"
            >
              Upgrade Your{" "}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                Everyday.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-md text-lg leading-relaxed text-muted"
            >
              Discover products designed to make everyday life smarter, easier
              and better.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/shop" className="btn-primary h-12 px-8">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/deals" className="btn-outline h-12 px-8">
                Explore Deals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted"
            >
              <span className="flex items-center gap-2">
                <span className="flex text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                4.7 from 12,000+ reviews
              </span>
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-brand-600" /> Pan-India delivery
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" /> Secure checkout
              </span>
            </motion.div>
          </div>

          {/* Hero visual */}
          {hero && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[4/4.6] w-full">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-0 h-[78%] w-[78%] -translate-x-1/2 overflow-hidden rounded-[2.5rem] border border-line bg-surface shadow-card-lg"
              >
                <ProductImage
                  src={hero.images[0]}
                  alt={hero.name}
                  eager
                  className="h-full w-full"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-line bg-surface/85 px-4 py-3 glass">
                  <div>
                    <p className="text-sm font-semibold">{hero.name}</p>
                    <p className="text-xs text-muted">{inr(hero.price)}</p>
                  </div>
                  <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
                    -{hero.discount}%
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -left-2 top-16 w-36 overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-card-lg sm:w-40"
              >
                <div className="overflow-hidden rounded-2xl bg-surface2">
                  <ProductImage
                    src={heroWatch.images[0]}
                    alt={heroWatch.name}
                    className="aspect-square w-full"
                  />
                </div>
                <p className="mt-2 truncate text-xs font-semibold">{heroWatch.name}</p>
                <p className="text-xs text-muted">{inr(heroWatch.price)}</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -right-1 bottom-24 w-32 overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-card-lg sm:w-36"
              >
                <div className="overflow-hidden rounded-2xl bg-surface2">
                  <ProductImage
                    src={heroBuds.images[0]}
                    alt={heroBuds.name}
                    className="aspect-square w-full"
                  />
                </div>
                <p className="mt-2 truncate text-xs font-semibold">{heroBuds.name}</p>
                <p className="text-xs text-muted">{inr(heroBuds.price)}</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-center text-white shadow-glow"
              >
                <span className="px-2 text-[11px] font-bold leading-tight">
                  Up to
                  <br />
                  50% off
                </span>
              </motion.div>
            </div>
          </motion.div>
          )}
        </div>
      </section>

      {/* ——— Categories ——— */}
      <section className="container-page py-14 lg:py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Browse by category
            </p>
            <h2 className="heading-2 mt-2">Shop what moves you</h2>
          </div>
          <Link
            href="/categories"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex"
          >
            All categories <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="group block overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface2">
                  <ProductImage
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
                    aria-hidden
                  />
                  <span
                    className="absolute bottom-3 left-3 text-sm font-bold text-white drop-shadow"
                  >
                    {c.name}
                  </span>
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-xs text-muted">{c.tagline}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— Flash Sale ——— */}
      <section className="container-page py-6 lg:py-10">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-canvas dark:bg-surface2 dark:text-ink sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-300">
                <Flame size={14} /> Limited time
              </span>
              <h2 className="heading-2 mt-3">Flash Sale</h2>
              <p className="mt-1 text-sm text-canvas/60 dark:text-muted">
                Extra-deep discounts for a few hours only.
              </p>
            </div>
            <CountdownTimer target={flashTarget} size="lg" />
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {flash.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ——— Featured ——— */}
      <section className="container-page py-14 lg:py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Hand-picked for you
            </p>
            <h2 className="heading-2 mt-2">Featured products</h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 hidden sm:flex"
          >
            View all <ArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* ——— Perks ——— */}
      <section className="container-page py-6">
        <div className="grid gap-4 rounded-[2rem] border border-line bg-surface p-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Free & fast delivery", text: "Free shipping on orders over ₹1,499, delivered in 2–5 days." },
            { icon: RotateCcw, title: "Easy 7-day returns", text: "Changed your mind? Return within 7 days, no questions asked." },
            { icon: ShieldCheck, title: "Secure payments", text: "UPI, cards and cash on delivery — all 100% protected." },
            { icon: BadgeCheck, title: "Genuine products", text: "Every item is quality-checked before it ships to you." },
          ].map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3.5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <perk.icon size={20} />
              </span>
              <div>
                <p className="font-semibold">{perk.title}</p>
                <p className="mt-1 text-sm text-muted">{perk.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— Best sellers ——— */}
      <section className="container-page py-14 lg:py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Loved by thousands
            </p>
            <h2 className="heading-2 mt-2">Best sellers</h2>
          </div>
          <Link
            href="/shop?sort=rating"
            className="shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 hidden sm:flex"
          >
            See more <ArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="mt-8">
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* ——— Recently viewed ——— */}
      {recentProducts.length > 0 && (
        <section className="container-page py-12 lg:py-16 border-t border-line">
          <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Pick up where you left
              </p>
              <h2 className="heading-2 mt-2">Recently Viewed</h2>
            </div>
            <Link
              href="/shop"
              className="shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 hidden sm:flex"
            >
              Explore all <ArrowRight size={16} />
            </Link>
          </motion.div>
          <div className="mt-8">
            <ProductGrid products={recentProducts} />
          </div>
        </section>
      )}

      {/* ——— CTA ——— */}
      <section className="container-page pb-16 lg:pb-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-center text-white sm:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="heading-2 text-balance">Your first order is 15% off</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Create an account and use code <span className="font-bold text-white">WELCOME15</span> at
            checkout.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 font-semibold text-brand-700 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create account
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-8 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Keep shopping
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
