import type { CartLine, Product } from "@/data/types";
import { getCoupon } from "@/data/coupons";

export const lineKey = (l: Pick<CartLine, "productId" | "color" | "size">) =>
  `${l.productId}|${l.color ?? ""}|${l.size ?? ""}`;

export interface CartItemDetail extends CartLine {
  product: Product;
}

export function resolveItems(
  lines: CartLine[],
  products: Product[]
): CartItemDetail[] {
  return lines
    .map((l) => {
      const product = products.find((p) => p.id === l.productId);
      return product ? { ...l, product } : null;
    })
    .filter(Boolean) as CartItemDetail[];
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0);
}

export interface CartTotals {
  items: CartItemDetail[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon?: { code: string; percent: number };
}

export function computeCart(
  lines: CartLine[],
  products: Product[],
  couponCode: string | null
): CartTotals {
  const items = resolveItems(lines, products);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const coupon = couponCode ? getCoupon(couponCode) : undefined;
  let discount = 0;
  if (coupon && subtotal >= coupon.minOrder) {
    discount = Math.round((subtotal * coupon.percent) / 100);
  }

  const taxable = subtotal - discount;
  // Standard delivery is always free; Express (+₹99) is added at checkout.
  const shipping = 0;
  const tax = Math.round(taxable * 0.05);
  const total = taxable + shipping + tax;

  return {
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    coupon: coupon ? { code: coupon.code, percent: coupon.percent } : undefined,
  };
}
