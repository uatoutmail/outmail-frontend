export const metadata = {
  title:
    "University Placement Software | Outmail Institutional Outreach Platform",
  description:
    "Empower your students with structured recruiter outreach. Get full visibility into student off-campus hiring activity and improve university placement outcomes.",
  keywords: [
    "university placement software",
    "institutional outreach platform",
    "student recruiter outreach",
    "placement intelligence",
    "TPO software",
    "campus placement tool",
    "off-campus hiring visibility",
    "university cold outreach",
  ],
  alternates: {
    canonical: "https://outmail.in/partnership",
  },
  openGraph: {
    title: "Outmail Partnership | Better Placement Outcomes for Universities",
    description:
      "Bring structured outreach to your students and gain visibility into off-campus placement analytics.",
    url: "https://outmail.in/partnership",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail Partnership - University Placement Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail Partnership | Better Placement Outcomes for Universities",
    description:
      "Bring structured outreach to your students and gain visibility into off-campus placement analytics.",
    images: ["/image.png"],
  },
};

export default function PartnershipLayout({ children }) {
  return <>{children}</>;
}
