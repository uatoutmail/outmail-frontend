"use client";
import React from "react";
import Footer from "@/component/Footer";
import Faq from "@/component/landing/Faq";
import Validation from "@/component/landing/Validation";
import { Cta } from "@/component/motion/kit";
import Navbar from "@/component/Navbar";
import WhatYouGet from "@/component/pages/WhatYouGet";
import Pricing from "@/component/pricing";
import PageHeader from "@/component/ui/PageHeader";

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
