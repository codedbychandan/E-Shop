import type { Category } from "./types";

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  {
    id: "c1",
    name: "Electronics",
    slug: "electronics",
    tagline: "Audio, wearables & gadgets",
    image: u("1498049794561-7780e7231661"),
    accent: "#7c4dff",
  },
  {
    id: "c2",
    name: "Fashion",
    slug: "fashion",
    tagline: "Apparel, footwear & bags",
    image: u("1445205170230-053b83016050"),
    accent: "#f04e6a",
  },
  {
    id: "c3",
    name: "Home & Living",
    slug: "home-living",
    tagline: "Furniture, decor & kitchen",
    image: u("1567016432779-094069958ea5"),
    accent: "#2f9c95",
  },
  {
    id: "c4",
    name: "Beauty",
    slug: "beauty",
    tagline: "Skincare, makeup & haircare",
    image: u("1522335789203-aabd1fc54bc9"),
    accent: "#e58fa9",
  },
  {
    id: "c5",
    name: "Sports",
    slug: "sports",
    tagline: "Fitness, strength & outdoor",
    image: u("1461896836934-ffe607ba8211"),
    accent: "#3f8cff",
  },
  {
    id: "c6",
    name: "Accessories",
    slug: "accessories",
    tagline: "Watches, wallets & travel",
    image: u("1523779917675-b6ed3a42a561"),
    accent: "#c9a26b",
  },
];
