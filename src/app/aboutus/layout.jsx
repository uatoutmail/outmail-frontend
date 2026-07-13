export const metadata = {
  title: "About Outmail | Direct Line to Hiring Manager Decisions for Students",
  description:
    "Outmail was built to bridge the gap between effort and visibility. Give your career the unfair advantage by reaching recruiters directly with personalized campaigns.",
  keywords: [
    "student recruiter outreach",
    "outmail about",
    "career visibility platform",
    "personalized outreach for students",
    "hiring manager outreach",
    "early career professional tool",
    "job search automation",
  ],
  alternates: {
    canonical: "https://outmail.in/aboutus",
  },
  openGraph: {
    title: "About Outmail | The Unfair Advantage You Deserve",
    description:
      "Built to give every student and early-career professional a direct line to hiring managers.",
    url: "https://outmail.in/aboutus",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "About Outmail - Direct Line to Hiring Managers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Outmail | The Unfair Advantage You Deserve",
    description:
      "Built to give every student and early-career professional a direct line to hiring managers.",
    images: ["/image.png"],
  },
};

export default function AboutUsLayout({ children }) {
  return <>{children}</>;
}
