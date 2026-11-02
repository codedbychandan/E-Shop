"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { validateEmail } from "@/lib/auth";
import { toast } from "@/store/toast-store";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Best Sellers", href: "/shop?sort=rating" },
      { label: "Deals", href: "/deals" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/faq" },
      { label: "Returns", href: "/faq" },
      { label: "Track Order", href: "/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast("Subscribed! Your 10% code is on its way 🎉");
  };

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Everything you want. One place. E-Shop is a modern marketplace for
              thoughtfully designed products, delivered with care.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all hover:border-brand-400 hover:text-brand-600"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted transition-colors hover:text-brand-600"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Get 10% off your first order
            </h4>
            <p className="mt-4 text-sm text-muted">
              Subscribe for early access to drops, deals and a welcome coupon.
            </p>
            <form onSubmit={subscribe} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="input h-11 flex-1"
                />
                <button type="submit" className="btn-primary h-11 shrink-0 px-5">
                  Subscribe
                </button>
              </div>
              {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} E-Shop. A modern demo store — no real products are sold.</p>
          <p className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational · Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}
