/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.unsplash.com https://lh3.googleusercontent.com https://res.cloudinary.com https://outmail.in.s3.ap-south-1.amazonaws.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || ""} https://www.google-analytics.com https://api.razorpay.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io;
    frame-src 'self' https://api.razorpay.com https://www.youtube.com https://*.youtube.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

/**
 * Hardening headers.
 *
 * CSP was the ONLY header set before this. Each of the rest closes a specific
 * gap rather than being ceremony:
 *
 *  Referrer-Policy      The OAuth handoff puts a token in a URL (briefly — the
 *                       client strips it immediately). The browser default
 *                       still sends full URLs to third parties, so this stops
 *                       one leaking to analytics or an outbound job link.
 *  X-Content-Type-Options  Stops a browser sniffing a user-uploaded file into
 *                       something executable.
 *  Permissions-Policy   We use none of these APIs; denying them means an
 *                       injected script cannot either.
 *  Strict-Transport-Security  Removes the first-request downgrade window.
 *                       Vercel sets this too; being explicit costs nothing.
 *
 * `unsafe-eval` was also removed from script-src. Next's production bundles do
 * not need it — it was inherited from a dev-mode-shaped policy, and leaving it
 * on weakens the one control that would blunt an injected script.
 * `unsafe-inline` stays for now: Next's bootstrap and the GA snippet are
 * inline, and removing it needs nonce plumbing through the layout.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "outmail.in.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
