"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { validateEmail } from "@/lib/auth";

const info = [
  { icon: Mail, label: "Email", value: "support@eshop.in", href: "mailto:support@eshop.in" },
  { icon: Phone, label: "Phone", value: "+91 1800-123-4567", href: "tel:+9118001234567" },
  { icon: MapPin, label: "Address", value: "E-Shop HQ, 12th Floor, DLF Cyber City, Gurugram, Haryana 122002", href: undefined },
  { icon: Clock, label: "Support hours", value: "Mon–Sat, 9:00 AM – 8:00 PM IST", href: undefined },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (!validateEmail(form.email)) er.email = "Enter a valid email.";
    if (form.subject.trim().length < 3) er.subject = "Please add a subject.";
    if (form.message.trim().length < 10) er.message = "Message should be at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 700);
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Contact</p>
        <h1 className="heading-1 mt-2">We&apos;d love to hear from you</h1>
        <p className="mt-4 text-lg text-muted">
          Questions, feedback or just want to say hi? Drop us a line and we&apos;ll get back within a
          business day.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* Info */}
        <div className="space-y-4">
          {info.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3.5 rounded-3xl border border-line bg-surface p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <c.icon size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="mt-0.5 block font-medium text-ink hover:text-brand-600">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-0.5 font-medium text-ink">{c.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 size={52} className="text-emerald-500" />
              <h2 className="heading-3 mt-4">Message sent successfully!</h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Thanks for reaching out. Our support team will get back to you within one business
                day.
              </p>
              <button onClick={() => setSent(false)} className="btn-outline mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} placeholder="Your name" />
                <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="you@email.com" />
              </div>
              <Input label="Subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} error={errors.subject} placeholder="How can we help?" />
              <Textarea label="Message" value={form.message} onChange={(e) => set("message", e.target.value)} error={errors.message} placeholder="Tell us more…" />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
