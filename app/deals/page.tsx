"use client";

import { motion } from "framer-motion";
import { Flame, Gauge, Percent, Sparkles } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductGrid } from "@/components/ProductGrid";
import { useFlashTarget } from "@/hooks/useCountdown";
import { useProductStore } from "@/store/product-store";

function SectionHeader({
  icon,
  kicker,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{kicker}</p>
        <h2 className="heading-3 mt-0.5">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export default function DealsPage() {
  const flashTarget = useFlashTarget();
  const products = useProductStore((s) => s.products);

  const flashDeals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 8);
  const fiftyOff = products.filter((p) => p.discount >= 45).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const limited = products.filter((p) => p.newArrival && p.discount > 0).slice(0, 8);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Deals</p>
        <h1 className="heading-1 mt-2">Today&apos;s best deals</h1>
        <p className="mt-4 text-lg text-muted">
          Hand-picked markdowns across every category. When they&apos;re gone, they&apos;re gone.
        </p>
      </div>

      {/* Flash deals */}
      <section className="mt-10 overflow-hidden rounded-[2rem] bg-ink p-6 text-canvas dark:bg-surface2 dark:text-ink sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
              <Flame size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-300">Ending soon</p>
              <h2 className="heading-3">Flash Deals</h2>
            </div>
          </div>
          <CountdownTimer target={flashTarget} size="lg" />
        </div>
        <div className="mt-7">
          <ProductGrid products={flashDeals} />
        </div>
      </section>

      {/* Up to 50% off */}
      <section className="mt-14">
        <SectionHeader
          icon={<Percent size={20} />}
          kicker="Biggest drops"
          title="Up to 50% off"
          subtitle="The steepest discounts in the store right now"
        />
        <div className="mt-6">
          <ProductGrid products={fiftyOff} />
        </div>
      </section>

      {/* Best sellers */}
      <section className="mt-14">
        <SectionHeader
          icon={<Gauge size={20} />}
          kicker="Most wanted"
          title="Best sellers on sale"
          subtitle="Proven favourites, now at better prices"
        />
        <div className="mt-6">
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Limited time offers */}
      <section className="mt-14">
        <SectionHeader
          icon={<Sparkles size={20} />}
          kicker="New & discounted"
          title="Limited time offers"
          subtitle="Fresh arrivals with launch pricing"
        />
        <div className="mt-6">
          {limited.length > 0 ? (
            <ProductGrid products={limited} />
          ) : (
            <p className="text-muted">New offers land every week — check back soon.</p>
          )}
        </div>
      </section>

      <div className="mt-16 text-center">
        <Link href="/shop" className="btn-outline">
          Browse everything in the shop
        </Link>
      </div>
    </div>
  );
}
