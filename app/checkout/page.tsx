"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Lock,
  Smartphone,
  Truck,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductImage } from "@/components/ProductImage";
import type { Address, Order, OrderItem } from "@/data/types";
import { validateEmail, validatePhone } from "@/lib/auth";
import { computeCart, lineKey } from "@/lib/cart";
import { inr } from "@/lib/format";
import { nextOrderId } from "@/lib/orders";
import { sleep } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";

const steps = ["Address", "Delivery", "Payment"];

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
}

interface CardForm {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon } = useCartStore();
  const products = useProductStore((s) => s.products);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const addAddress = useAddressStore((s) => s.add);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState<AddressForm>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"upi" | "card" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState<CardForm>({ number: "", expiry: "", cvv: "", name: "" });
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof CardForm, string>>>({});

  const totals = useMemo(() => {
    const base = computeCart(items, products, coupon);
    const shipping = delivery === "express" ? 99 : 0;
    return { ...base, shipping, total: base.subtotal - base.discount + shipping + base.tax };
  }, [items, products, coupon, delivery]);

  if (items.length === 0 && !placing) {
    return (
      <div className="container-page py-16">
        <h1 className="heading-2 mb-8">Checkout</h1>
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title="Nothing to check out"
          description="Your cart is empty. Add some products before heading to checkout."
          actionLabel="Explore products"
          actionHref="/shop"
        />
      </div>
    );
  }

  const set = (k: keyof AddressForm, v: string) => setAddress((a) => ({ ...a, [k]: v }));

  const validateAddress = () => {
    const e: typeof addressErrors = {};
    if (address.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
    if (!validatePhone(address.phone)) e.phone = "Enter a valid phone number.";
    if (!validateEmail(address.email)) e.email = "Enter a valid email address.";
    if (address.line.trim().length < 5) e.line = "Enter your full address.";
    if (!address.city.trim()) e.city = "Required.";
    if (!address.state.trim()) e.state = "Required.";
    if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode.";
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (payment === "upi") {
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        setPaymentErrors({});
        toast("Enter a valid UPI ID (e.g. name@upi)", "error");
        return false;
      }
      return true;
    }
    if (payment === "card") {
      const e: typeof paymentErrors = {};
      if (card.number.replace(/\s/g, "").length !== 16) e.number = "Card number must be 16 digits.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim())) e.expiry = "Use MM/YY format.";
      if (!/^\d{3,4}$/.test(card.cvv.trim())) e.cvv = "3–4 digits.";
      if (card.name.trim().length < 2) e.name = "Enter the name on card.";
      setPaymentErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const next = () => {
    if (step === 0 && !validateAddress()) return;
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeNow = async () => {
    if (!validatePayment()) return;
    setPlacing(true);
    await sleep(1400);

    const orderItems: OrderItem[] = computeCart(items, products, coupon).items.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      brand: l.product.brand,
      price: l.product.price,
      quantity: l.quantity,
      image: l.product.images[0],
      color: l.color,
      size: l.size,
    }));

    const fullAddress: Address = {
      id: "addr-" + Date.now(),
      fullName: address.fullName.trim(),
      phone: address.phone.trim(),
      email: address.email.trim(),
      line: address.line.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };
    addAddress(fullAddress);

    const eta = new Date();
    eta.setDate(eta.getDate() + (delivery === "express" ? 2 : 5));
    const etaLabel = `${delivery === "express" ? "Express" : "Standard"} · by ${eta.toLocaleDateString(
      "en-IN",
      { weekday: "short", day: "numeric", month: "short" }
    )}`;

    const paymentLabel =
      payment === "upi" ? "UPI" : payment === "card" ? "Credit/Debit Card" : "Cash on Delivery";

    const order: Order = {
      id: nextOrderId(),
      date: new Date().toISOString(),
      items: orderItems,
      subtotal: totals.subtotal,
      discount: totals.discount,
      coupon: coupon ?? undefined,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      status: "Processing",
      paymentMethod: paymentLabel,
      address: fullAddress,
      deliveryEstimate: etaLabel,
    };

    placeOrder(order);
    useProductStore.getState().deductStock(orderItems);
    useCartStore.getState().clear();
    toast("Order placed successfully", "success");
    router.push(`/order-success/${order.id}`);
  };

  return (
    <div className="container-page py-8 lg:py-10">
      <h1 className="heading-2">Checkout</h1>

      {/* Step indicator */}
      <ol className="mt-6 flex items-center gap-2 sm:gap-3" aria-label="Checkout progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                i === step
                  ? "bg-brand-600 text-white"
                  : i < step
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-surface2 text-muted"
              )}
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  i === step ? "bg-white/20" : i < step ? "bg-emerald-500 text-white" : "bg-surface text-muted"
                )}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="rounded-3xl border border-line bg-surface p-6">
                  <h2 className="heading-3">Delivery address</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Input label="Full name" name="fullName" value={address.fullName} onChange={(e) => set("fullName", e.target.value)} error={addressErrors.fullName} placeholder="Chandan Kumar" />
                    <Input label="Phone" name="phone" type="tel" value={address.phone} onChange={(e) => set("phone", e.target.value)} error={addressErrors.phone} placeholder="+91 98765 43210" />
                    <Input label="Email" name="email" type="email" value={address.email} onChange={(e) => set("email", e.target.value)} error={addressErrors.email} placeholder="you@email.com" />
                    <Input label="Pincode" name="pincode" inputMode="numeric" maxLength={6} value={address.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} error={addressErrors.pincode} placeholder="201301" />
                    <div className="sm:col-span-2">
                      <Input label="Address" name="line" value={address.line} onChange={(e) => set("line", e.target.value)} error={addressErrors.line} placeholder="Flat / House no., Street, Locality" />
                    </div>
                    <Input label="City" name="city" value={address.city} onChange={(e) => set("city", e.target.value)} error={addressErrors.city} placeholder="Noida" />
                    <Input label="State" name="state" value={address.state} onChange={(e) => set("state", e.target.value)} error={addressErrors.state} placeholder="Uttar Pradesh" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="rounded-3xl border border-line bg-surface p-6">
                  <h2 className="heading-3">Choose delivery</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        id: "standard" as const,
                        title: "Standard Delivery",
                        desc: "2–5 business days",
                        price: "Free",
                        icon: Truck,
                      },
                      {
                        id: "express" as const,
                        title: "Express Delivery",
                        desc: "1–2 business days",
                        price: "₹99",
                        icon: Zap,
                      },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDelivery(d.id)}
                        aria-pressed={delivery === d.id}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                          delivery === d.id
                            ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10"
                            : "border-line hover:border-brand-300"
                        )}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-brand-600">
                          <d.icon size={18} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold">{d.title}</span>
                          <span className="block text-sm text-muted">{d.desc}</span>
                        </span>
                        <span className="font-bold">{d.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="rounded-3xl border border-line bg-surface p-6">
                  <h2 className="heading-3">Payment method</h2>
                  <div className="mt-5 space-y-3">
                    {[
                      { id: "upi" as const, title: "UPI", desc: "GPay, PhonePe, Paytm & more", icon: Smartphone },
                      { id: "card" as const, title: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
                      { id: "cod" as const, title: "Cash on Delivery", desc: "Pay when your order arrives", icon: Banknote },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPayment(m.id)}
                        aria-pressed={payment === m.id}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                          payment === m.id
                            ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10"
                            : "border-line hover:border-brand-300"
                        )}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-brand-600">
                          <m.icon size={18} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold">{m.title}</span>
                          <span className="block text-sm text-muted">{m.desc}</span>
                        </span>
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border-2",
                            payment === m.id ? "border-brand-600" : "border-line"
                          )}
                        >
                          {payment === m.id && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                        </span>
                      </button>
                    ))}
                  </div>

                  {payment === "upi" && (
                    <div className="mt-5">
                      <Input label="UPI ID" name="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
                    </div>
                  )}

                  {payment === "card" && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input label="Card number" name="cardNumber" inputMode="numeric" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim() })} error={paymentErrors.number} placeholder="1234 5678 9012 3456" />
                      </div>
                      <Input label="Expiry" name="expiry" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} error={paymentErrors.expiry} placeholder="MM/YY" maxLength={5} />
                      <Input label="CVV" name="cvv" type="password" inputMode="numeric" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} error={paymentErrors.cvv} placeholder="•••" />
                      <div className="sm:col-span-2">
                        <Input label="Name on card" name="cardName" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} error={paymentErrors.name} placeholder="CHANDAN KUMAR" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={back} disabled={step === 0 || placing} className="btn-outline disabled:opacity-40">
              <ArrowLeft size={16} /> Back
            </button>
            {step < 2 ? (
              <button onClick={next} className="btn-primary px-9">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={placeNow} disabled={placing} className="btn-primary min-w-[180px]">
                {placing ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Placing order…
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Place Order
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-24 rounded-3xl border border-line bg-surface p-6">
            <h2 className="heading-3">Order Summary</h2>
            <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
              {totals.items.map((l) => (
                <li key={lineKey(l)} className="flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface2">
                    <ProductImage src={l.product.images[0]} alt={l.product.name} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{l.product.name}</span>
                    <span className="block text-xs text-muted">Qty {l.quantity}</span>
                  </span>
                  <span className="text-sm font-semibold">{inr(l.product.price * l.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{inr(totals.subtotal)}</span></div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Discount {coupon && `(${coupon})`}</span><span>-{inr(totals.discount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{totals.shipping === 0 ? "Free" : inr(totals.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax (5% GST)</span><span>{inr(totals.tax)}</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total</span><span>{inr(totals.total)}</span></div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <Lock size={13} className="text-emerald-600" /> This is a demo checkout — no real payment is processed.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
