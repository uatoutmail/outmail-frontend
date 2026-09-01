import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import AboutUs from "@/component/aboutuscontent";
import PageHeader from "@/component/ui/PageHeader";

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
        <AboutUs />
      </main>
      <Footer variant="dark" />
    </div>
  );
}
