"use client";
import { useEffect, useState } from "react";
import { getPlans } from "@/lib/payments";
import { JsonLd, productSchema } from "@/lib/structuredData";

/**
 * Product/Offer structured data for /pricing.
 *
 * Client-side because the price comes from /api/payments/plans, and the whole
 * point is that the number Google shows is the number we charge. A hardcoded
 * price here would recreate OUT-232 in a place nobody would think to check.
 *
 * If the fetch fails, nothing is emitted. Publishing a guessed price is worse
 * than publishing none.
 */
export default function PricingJsonLd() {
  const [plans, setPlans] = useState(null);
  useEffect(() => {
    let alive = true;
    getPlans()
      .then((d) => alive && setPlans(Array.isArray(d) ? d : null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return <JsonLd schema={productSchema(plans)} />;
}
