"use client";

import { motion } from "framer-motion";
import {
  Award,
  Boxes,
  Eye,
  Gem,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

const stats = [
  { value: "1.2L+", label: "Happy customers" },
  { value: "5L+", label: "Orders delivered" },
  { value: "4.7★", label: "Average rating" },
  { value: "600+", label: "Cities served" },
];

const values = [
  {
    icon: Gem,
    title: "Quality first",
    text: "Every product is hand-picked and quality-checked before it earns a spot in the catalogue.",
  },
  {
    icon: HeartHandshake,
    title: "Customer obsessed",
    text: "Real humans on support, easy returns and a promise to always make things right.",
  },
  {
    icon: Truck,
    title: "Delivered with care",
    text: "Fast, tracked and carbon-aware delivery to over 600 cities across India.",
  },
  {
    icon: ShieldCheck,
    title: "Honest pricing",
    text: "No hidden fees, no fake discounts. What you see is exactly what you pay.",
  },
];

const team = [
  { name: "Chandan Rao", role: "Founder & CEO" },
  { name: "Anuradha Rohilla", role: "Head of Product" },
  { name: "Kanhaiya Kumar", role: "Design Lead" },
  { name: "Daksh Rohilla", role: "Head of Operations" },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="container-page py-10 text-center sm:py-14 lg:py-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm"
        >
          <Sparkles size={14} className="text-brand-600" /> Our story
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="heading-1 mx-auto mt-5 max-w-3xl text-balance"
        >
          Everything you want.{" "}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
            One place.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg"
        >
          E-Shop is a modern marketplace on a simple mission: make it effortless to
          discover quality products that genuinely improve everyday life — from the tech on your
          desk to the shoes on your feet.
        </motion.p>
      </section>

      {/* Mission / Vision */}
      <section className="container-page grid gap-4 pb-12 sm:gap-6 sm:pb-14 md:grid-cols-2 lg:pb-20">
        {[
          {
            icon: Target,
            kicker: "Mission",
            title: "Make everyday shopping effortless and delightful",
            text: "We obsess over selection, pricing and delivery so you can spend less time searching and more time enjoying the things you buy.",
          },
          {
            icon: Eye,
            kicker: "Vision",
            title: "A store that feels personal to everyone",
            text: "We want E-Shop to be the first place people think of — for the big upgrades and the small comforts alike, across every corner of India.",
          },
        ].map((b, i) => (
          <motion.div
            key={b.kicker}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-surface p-6 sm:rounded-[2rem] sm:p-10 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 sm:h-12 sm:w-12">
              <b.icon size={22} />
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-600 sm:mt-5">{b.kicker}</p>
            <h2 className="heading-3 mt-1.5 sm:mt-2">{b.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">{b.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Why E-Shop */}
      <section className="bg-surface py-12 sm:py-14 lg:py-20 border-y border-line">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 sm:text-sm">Why E-Shop</p>
            <h2 className="heading-2 mt-1.5 sm:mt-2">Built different, on purpose</h2>
          </motion.div>
          <div className="mt-8 grid gap-3.5 sm:mt-10 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-line bg-canvas p-5 sm:rounded-3xl sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 sm:h-11 sm:w-11">
                  <v.icon size={20} />
                </span>
                <h3 className="mt-3.5 text-base font-semibold sm:mt-4">{v.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted sm:mt-2">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page py-12 sm:py-14 lg:py-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-line bg-surface p-5 text-center sm:rounded-3xl sm:p-8"
            >
              <p className="font-display text-2xl font-bold text-brand-600 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted sm:mt-2 sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page pb-14 sm:pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 sm:text-sm">The team</p>
          <h2 className="heading-2 mt-1.5 sm:mt-2">People behind E-Shop</h2>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted">
            A passionate team dedicated to delivering an unmatched shopping experience.
          </p>
        </motion.div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-4 text-center sm:rounded-3xl sm:p-6 shadow-card hover:shadow-card-lg transition-shadow"
            >
              <div className="flex h-14 w-14 items-center justify-center sm:h-[72px] sm:w-[72px]">
                <Avatar name={m.name} size={56} />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink sm:mt-4 sm:text-base leading-snug">{m.name}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm leading-snug">{m.role}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          <Link href="/shop" className="btn-primary h-11 px-6 text-sm font-semibold">
            <Boxes size={17} /> Start shopping
          </Link>
          <Link href="/contact" className="btn-outline h-11 px-6 text-sm font-semibold">
            <Award size={17} /> Get in touch
          </Link>
          <Link href="/deals" className="btn-ghost h-11 px-6 text-sm font-semibold">
            <Rocket size={17} /> View Deals
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
