"use client";

import { motion } from "framer-motion";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Address } from "@/data/types";
import { validateEmail, validatePhone } from "@/lib/auth";
import { inr } from "@/lib/format";
import { STATUS_META } from "@/lib/orders";
import { cn } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "@/store/toast-store";

type Tab = "profile" | "addresses" | "orders" | "wishlist" | "settings";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Personal Info", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

function AddressForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Address;
  onSave: (data: Omit<Address, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>({
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    line: initial?.line ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    pincode: initial?.pincode ?? "",
  });
  const [errs, setErrs] = useState<Record<string, string>>({});

  const set = (k: keyof Omit<Address, "id">, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.fullName.trim().length < 2) er.fullName = "Required";
    if (!validatePhone(form.phone)) er.phone = "Invalid";
    if (form.line.trim().length < 5) er.line = "Too short";
    if (!form.city.trim()) er.city = "Required";
    if (!form.state.trim()) er.state = "Required";
    if (!/^\d{6}$/.test(form.pincode)) er.pincode = "6 digits";
    setErrs(er);
    if (Object.keys(er).length > 0) return;
    onSave(form);
    onClose();
    toast(initial ? "Address updated" : "Address added");
  };

  return (
    <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
      <Input label="Full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} error={errs.fullName} />
      <Input label="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errs.phone} />
      <div className="sm:col-span-2">
        <Input label="Address" value={form.line} onChange={(e) => set("line", e.target.value)} error={errs.line} placeholder="Flat / House no., Street, Locality" />
      </div>
      <Input label="City" value={form.city} onChange={(e) => set("city", e.target.value)} error={errs.city} />
      <Input label="State" value={form.state} onChange={(e) => set("state", e.target.value)} error={errs.state} />
      <Input label="Pincode" value={form.pincode} maxLength={6} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} error={errs.pincode} />
      <Input label="Email (optional)" value={form.email} onChange={(e) => set("email", e.target.value)} />
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
        <button type="submit" className="btn-primary">Save Address</button>
      </div>
    </form>
  );
}

function AccountClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = (searchParams.get("tab") as Tab) || "profile";
  const [tab, setTab] = useState<Tab>(tabs.some((t) => t.id === initial) ? initial : "profile");

  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const logout = useAuthStore((s) => s.logout);

  const addresses = useAddressStore((s) => s.addresses);
  const addAddress = useAddressStore((s) => s.add);
  const updateAddress = useAddressStore((s) => s.update);
  const removeAddress = useAddressStore((s) => s.remove);

  const orders = useOrderStore((s) => s.orders);
  const wishlistIds = useWishlistStore((s) => s.ids);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profileErr, setProfileErr] = useState("");

  const [addrModal, setAddrModal] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!user) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<User size={26} />}
          title="You're not signed in"
          description="Sign in to view and manage your profile, addresses, orders and wishlist."
          actionLabel="Sign in"
          actionHref="/login"
          secondaryLabel="Create account"
          onSecondary={() => router.push("/register")}
        />
      </div>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setProfileErr("Please enter your name.");
    if (!validateEmail(email)) return setProfileErr("Enter a valid email.");
    if (!validatePhone(phone)) return setProfileErr("Enter a valid phone number.");
    setProfileErr("");
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    toast("Profile updated");
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) return setPwMsg({ ok: false, text: "New password must be at least 6 characters." });
    if (newPw !== confirmPw) return setPwMsg({ ok: false, text: "New passwords do not match." });
    const res = changePassword(curPw, newPw);
    if (!res.ok) return setPwMsg({ ok: false, text: res.error ?? "Failed." });
    setPwMsg({ ok: true, text: "Password changed successfully." });
    setCurPw(""); setNewPw(""); setConfirmPw("");
    toast("Password updated");
  };

  const resetDemo = () => {
    if (confirm("Reset all demo data (cart, orders, products, account)? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={user.name} size={56} />
        <div>
          <h1 className="heading-2">Hi, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <nav aria-label="Account sections" className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.id
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "text-muted hover:bg-surface2 hover:text-ink"
              )}
            >
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="min-w-0">
          {tab === "profile" && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
            >
              <h2 className="heading-3">Personal Information</h2>
              <form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div className="sm:col-span-2">
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {profileErr && <p className="text-sm font-medium text-red-500 sm:col-span-2">{profileErr}</p>}
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary">
                    <Pencil size={15} /> Save Changes
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {tab === "addresses" && (
            <motion.section key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between">
                <h2 className="heading-3">Saved Addresses</h2>
                <button onClick={() => { setEditing(null); setAddrModal(true); }} className="btn-primary h-10 text-sm">
                  <Plus size={16} /> Add Address
                </button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-3xl border border-line bg-surface p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{a.fullName}</p>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(a); setAddrModal(true); }} aria-label="Edit address" className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface2 hover:text-ink">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => { removeAddress(a.id); toast("Address removed", "info"); }} aria-label="Delete address" className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {a.line}<br />
                      {a.city}, {a.state} — {a.pincode}
                    </p>
                    <p className="mt-2 text-sm text-muted">{a.phone}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {tab === "orders" && (
            <motion.section key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between">
                <h2 className="heading-3">Your Orders</h2>
                <Link href="/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
              </div>
              <div className="mt-5 space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-shadow hover:shadow-card">
                    <span className="font-bold text-ink">{o.id}</span>
                    <span className="flex-1 truncate text-sm text-muted">
                      {o.items.reduce((n, x) => n + x.quantity, 0)} items · {inr(o.total)}
                    </span>
                    <Badge tone="neutral"><span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", STATUS_META[o.status].dot)} />{o.status}</Badge>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {tab === "wishlist" && (
            <motion.section key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="heading-3">Your Wishlist</h2>
              <p className="mt-3 text-muted">
                You have <span className="font-bold text-ink">{wishlistIds.length}</span> saved{" "}
                {wishlistIds.length === 1 ? "product" : "products"}.
              </p>
              <div className="mt-5">
                <Link href="/wishlist" className="btn-primary">
                  <Heart size={16} /> Open Wishlist
                </Link>
              </div>
            </motion.section>
          )}

          {tab === "settings" && (
            <motion.section key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <h2 className="heading-3">Change Password</h2>
                <form onSubmit={savePassword} className="mt-5 grid gap-4">
                  <Input label="Current password" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="New password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                    <Input label="Confirm new password" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                  </div>
                  {pwMsg && <p className={cn("text-sm font-medium", pwMsg.ok ? "text-emerald-600" : "text-red-500")}>{pwMsg.text}</p>}
                  <div>
                    <button type="submit" className="btn-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <h2 className="heading-3">Account actions</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => { logout(); router.push("/"); }} className="btn-outline">
                    <LogOut size={16} /> Log out
                  </button>
                  <button onClick={resetDemo} className="btn-outline text-red-500 hover:border-red-300 hover:text-red-600">
                    <RefreshCw size={16} /> Reset demo data
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted">
                  Resetting clears all localStorage data (cart, wishlist, orders, products,
                  account) and reloads the app to its original demo state.
                </p>
              </div>
            </motion.section>
          )}
        </div>
      </div>

      <Modal open={addrModal} onClose={() => setAddrModal(false)} title={editing ? "Edit address" : "Add address"}>
        <AddressForm
          initial={editing ?? undefined}
          onClose={() => setAddrModal(false)}
          onSave={(data) => {
            if (editing) updateAddress(editing.id, data);
            else addAddress(data);
          }}
        />
      </Modal>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-20" />}>
      <AccountClient />
    </Suspense>
  );
}
