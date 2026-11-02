import type { Coupon } from "./types";

export const coupons: Coupon[] = [
  {
    code: "ESHOP10",
    percent: 10,
    minOrder: 0,
    description: "10% off your entire order",
  },
  {
    code: "NEXORA10",
    percent: 10,
    minOrder: 0,
    description: "10% off your entire order",
  },
  {
    code: "WELCOME15",
    percent: 15,
    minOrder: 999,
    description: "15% off on orders above ₹999",
  },
  {
    code: "SAVE20",
    percent: 20,
    minOrder: 2499,
    description: "20% off on orders above ₹2,499",
  },
];

export function getCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}
