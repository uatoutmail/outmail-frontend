import Footer from "@/component/Footer";
import Story from "@/component/landing/Story";
import Navbar from "@/component/Navbar";
import BookCallDialog from "@/component/pages/BookCallDialog";
import GapFlip from "@/component/pages/GapFlip";
import { CtaBandCentred, OfficeLedger } from "@/component/pages/PartnershipSections";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "For Universities & Placement Cells",
  description:
    "Outmail extends your placement cell beyond campus drives — recruiter outreach, resume-matched openings and mentorship for every student, with cohort-level visibility for your team.",
  alternates: { canonical: "https://outmail.in/partnership" },
  openGraph: {
    title: "For Universities & Placement Cells | Outmail",
    description:
      "Help more students get placed off campus, with full visibility for your placement team.",
    url: "https://outmail.in/partnership",
    type: "website",
    images: [{ url: "/image.png", width: 1536, height: 1024, alt: "Outmail for universities" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Universities & Placement Cells | Outmail",
    description: "Help more students get placed off campus.",
    images: ["/image.png"],
  },
};

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For Universities", path: "/partnership" },
        ])}
      />
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="For universities & placement cells"
          lines={["Help more students", "get placed off campus."]}
          sub="Outmail extends your placement cell beyond campus drives — structured recruiter outreach, resume-matched openings and mentorship for every student, with full visibility for your team."
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <BookCallDialog />
            <a
              href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn border border-white/20 font-syne text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Contact us
            </a>
          </div>
        </PageHeader>

        <GapFlip />
        {/* The student-side story: what an office is actually being asked to fund. */}
        <Story />
        <OfficeLedger />
        <CtaBandCentred />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
