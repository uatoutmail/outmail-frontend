import { Suspense } from "react";
import AuthErrorNotice from "@/component/auth/AuthErrorNotice";
import Footer from "@/component/Footer";
import ClosingCta from "@/component/landing/ClosingCta";
import Editorial from "@/component/landing/Editorial";
import Faq from "@/component/landing/Faq";
import Hero from "@/component/landing/Hero";
import KineticBand from "@/component/landing/KineticBand";
import PricingLedger from "@/component/landing/PricingLedger";
import Story from "@/component/landing/Story";
import Validation from "@/component/landing/Validation";
import Navbar from "@/component/Navbar";
export const metadata = {
  title: "Outmail | Jobs, Outreach, and Autofill. One Placement Year.",
  description:
    "Outmail helps students through placement season: personalized recruiter outreach, curated job openings, and one-click application autofill, all in one place.",
  alternates: {
    canonical: "https://outmail.in",
  },
  openGraph: {
    title: "Outmail | Jobs, Outreach, and Autofill. One Placement Year.",
    description:
      "Outmail helps students through placement season: personalized recruiter outreach, curated job openings, and one-click application autofill, all in one place.",
    url: "https://outmail.in",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail - Jobs, Outreach, and Autofill",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail | Jobs, Outreach, and Autofill. One Placement Year.",
    description:
      "Outmail helps students through placement season: personalized recruiter outreach, curated job openings, and one-click application autofill, all in one place.",
    images: ["/image.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Outmail",
  url: "https://outmail.in",
  logo: "https://outmail.in/Logo_Outmail.png",
  description:
    "Outmail helps students through placement season with personalized recruiter outreach, curated job openings, and application autofill.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@outmail.in",
    contactType: "customer support",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Outmail",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  url: "https://outmail.in",
  description:
    "Outmail combines personalized recruiter outreach, curated job openings, and one-click application autofill to help students through their placement year.",
  // Structured data is machine-readable and is what search engines surface, so a
  // stale price here is a public claim we cannot honour. It advertised a free
  // plan at $9/month in USD; we sell one placement year for ₹999 in INR, and
  // there is no free plan (OUT-233).
  offers: {
    "@type": "Offer",
    price: "999",
    priceCurrency: "INR",
    url: "https://outmail.in/pricing",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "999",
      priceCurrency: "INR",
      unitText: "One-time payment for one year of access",
    },
  },
  provider: {
    "@type": "Organization",
    name: "Outmail",
    url: "https://outmail.in",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <Suspense fallback={null}>
        <AuthErrorNotice />
      </Suspense>
      <Navbar variant="dark" />
      {/* Order is the argument: promise, capabilities, proof of the problem,
          price, objections, ask. Pricing sits BEFORE the FAQ because the FAQ
          exists to answer what the price makes people wonder. */}
      <Hero />
      <KineticBand />
      <Editorial />
      <Story />
      <Validation />
      <PricingLedger />
      <Faq />
      <ClosingCta />
      <Footer variant="dark" />
    </div>
  );
}
