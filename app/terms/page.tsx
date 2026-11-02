import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

const sections = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using the E-Shop demo store, you agree to these Terms & Conditions. If you do not agree, please discontinue use of the site.",
  },
  {
    title: "2. Demo nature of the service",
    body: "E-Shop is a fictional, frontend-only demonstration of an e-commerce experience. All products, prices, brands, reviews, orders and accounts are simulated. No real products are sold, no real payments are processed, and no goods are shipped.",
  },
  {
    title: "3. Accounts",
    body: "You may create an account to explore the demo. Accounts are stored locally in your browser and are not secured by production-grade authentication. Do not use real passwords or personal information you wish to keep private.",
  },
  {
    title: "4. Orders & payments",
    body: "The checkout flow is a simulation. Placing an order does not create a real purchase and no money changes hands. Any card or UPI details you enter in the demo are not transmitted anywhere.",
  },
  {
    title: "5. Intellectual property",
    body: "The E-Shop name, logo and site design are original creations for this demonstration. Product imagery is used for illustrative purposes and may be subject to third-party rights.",
  },
  {
    title: "6. Limitation of liability",
    body: "This demo is provided 'as is' without warranties of any kind. The authors are not liable for any loss or damage arising from use of the demo, including reliance on its simulated data.",
  },
  {
    title: "7. Changes to terms",
    body: "These terms may be updated at any time. Continued use of the demo after changes constitutes acceptance of the revised terms.",
  },
  {
    title: "8. Contact",
    body: "For questions about these terms, contact support@E-Shop.in (a fictional address used for demonstration purposes only).",
  },
];

export default function TermsPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Legal</p>
        <h1 className="heading-1 mt-2">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-muted">Last updated: 21 August 2026</p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="heading-3">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
