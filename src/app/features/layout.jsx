export const metadata = {
  title: "Features",
  description:
    "Explore Outmail's features: AI-personalized cold outreach from your own inbox, résumé-matched job intelligence with an explainable Outmail Score, one-click Autofill, and mentorship.",
  alternates: { canonical: "https://outmail.in/features" },
  openGraph: {
    title: "Features | Outmail",
    description:
      "AI-personalized cold outreach, résumé-matched jobs, one-click Autofill, and mentorship — all in one place.",
    url: "https://outmail.in/features",
    siteName: "Outmail",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail features",
      },
    ],
  },
};

export default function FeaturesLayout({ children }) {
  return children;
}
