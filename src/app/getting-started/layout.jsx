export const metadata = {
  title: "Getting started",
  description:
    "Set Outmail up in about ten minutes: upload your resume, connect Gmail with a Google app password, install the desktop app, and set what you are looking for.",
  alternates: { canonical: "https://outmail.in/getting-started" },
  openGraph: {
    title: "Getting started | Outmail",
    description:
      "Five steps, about ten minutes — including why Gmail needs an app password and where that password is stored.",
    url: "https://outmail.in/getting-started",
    siteName: "Outmail",
    type: "article",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Setting up Outmail",
      },
    ],
  },
};

export default function GettingStartedLayout({ children }) {
  return children;
}
