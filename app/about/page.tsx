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
  { name: "Ananya Iyer", role: "Founder & CEO" },
  { name: "Rohan Mehta", role: "Head of Product" },
  { name: "Priya Sharma", role: "Design Lead" },
  { name: "Kunal Shah", role: "Head of Operations" },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="container-page py-14 text-center lg:py-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted"
        >
          <Sparkles size={14} className="text-brand-600" /> Our story
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="heading-1 mx-auto mt-6 max-w-3xl text-balance"
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
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
        >
          E-Shop is a fictional modern marketplace on a simple mission: make it effortless to
          discover quality products that genuinely improve everyday life — from the tech on your
          desk to the shoes on your feet.
        </motion.p>
      </section>

      {/* Mission / Vision */}
      <section className="container-page grid gap-6 pb-14 md:grid-cols-2 lg:pb-20">
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
            className="rounded-[2rem] border border-line bg-surface p-8 sm:p-10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <b.icon size={22} />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-brand-600">{b.kicker}</p>
            <h2 className="heading-3 mt-2">{b.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{b.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Why E-Shop */}
      <section className="bg-surface py-14 lg:py-20">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Why E-Shop</p>
            <h2 className="heading-2 mt-2">Built different, on purpose</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-3xl border border-line bg-canvas p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <v.icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page py-14 lg:py-20">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-line bg-surface p-8 text-center"
            >
              <p className="font-display text-4xl font-bold text-brand-600">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">The team</p>
          <h2 className="heading-2 mt-2">People behind E-Shop</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            A small, obsessive team that ships fast and sweats the details.
          </p>
        </motion.div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-line bg-surface p-6 text-center"
            >
              <Avatar name={m.name} size={72} />
              <p className="mt-4 font-semibold">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/shop" className="btn-primary">
            <Boxes size={17} /> Start shopping
          </Link>
          <Link href="/contact" className="btn-outline">
            <Award size={17} /> Get in touch
          </Link>
          <Link href="/about#story" className="btn-ghost">
            <Rocket size={17} /> Our story
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
