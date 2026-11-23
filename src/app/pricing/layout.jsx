// Search and share text for /pricing.
//
// Every price here comes from /api/payments/plans, the same source the page
// itself renders from: the founding ₹999 must become ₹1,499 after the first
// 1,000 students, and copy that hardcodes a number is how this page once
// advertised "$0 free forever" (OUT-232). If the plans can't be fetched, the
// text says what Outmail is without quoting a price rather than guessing one.

// The root layout's title template appends " | Outmail" to the page title;
// share cards don't use the template, so they carry the brand themselves.
const TITLE = "Pricing: one payment for your placement year";
const SHARE_TITLE = "Outmail pricing: one payment for your placement year";
const CANONICAL = "https://outmail.in/pricing";
const IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Outmail: your off-campus job hunt, in one place",
};
const FALLBACK =
  "One payment for your whole placement year: off-campus jobs matched to your resume, personal emails to recruiters sent from your own Gmail, and one-click application autofill. No subscription. Full refund within 7 days.";

const rupees = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export function describePrice(plans) {
  const plan = Array.isArray(plans) ? plans.find((p) => p?.code === "PLAN_A") : null;
  if (!plan || !Number.isInteger(plan.amount) || plan.amount <= 0) return FALLBACK;
  const founding =
    Number.isInteger(plan.list_amount) && plan.list_amount > plan.amount
      ? ` (founding price for the first ${Number(plan.launchPlacesTotal || 1000).toLocaleString("en-IN")} students, then ${rupees(plan.list_amount)})`
      : "";
  return `${rupees(plan.amount)} for 12 months${founding}: off-campus jobs matched to your resume, personal emails to recruiters sent from your own Gmail, and one-click application autofill. No subscription. Full refund within 7 days.`;
}

export async function generateMetadata() {
  let description = FALLBACK;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/plans`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) description = describePrice(await res.json());
  } catch {
    // keep the price-free fallback
  }
  return {
    title: TITLE,
    description,
    keywords: [
      "outmail pricing",
      "off campus jobs for freshers",
      "cold email to recruiters",
      "job application autofill",
      "placement preparation tool",
      "jobs for final year students india",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: SHARE_TITLE,
      description,
      url: CANONICAL,
      type: "website",
      images: [IMAGE],
    },
    twitter: { card: "summary_large_image", title: SHARE_TITLE, description, images: [IMAGE.url] },
  };
}

export default function PricingLayout({ children }) {
  return <>{children}</>;
}
