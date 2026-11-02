export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  images: string[];
  stock: number;
  brand: string;
  colors: string[];
  sizes?: string[];
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  accent: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface TimelineStep {
  label: string;
  description: string;
  done: boolean;
  current?: boolean;
  date?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon?: string;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  address: Address;
  deliveryEstimate: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface Coupon {
  code: string;
  percent: number;
  minOrder: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
