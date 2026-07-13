import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import AboutUs from "@/component/aboutuscontent";

export const metadata = {
  title: "About Us",
  description:
    "Outmail helps university students reach the right companies, get résumé-matched jobs, and learn from real mentors. Learn about our mission.",
  alternates: { canonical: "https://outmail.in/aboutus" },
};

export default function Page() {
  return (
    <main className="bg-[#0a0b14] min-h-screen">
      <Navbar />
      <AboutUs />
      <Footer />
    </main>
  );
}
