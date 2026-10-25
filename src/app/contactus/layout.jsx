export const metadata = {
  title: "Contact Outmail | Get in Touch with Our Team",
  description:
    "Have questions about job openings, outreach, or autofill? Contact Outmail to learn how we can help with your placement year.",
  keywords: [
    "contact outmail",
    "cold outreach support",
    "outmail help",
    "recruiter outreach questions",
    "outmail customer support",
    "outreach platform contact",
    "student outreach assistance",
    "job search support",
    "autofill support",
  ],
  alternates: {
    canonical: "https://outmail.in/contactus",
  },
  openGraph: {
    title: "Contact Us | Outmail",
    description: "Get in touch for support, partnerships, or more information about Outmail.",
    url: "https://outmail.in/contactus",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Contact Outmail - Get in Touch with Our Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Outmail",
    description: "Get in touch for support, partnerships, or more information about Outmail.",
    images: ["/image.png"],
  },
};

export default function ContactUsLayout({ children }) {
  return <>{children}</>;
}
