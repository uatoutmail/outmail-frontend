import Footer from "@/component/Footer";
import Validation from "@/component/landing/Validation";
import Navbar from "@/component/Navbar";
import { ProblemSplit, PrinciplesManifesto, EntityLetter } from "@/component/pages/AboutSections";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "About Us",
  description:
    "Outmail helps university students reach the right companies, get resume-matched jobs, and learn from real mentors. Learn about our mission.",
  alternates: { canonical: "https://outmail.in/aboutus" },
  openGraph: {
    title: "About Us | Outmail",
    description:
      "Outmail exists for students with no referrals and one placement season to spend. What we hold to, and who operates the company.",
    url: "https://outmail.in/aboutus",
    type: "website",
    images: [{ url: "/image.png", width: 1536, height: 1024, alt: "About Outmail" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Outmail",
    description: "Built for students with no referrals and one placement season to spend.",
    images: ["/image.png"],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/aboutus" },
        ])}
      />
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="About"
          lines={["We built the thing", "we needed at 21."]}
          sub="Outmail exists for students with no referrals and one placement season to spend. Everything below is what that means in practice."
        />
        <ProblemSplit />
        <PrinciplesManifesto />
        <EntityLetter />
        <Validation />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
