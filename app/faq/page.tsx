"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LifeBuoy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QA {
  q: string;
  a: string;
}

const groups: { title: string; items: QA[] }[] = [
  {
    title: "Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 2–5 business days across India and is completely free. Express delivery arrives in 1–2 business days in major metros for ₹99.",
      },
      {
        q: "Do you deliver to my city?",
        a: "We deliver to 600+ cities across India. Enter your pincode at checkout to confirm availability and estimated delivery for your address.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive tracking details by SMS and email. You can also see live status anytime from the My Orders page.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "You can return most items within 7 days of delivery for a full refund or exchange — no questions asked. Items must be unused, in original packaging with tags intact.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed to the original payment method within 5–7 business days after we receive and inspect the returned item.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept UPI (GPay, PhonePe, Paytm), all major credit and debit cards, and Cash on Delivery on eligible orders.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Yes. All payments are processed over encrypted connections. This demo store doesn't process real payments — no card details are ever stored.",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        q: "Can I modify or cancel my order?",
        a: "You can cancel an order for free any time before it ships. Once shipped, it can't be modified — but you can still return it after delivery.",
      },
      {
        q: "I received a damaged item. What now?",
        a: "Sorry about that! Contact support within 48 hours of delivery with a photo, and we'll arrange a free replacement or refund right away.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        q: "Do I need an account to shop?",
        a: "No — you can check out as a guest. But an account lets you track orders, save addresses, build a wishlist and unlock welcome offers.",
      },
      {
        q: "I forgot my password. Help?",
        a: "Use the Forgot Password page to request a reset link. (This is a demo, so the reset is simulated — you can simply re-register.)",
      },
    ],
  },
  {
    title: "Cancellation",
    items: [
      {
        q: "Are there cancellation charges?",
        a: "No. Orders cancelled before shipping are fully refunded with zero charges. COD orders are simply not billed.",
      },
      {
        q: "How do I cancel an order?",
        a: "Open My Orders, select the order and choose Cancel. If the option isn't visible, the order has already shipped — use the return flow instead.",
      },
    ],
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-ink">{q}</span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-muted transition-transform duration-300", open && "rotate-180 text-brand-600")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">FAQ</p>
        <h1 className="heading-1 mt-2">Frequently asked questions</h1>
        <p className="mt-4 text-lg text-muted">
          Everything you need to know about shipping, returns, payments and more.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-6">
        {groups.map((g, gi) => (
          <div key={g.title} className="rounded-3xl border border-line bg-surface px-6 py-2">
            <h2 className="pt-4 text-sm font-bold uppercase tracking-wide text-brand-600">
              {g.title}
            </h2>
            <div>
              {g.items.map((item, ii) => {
                const id = `${gi}-${ii}`;
                return (
                  <FaqItem
                    key={id}
                    q={item.q}
                    a={item.a}
                    open={open === id}
                    onToggle={() => setOpen(open === id ? null : id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-line bg-surface p-8 text-center">
        <LifeBuoy size={28} className="mx-auto text-brand-600" />
        <h2 className="heading-3 mt-3">Still have questions?</h2>
        <p className="mt-2 text-sm text-muted">
          Our support team is happy to help, Monday to Saturday.
        </p>
        <Link href="/contact" className="btn-primary mt-5">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
