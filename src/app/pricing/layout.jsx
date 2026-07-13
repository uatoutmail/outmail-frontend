export const metadata = {
  title: "Flexible Cold Outreach Pricing | Outmail Subscription Plans",
  description:
    "Discover outmail pricing tiers built for organisations. Scale your outreach with flexible plans tailored to your department's specific cold outreach goals.",
  keywords: [
    "cold outreach pricing",
    "outmail subscription plans",
    "outreach platform pricing",
    "university outreach plans",
    "recruiter email tool pricing",
    "student outreach software cost",
    "cold email platform plans",
  ],
  alternates: {
    canonical: "https://outmail.in/pricing",
  },
  openGraph: {
    title: "Outmail Pricing | Flexible Plans for Your Organisation",
    description:
      "Scale your outreach with plans tailored to your specific goals. Book a call to find your perfect fit.",
    url: "https://outmail.in/pricing",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail Pricing - Flexible Plans for Your Organisation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail Pricing | Flexible Plans for Your Organisation",
    description:
      "Scale your outreach with plans tailored to your specific goals. Book a call to find your perfect fit.",
    images: ["/image.png"],
  },
};

export default function PricingLayout({ children }) {
  return <>{children}</>;
}
