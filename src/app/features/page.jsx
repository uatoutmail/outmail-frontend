import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import Footer from "@/component/Footer";
import Faq from "@/component/landing/Faq";
import { Cta } from "@/component/motion/kit";
import Navbar from "@/component/Navbar";
import { GlanceChips, FeaturesChapters, ProofComparison } from "@/component/pages/FeaturesSections";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "Features",
  description:
    "Cold outreach to verified recruiters from your own Gmail, resume-matched job openings with an explainable score, one-click application autofill, and bi-weekly mentorship.",
  alternates: { canonical: "https://outmail.in/features" },
  openGraph: {
    title: "Features | Outmail",
    description:
      "The four things that decide whether effort turns into interviews: outreach, matched jobs, autofill and mentorship.",
    url: "https://outmail.in/features",
    type: "website",
    images: [{ url: "/image.png", width: 1536, height: 1024, alt: "Outmail features" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features | Outmail",
    description:
      "Outreach, matched jobs, autofill and mentorship — for students with no referrals.",
    images: ["/image.png"],
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Core features"
          lines={["What Outmail does", "for students."]}
          sub="Recruiter outreach, resume-matched openings, one-click applications and mentorship — the four things that decide whether effort turns into interviews."
        >
          <Cta label="Start your year" href="/pricing" />
        </PageHeader>
        <GlanceChips />
        <FeaturesChapters />
        <ProofComparison />
        <Faq />

        <section className="px-6 pb-24 pt-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Start landing the right interviews.
            </h2>
            {/* Not "free forever" — there is no free tier, only three trial sends. */}
            <p className="text-white/50 text-base max-w-xl mx-auto mb-8">
              Everything above for ₹999 — one payment, twelve months, nothing renews. Full refund
              within 7 days.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Cta label="Start your year" href="/pricing" />
              <Link
                href="/partnership"
                className="inline-flex items-center justify-center rounded-pill border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-syne font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" /> For universities
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="dark" />
    </div>
  );
}
