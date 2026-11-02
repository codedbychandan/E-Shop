import { getCoupon } from "@/data/coupons";
import { inr } from "@/lib/format";

export interface CouponResult {
  ok: boolean;
  message: string;
}

export function validateCoupon(code: string, subtotal: number): CouponResult {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, message: "Please enter a coupon code." };
  const coupon = getCoupon(trimmed);
  if (!coupon) return { ok: false, message: "That coupon code is invalid." };
  if (subtotal < coupon.minOrder) {
    return {
      ok: false,
      message: `This coupon needs a minimum order of ${inr(coupon.minOrder)}.`,
    };
  }
  return {
    ok: true,
    message: `${coupon.code} applied — ${coupon.percent}% off!`,
  };
}
