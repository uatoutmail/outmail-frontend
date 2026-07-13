export const metadata = {
  title: "Expert Mentorship | Master Cold Outreach & Career Strategy",
  description:
    "Accelerate your career growth with personalized mentorship sessions from industry leaders. Master cold outreach, resume architecture, and professional presence.",
  keywords: [
    "career mentorship",
    "cold outreach mentorship",
    "student career coaching",
    "professional outreach guidance",
    "resume architecture",
    "job search mentorship",
    "industry mentor sessions",
    "career strategy coaching",
  ],
  alternates: {
    canonical: "https://outmail.in/mentorships",
  },
  openGraph: {
    title: "Outmail Mentorships | Expert Guidance for Your Career",
    description:
      "Book a session with industry experts and learn the art of professional outreach and networking.",
    url: "https://outmail.in/mentorships",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail Mentorships - Expert Career Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail Mentorships | Expert Guidance for Your Career",
    description:
      "Book a session with industry experts and learn the art of professional outreach and networking.",
    images: ["/image.png"],
  },
};

export default function MentorshipsLayout({ children }) {
  return <>{children}</>;
}
