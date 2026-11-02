import type { Review } from "./types";

export const seedReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    user: "Rohan Mehta",
    rating: 5,
    title: "Silence, finally",
    comment:
      "The ANC is genuinely impressive — my morning commute is basically silent now. Battery easily lasts me a full week of mixed use.",
    date: "2026-08-14",
  },
  {
    id: "r2",
    productId: "p1",
    user: "Sneha Iyer",
    rating: 4,
    title: "Comfortable for long calls",
    comment:
      "Ear cups are plush and I can wear these through a 3-hour meeting without fatigue. Slightly tight clamp out of the box but it loosens up.",
    date: "2026-07-28",
  },
  {
    id: "r3",
    productId: "p2",
    user: "Arjun Nair",
    rating: 5,
    title: "Beats watches twice the price",
    comment:
      "AMOLED is bright even outdoors and the GPS locks fast. Sleep tracking is surprisingly detailed. Two weeks of battery is real.",
    date: "2026-08-02",
  },
  {
    id: "r4",
    productId: "p3",
    user: "Kunal Shah",
    rating: 5,
    title: "Endgame keyboard",
    comment:
      "Gasket mount feels bouncy and the factory lubed switches sound incredible. Hot-swap worked flawlessly when I swapped in tactiles.",
    date: "2026-08-09",
  },
  {
    id: "r5",
    productId: "p11",
    user: "Priya Sharma",
    rating: 4,
    title: "Great daily runner",
    comment:
      "Light and springy with a roomy toe box. Ran a 10K in them on day two with zero break-in. Go half a size up if you have wide feet.",
    date: "2026-08-11",
  },
  {
    id: "r6",
    productId: "p13",
    user: "Aditya Rao",
    rating: 5,
    title: "My everyday carry",
    comment:
      "Fits a 16-inch laptop, charger, lunch and gym clothes with room to spare. The anti-theft pocket is a thoughtful touch.",
    date: "2026-07-19",
  },
  {
    id: "r7",
    productId: "p17",
    user: "Meera Krishnan",
    rating: 5,
    title: "Beautiful light",
    comment:
      "The warm mode is perfect for late reading. Build feels far more expensive than the price. Bought a second one for my partner.",
    date: "2026-08-05",
  },
  {
    id: "r8",
    productId: "p23",
    user: "Tanvi Deshpande",
    rating: 4,
    title: "Visible glow in 3 weeks",
    comment:
      "My dark spots have visibly faded and the texture is better. No sticky residue. Wish the bottle were bigger, that's my only gripe.",
    date: "2026-07-30",
  },
  {
    id: "r9",
    productId: "p28",
    user: "Vikram Singh",
    rating: 5,
    title: "Solid and floor-safe",
    comment:
      "Rubber hex coating means no scratched floors and no rolling away. Knurling is grippy even with sweaty hands.",
    date: "2026-08-12",
  },
  {
    id: "r10",
    productId: "p30",
    user: "Ananya Bose",
    rating: 4,
    title: "Stays cold all day",
    comment:
      "Filled it at 8am with ice water, still cold at 9pm in a hot car. Finish picks up scratches over time, but it's tough.",
    date: "2026-07-24",
  },
];

// Generic pool so every product page can show believable reviews.
export const genericReviews: Review[] = [
  {
    id: "g1",
    productId: "",
    user: "Nikhil Verma",
    rating: 5,
    title: "Exactly as described",
    comment:
      "Quality exceeded my expectations for the price. Packaging was neat and delivery arrived a day early.",
    date: "2026-08-15",
  },
  {
    id: "g2",
    productId: "",
    user: "Pooja Agarwal",
    rating: 4,
    title: "Very happy with it",
    comment:
      "Does what it promises and feels well made. Took one star off only because I wish there were more colour options.",
    date: "2026-08-06",
  },
  {
    id: "g3",
    productId: "",
    user: "Rahul Khanna",
    rating: 5,
    title: "Would buy again",
    comment:
      "This is my second E-Shop purchase and both times the experience was smooth. The product itself is reliable and well finished.",
    date: "2026-07-22",
  },
];

export function getReviewsForProduct(productId: string): Review[] {
  const specific = seedReviews.filter((r) => r.productId === productId);
  if (specific.length > 0) return specific;
  return genericReviews.map((r, i) => ({
    ...r,
    id: `${productId}-${r.id}`,
    productId,
    date: i === 0 ? "2026-08-13" : i === 1 ? "2026-08-03" : "2026-07-18",
  }));
}
