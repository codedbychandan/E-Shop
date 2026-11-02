"use client";

import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error ?? "Something went wrong.");
        return;
      }
      toast("Welcome back to E-Shop!");
      router.push("/");
    }, 500);
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
          <h1 className="heading-2 mt-6">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to continue shopping with E-Shop.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={17} className="animate-spin" /> : <Lock size={16} />}
              Sign In
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-surface2 p-4 text-sm">
            <p className="flex items-center gap-1.5 font-semibold text-ink">
              <Sparkles size={15} className="text-brand-600" /> Demo account
            </p>
            <p className="mt-1.5 text-muted">
              <Mail size={13} className="mr-1 inline" />
              chandan@eshop.in · <span className="font-mono">chandan123</span>
            </p>
            <button
              onClick={() => {
                setEmail("chandan@eshop.in");
                setPassword("chandan123");
              }}
              className="mt-2 font-semibold text-brand-600 hover:text-brand-700"
            >
              Autofill demo credentials →
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New to E-Shop?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-muted">
          This is a frontend demo — credentials are stored only in your browser.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20" />}>
      <LoginClient />
    </Suspense>
  );
}
