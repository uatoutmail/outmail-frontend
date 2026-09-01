import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import SmoothScrollWrapper from "@/component/SmoothScrollWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceStatusProvider } from "@/context/ServiceStatusContext";
import { Toaster } from "sonner";


// Font CSS variables are consumed by the design tokens in globals.css:
//   --font-syne-var  -> --font-sans / font-syne (app default)
// Bricolage Grotesque, Space Grotesk and Satisfy were removed on 2026-09-01:
// the redesign put every heading, nav label and the wordmark on Syne, so all
// three families were downloaded on every page load and used by nothing.
//   --font-geist-var -> font-geist
//   --font-geist-mono-var -> font-mono
const geistSans = Geist({
  variable: "--font-geist-var",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono-var",
  subsets: ["latin"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne-var",
});

export const metadata = {
  metadataBase: new URL("https://outmail.in"),
  title: {
    default: "Outmail | Personalized Cold Outreach & Recruiter Search at Scale",
    template: "%s | Outmail",
  },
  description:
    "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using professional cold outreach.",
  keywords: [
    "cold outreach",
    "personalized recruiter emails",
    "student job search",
    "recruiter outreach tool",
    "career growth automation",
    "university placement software",
    "cold email platform",
    "outmail",
  ],
  authors: [{ name: "Outmail", url: "https://outmail.in" }],
  creator: "Outmail",
  publisher: "Outmail",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon-32.png",
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Outmail | Personalized Cold Outreach at Scale",
    description:
      "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using professional cold outreach.",
    url: "https://outmail.in",
    siteName: "Outmail",
    images: [
      {
        url: "/image.png",
        width: 1536,
        height: 1024,
        alt: "Outmail - Personalized Cold Outreach at Scale",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Outmail | Personalized Cold Outreach & Recruiter Search at Scale",
    description:
      "Automate your career growth with Outmail. Send personalized recruiter emails, track opens, and get noticed by top companies using professional cold outreach.",
    images: ["/image.png"],
    creator: "@outmail_in",
    site: "@outmail_in",
  },
  alternates: {
    canonical: "https://outmail.in",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon-32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="shortcut icon" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Fonts are self-hosted via next/font (Syne, Geist) — no external font CSS needed. */}
        {/* Google Analytics */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* eslint-disable-next-line @next/next/next-script-for-ga -- migrating to
                @next/third-parties/google is a real improvement but a new dependency;
                out of scope for a lint-only pass, tracked separately */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-EEWX3GK1NK"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EEWX3GK1NK');
            `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        <ServiceStatusProvider>
          <AuthProvider>
            <SmoothScrollWrapper>
              <Toaster position="top-center" richColors />
              <div>{children}</div>
            </SmoothScrollWrapper>
          </AuthProvider>
        </ServiceStatusProvider>
      </body>
    </html>
  );
}
