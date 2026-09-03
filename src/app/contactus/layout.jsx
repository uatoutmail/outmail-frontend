export const metadata = {
  title: "Contact Outmail | Get in Touch with Our Outreach Experts",
  description:
    "Have questions about cold outreach? Contact Outmail to learn how we can help your career or organization scale personalized recruiter engagement.",
  keywords: [
    "contact outmail",
    "cold outreach support",
    "outmail help",
    "recruiter outreach questions",
    "outmail customer support",
    "outreach platform contact",
    "student outreach assistance",
  ],
  alternates: {
    canonical: "https://outmail.in/contactus",
  },
  openGraph: {
    title: "Contact Us | Personalized Cold Outreach Support",
    description: "Get in touch for support, partnerships, or more information about Outmail.",
    url: "https://outmail.in/contactus",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Contact Outmail - Get in Touch with Our Outreach Experts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Personalized Cold Outreach Support",
    description: "Get in touch for support, partnerships, or more information about Outmail.",
    images: ["/image.png"],
  },
};

export default function ContactUsLayout({ children }) {
  return <>{children}</>;
}
