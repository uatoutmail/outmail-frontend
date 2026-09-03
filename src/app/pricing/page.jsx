import React from "react";
import Footer from "@/component/Footer";
import Faq from "@/component/landing/Faq";
import Validation from "@/component/landing/Validation";
import { Cta } from "@/component/motion/kit";
import Navbar from "@/component/Navbar";
import PricingJsonLd from "@/component/pages/PricingJsonLd";
import WhatYouGet from "@/component/pages/WhatYouGet";
import Pricing from "@/component/pricing";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "Pricing",
  description:
    "One payment for twelve months of Outmail. No subscription, nothing renews, all taxes included, and a full refund within 7 days.",
  alternates: { canonical: "https://outmail.in/pricing" },
  openGraph: {
    title: "Pricing | Outmail",
    description: "One payment. Twelve months. Nothing renews. Full refund within 7 days.",
    url: "https://outmail.in/pricing",
    type: "website",
    images: [{ url: "/image.png", width: 1536, height: 1024, alt: "Outmail pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Outmail",
    description: "One payment. Twelve months. Nothing renews.",
    images: ["/image.png"],
  },
};

/**
 * The pricing page.
 *
 * The checkout component is untouched — it is the only place a customer can
 * pay, every number in it comes from /api/payments/plans, and it is not
 * something to restyle casually. What changed is everything around it: the
 * page now opens with the site's standard header instead of a bespoke hero
 * with three floating decorative squares, and the FAQ and social proof are the
 * same components the landing page uses rather than older duplicates.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <PricingJsonLd />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Pricing"
          lines={["One payment.", "Twelve months."]}
          sub="Outmail emails real recruiters from your own inbox and puts matched openings in front of you. Pay once — no subscription, nothing renews. Not right for you? Full refund within 7 days."
        >
          <Cta label="See the plans" href="#pricing" />
        </PageHeader>

        <WhatYouGet />
        <div id="pricing" className="scroll-mt-20">
          <Pricing />
        </div>
        <Validation />
        <Faq />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
