import AboutUs from "@/component/aboutuscontent";
import Hero from "@/component/Hero";
import Navbar from "@/component/Navbar";
import Partners from "@/component/Partners";
import Features from "@/component/Features";
import CtaOne from "@/component/ctaone";
import Pricing from "@/component/pricing";
import Testimonials from "@/component/Testimonials";
import Footer from "@/component/Footer";
import Faq from "@/component/faq";
export const metadata = {
  title: "Outmail | Personalized Cold Outreach & Recruiter Search at Scale",
  description:
    "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using professional cold outreach.",
  alternates: {
    canonical: "https://outmail.in",
  },
  openGraph: {
    title: "Outmail | Personalized Cold Outreach & Recruiter Search at Scale",
    description:
      "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using cold outreach.",
    url: "https://outmail.in",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail - Personalized Cold Outreach at Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail | Personalized Cold Outreach & Recruiter Search at Scale",
    description:
      "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using cold outreach.",
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
    "Outmail is a personalized cold outreach platform helping students and professionals reach recruiters at scale.",
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
    "Automate personalized recruiter outreach, track email opens, and get noticed by top companies using Outmail's cold outreach platform.",
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
      <Navbar variant="dark" />
      <Hero />
      <Features />
      <Partners />
      <CtaOne />
      <AboutUs />
      <Pricing />
      <Testimonials />

      <Faq />

      <Footer variant="dark" />
    </div>
  );
}
