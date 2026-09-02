/**
 * JSON-LD, in one place.
 *
 * Structured data is the difference between a blue link and a result that
 * shows a price, a rating or an expandable FAQ. It was only on the homepage,
 * which meant the two pages most worth enriching — pricing and the FAQ — were
 * plain links.
 *
 * Everything here is a pure function of data we already display. Schema that
 * claims something the page does not show is what earns a manual penalty, so
 * nothing is invented: the FAQ entries are the ones rendered on /faq, and the
 * price is passed in from the API rather than written down here.
 */
const SITE = "https://outmail.in";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Outmail",
  legalName: "PrimeWork Labs LLP",
  url: SITE,
  logo: `${SITE}/Logo_Outmail.png`,
  description:
    "Outmail helps students reach recruiters directly, find resume-matched openings, autofill applications and get mentorship.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@outmail.in",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: "English",
  },
};

/** Breadcrumbs give a result a readable path instead of a bare URL. */
export function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}

/**
 * FAQPage. Google requires that every question and answer here is VISIBLE on
 * the page, so this is generated from the same array the page renders.
 */
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * The product and its offers.
 *
 * `plans` comes from /api/payments/plans, so the price in the search result
 * cannot drift from the price at checkout — which is exactly the failure mode
 * that produced "$0 free forever" for a paid plan (OUT-232).
 */
export function productSchema(plans) {
  const offers = (plans || [])
    .filter((p) => typeof p.amount === "number")
    .map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: (p.amount / 100).toFixed(2),
      priceCurrency: p.currency || "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE}/pricing`,
    }));

  if (offers.length === 0) return null; // never publish an empty offer list

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Outmail",
    description:
      "One payment for twelve months of recruiter outreach, resume-matched job openings, one-click application autofill and mentorship.",
    brand: { "@type": "Brand", name: "Outmail" },
    offers,
  };
}

/** Renders a schema object as the script tag Google looks for. */
export function JsonLd({ schema }) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      // Schema objects are built in this module from our own data, never from
      // user input, so there is nothing here to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
