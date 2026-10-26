import DownloadCard from "@/component/download/DownloadCard";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import PageHeader from "@/component/ui/PageHeader";
import { JsonLd, breadcrumbSchema } from "@/lib/structuredData";

export const metadata = {
  title: "Download the Desktop App | Outmail",
  description:
    "Download the Outmail desktop app — sends your personalized cold outreach from your own Gmail account, on your own machine.",
  alternates: {
    canonical: "https://outmail.in/download",
  },
  openGraph: {
    title: "Download the Desktop App | Outmail",
    description:
      "Download the Outmail desktop app — sends your personalized cold outreach from your own Gmail account, on your own machine.",
    url: "https://outmail.in/download",
    type: "website",
  },
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Download", path: "/download" },
        ])}
      />
      <main>
        <PageHeader
          kicker="Desktop app"
          lines={["Your outreach, sent from", "your own inbox."]}
          sub="A small always-on app that sends this week's plan from your own Gmail account, on your own machine — nothing routes through Outmail's servers."
        >
          <DownloadCard />
        </PageHeader>
      </main>
      <Footer variant="dark" />
    </div>
  );
}
