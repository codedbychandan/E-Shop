# E-Shop — Everything you want. One place.

A complete, production-style dummy e-commerce store built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React** and **Zustand** (persisted to `localStorage`). No backend — all data and behaviour are simulated client-side.

> ⚠️ This is a frontend demo. Authentication, payments and orders are simulated and stored only in your browser.

---

## ✨ Feature highlights

- **22 routes** — Home, Shop, Product details, Search, Categories, Deals, Cart, Checkout (3 steps), Order Success, Wishlist, Login, Register, Forgot Password, Profile, Orders, Order Details (with tracking timeline), About, Contact, FAQ, Privacy, Terms, Admin dashboard + a custom 404.
- **Working store logic** — add/remove cart, quantity controls, wishlist toggling, coupon system, order creation, order history & live status sync, profile & address editing.
- **Search** — live suggestions (searches name, brand, category, description, tags) with a dedicated results page.
- **Shop filters** — category, brand, price range, rating, availability, discount and colour, plus 6 sort options and a grid/list toggle.
- **Admin** (`/admin`) — sales dashboard with a custom SVG chart, product CRUD (add/edit/delete → instantly live in the shop), and order status management (syncs to the customer's order page).
- **Premium UI** — dark/light mode (persisted, no flash), glassmorphism accents, skeleton loaders, animated toasts, Framer Motion page/card/modal animations, fully responsive (320px → 1920px).
- **Seeded data** — 34 realistic products across 6 categories with Indian ₹ pricing, 10+ reviews, 5 sample orders, 3 coupons.

## 🧪 Demo credentials & coupons

| Thing | Value |
| --- | --- |
| Demo login | `chandan@E-Shop.in` / `chandan123` |
| Coupons | `E-Shop10` (10%), `WELCOME15` (15% over ₹999), `SAVE20` (20% over ₹2,499) |
| Admin | `/admin` (open access, demo only) |

## 🚀 Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## 🗂 Project structure

```
app/                 # App-router pages (22 routes)
components/          # Navbar, Footer, ProductCard, CartDrawer, FilterSidebar,
                     # SearchOverlay, QuickView, Toaster, admin/*, ui/* …
data/                # products, categories, reviews, coupons, seed orders, types
lib/                 # cart, filters, coupons, auth, orders, format, storage, utils
store/               # zustand stores (cart, wishlist, auth, orders, products, theme, toast …)
hooks/               # useMounted, useCountdown, useDebounce, useSimulatedLoad, useCatalog
```

**State & persistence:** Zustand `persist` stores everything under `E-Shop-*` keys in `localStorage` (cart, wishlist, user, users, orders, products, theme, addresses, reviews, coupons are handled by lib helpers). Reset any time via **Account → Settings → Reset demo data**.

## 🧭 Key user journeys (all tested)

1. Home → Shop → Product → Add to Cart → Cart → Checkout → Place Order → Order Success
2. Shop → Search → Filter → Product → Wishlist → Add to Cart
3. Register → Login → Profile → Edit Profile → Orders → Logout
4. Admin → Dashboard → Add Product → Shop → Product
5. Admin → Orders → Change Status → User Orders
