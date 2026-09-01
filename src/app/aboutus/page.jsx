import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import { ProblemSplit, PrinciplesManifesto, EntityLetter } from "@/component/pages/AboutSections";
import Validation from "@/component/landing/Validation";

export const metadata = {
  title: "About Us",
  description:
    "Outmail helps university students reach the right companies, get resume-matched jobs, and learn from real mentors. Learn about our mission.",
  alternates: { canonical: "https://outmail.in/aboutus" },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
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
