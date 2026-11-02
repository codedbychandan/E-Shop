"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";
import { validateEmail } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

export default function ForgotPasswordPage() {
  const users = useAuthStore((s) => s.users);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!exists) {
        setError("No account found with this email.");
        return;
      }
      setSent(true);
    }, 600);
  };

  return (
    <div className="container-page flex justify-center py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <Logo className="justify-center" />
          <h1 className="heading-2 mt-6">Reset your password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
              <h2 className="mt-4 font-semibold">Check your inbox</h2>
              <p className="mt-2 text-sm text-muted">
                If an account exists for <span className="font-medium text-ink">{email}</span>,
                a password reset link is on its way.
              </p>
              <p className="mt-3 text-xs text-muted">
                (Demo only — no email is actually sent.)
              </p>
              <Link href="/login" className="btn-primary mt-6 w-full">
                Back to login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <Loader2 size={17} className="animate-spin" /> : <Mail size={16} />}
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-brand-600">
            <ArrowLeft size={15} /> Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
