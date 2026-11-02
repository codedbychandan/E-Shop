"use client";

import { motion } from "framer-motion";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";
import { validateEmail, validatePassword } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!validateEmail(email)) errs.email = "Enter a valid email address.";
    if (!validatePassword(password)) errs.password = "Password must be at least 6 characters.";
    if (confirm !== password) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const res = register(name, email, password);
      setLoading(false);
      if (!res.ok) {
        setErrors({ form: res.error ?? "Unable to create account." });
        return;
      }
      toast("Account created — please sign in");
      router.push(`/login?email=${encodeURIComponent(email)}`);
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
          <h1 className="heading-2 mt-6">Create your account</h1>
          <p className="mt-2 text-sm text-muted">
            Join E-Shop and get 15% off your first order.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Full name" name="name" placeholder="Chandan Kumar" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input label="Email" name="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input label="Password" name="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <Input label="Confirm password" name="confirm" type="password" placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
            {errors.form && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
                {errors.form}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={16} />}
              Create Account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
