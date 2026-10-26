import Footer from "@/component/Footer";
import Faq from "@/component/landing/Faq";
import Navbar from "@/component/Navbar";
import PageHeader from "@/component/ui/PageHeader";
import { FAQS } from "@/lib/faqs";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "FAQ | Outmail - Personalized Cold Outreach",
  description:
    "Frequently asked questions about Outmail. Learn how our personalized cold outreach and recruiter search at scale can help your career growth.",
  alternates: {
    canonical: "https://outmail.in/faq",
  },
  openGraph: {
    title: "FAQ | Outmail - Personalized Cold Outreach",
    description:
      "Frequently asked questions about Outmail. Learn how our personalized cold outreach and recruiter search at scale can help your career growth.",
    url: "https://outmail.in/faq",
    type: "website",
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <JsonLd schema={faqSchema(FAQS)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <main>
        <PageHeader
          kicker="Questions"
          lines={["Everything worth", "asking before you pay."]}
          sub="Grouped by what people actually worry about. If your question is not here, a person replies to support@outmail.in."
        />
        <Faq />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
