import React from "react";
import Footer from "@/component/Footer";
import Faq from "@/component/landing/Faq";
import { Cta } from "@/component/motion/kit";
import Navbar from "@/component/Navbar";
import ContactRouter from "@/component/pages/ContactRouter";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "Contact & Support",
  description:
    "Questions about your Outmail account, recruiter partnerships, or campus plans for your placement cell. A person replies within 24 hours.",
  alternates: { canonical: "https://outmail.in/contactus" },
  openGraph: {
    title: "Contact & Support | Outmail",
    description: "Ask us anything — a person replies within 24 hours.",
    url: "https://outmail.in/contactus",
    type: "website",
    images: [{ url: "/image.png", width: 1536, height: 1024, alt: "Contact Outmail" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Support | Outmail",
    description: "Ask us anything — a person replies within 24 hours.",
    images: ["/image.png"],
  },
};

/**
 * The Company & Legal block that used to sit here was removed by request: the
 * registered address and phone number are published in the Terms and the
 * Privacy Policy instead, which is where the DPDP Act expects the named
 * Grievance Officer's details to live and where both currently carry them.
 *
 * If Razorpay's activation review asks for contact details on the site itself,
 * putting the block back is a one-line import — do not re-scatter the address
 * across pages to satisfy it.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contactus" },
        ])}
      />
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Contact & support"
          lines={["Have a question?", "A person replies."]}
          sub="Whether you're a student with a question, a recruiter curious about partnerships, or a placement officer exploring campus plans — we reply within 24 hours."
        >
          <Cta label="Send us a message" href="#contact-us" />
        </PageHeader>
        <ContactRouter />
        <Faq />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
