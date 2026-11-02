import type { Order, OrderItem, Address } from "./types";
import { products } from "./products";

const p = (id: string) => products.find((x) => x.id === id)!;

function item(productId: string, quantity: number, color?: string, size?: string): OrderItem {
  const prod = p(productId);
  return {
    productId,
    name: prod.name,
    brand: prod.brand,
    price: prod.price,
    quantity,
    image: prod.images[0],
    color,
    size,
  };
}

const addr = (over: Partial<Address>): Address => ({
  id: `a-${over.city?.toLowerCase()}`,
  fullName: "Chandan Kumar",
  phone: "+91 98765 43210",
  email: "chandan@eshop.in",
  line: "A-42, Sector 18, Noida",
  city: "Noida",
  state: "Uttar Pradesh",
  pincode: "201301",
  ...over,
});

export const seedOrders: Order[] = [
  {
    id: "NX-48312",
    date: "2026-08-20T16:24:00+05:30",
    items: [item("p1", 1, "Midnight Black"), item("p6", 1, "White")],
    subtotal: 4498,
    discount: 450,
    coupon: "ESHOP10",
    shipping: 0,
    tax: 202,
    total: 4250,
    status: "Out for Delivery",
    paymentMethod: "UPI",
    address: addr({ line: "A-42, Sector 18", city: "Noida" }),
    deliveryEstimate: "Tomorrow, 22 Aug 2026",
  },
  {
    id: "NX-48107",
    date: "2026-08-18T11:02:00+05:30",
    items: [item("p2", 1, "Space Grey", "44mm"), item("p7", 1, "Black")],
    subtotal: 5498,
    discount: 825,
    coupon: "WELCOME15",
    shipping: 0,
    tax: 234,
    total: 4907,
    status: "Shipped",
    paymentMethod: "Credit Card",
    address: addr({ line: "A-42, Sector 18", city: "Noida" }),
    deliveryEstimate: "24 Aug 2026",
  },
  {
    id: "NX-47658",
    date: "2026-08-12T09:47:00+05:30",
    items: [item("p11", 1, "Crimson", "UK 9"), item("p15", 2, "Black", "L")],
    subtotal: 3797,
    discount: 759,
    coupon: "SAVE20",
    shipping: 0,
    tax: 152,
    total: 3190,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    address: addr({ line: "A-42, Sector 18", city: "Noida" }),
    deliveryEstimate: "26 Aug 2026",
  },
  {
    id: "NX-46901",
    date: "2026-07-29T20:13:00+05:30",
    items: [item("p17", 1, "White"), item("p19", 1, "Bamboo")],
    subtotal: 2948,
    discount: 0,
    shipping: 0,
    tax: 147,
    total: 3095,
    status: "Delivered",
    paymentMethod: "UPI",
    address: addr({ line: "A-42, Sector 18", city: "Noida" }),
    deliveryEstimate: "Delivered on 2 Aug 2026",
  },
  {
    id: "NX-46477",
    date: "2026-07-21T18:39:00+05:30",
    items: [item("p23", 1, "Default"), item("p24", 1, "Default")],
    subtotal: 1248,
    discount: 125,
    coupon: "ESHOP10",
    shipping: 49,
    tax: 59,
    total: 1231,
    status: "Cancelled",
    paymentMethod: "UPI",
    address: addr({ line: "A-42, Sector 18", city: "Noida" }),
    deliveryEstimate: "Cancelled",
  },
];
