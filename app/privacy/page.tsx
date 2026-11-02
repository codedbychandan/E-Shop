import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "1. Overview",
    body: "E-Shop is a fictional demonstration storefront. This Privacy Policy explains what data the demo collects in your browser and how it is used. Because this is a frontend-only demo, no personal information is ever transmitted to, or stored on, any server.",
  },
  {
    title: "2. Data we store",
    body: "Everything you do in this demo is saved locally in your browser using localStorage. This includes your cart, wishlist, account details, saved addresses, orders, theme preference and any products you add or edit in the admin panel. This data never leaves your device.",
  },
  {
    title: "3. How we use your data",
    body: "The locally stored data exists solely to make the demo functional — to remember your cart between visits, keep you signed in, show your order history and preserve your preferences. It is not used for marketing, analytics or any other purpose.",
  },
  {
    title: "4. Cookies & storage",
    body: "The demo uses browser storage (localStorage) rather than cookies. You can clear this at any time from your browser settings, or by using the 'Reset demo data' option in your account settings.",
  },
  {
    title: "5. Third-party services",
    body: "Product imagery is loaded from a third-party image CDN for demonstration purposes. Those requests may be logged by the CDN as standard web traffic. No personal data is shared in those requests.",
  },
  {
    title: "6. Your choices",
    body: "You can delete all demo data at any time by clearing your browser's site data or by choosing 'Reset demo data' in Settings. You are not required to create an account to use the demo.",
  },
  {
    title: "7. Contact",
    body: "Questions about this policy can be sent to support@E-Shop.in. This is a fictional address used for demonstration purposes only.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Legal</p>
        <h1 className="heading-1 mt-2">Privacy Policy</h1>
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
