import { attributionParams } from "@/lib/attribution";

/**
 * GA4 events. A no-op wherever gtag isn't loaded (development, ad blockers):
 * tracking must never break a sign-up or a payment.
 *
 * Every event carries the visitor's UTM tags as parameters, because the GA4
 * session itself is restarted by the Google sign-in and Razorpay hops.
 */
export function track(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, { ...attributionParams(), ...params });
    }
  } catch {
    // never let analytics throw into product code
  }
}

const rupees = (paise) => (Number.isFinite(paise) ? paise / 100 : undefined);

/** GA4 ecommerce payload for the plan being bought. */
export function checkoutParams({ plan, amount, coupon, transactionId }) {
  return {
    currency: plan?.currency || "INR",
    value: rupees(amount ?? plan?.amount),
    ...(coupon ? { coupon } : {}),
    ...(transactionId ? { transaction_id: transactionId } : {}),
    items: plan
      ? [
          {
            item_id: plan.code,
            item_name: plan.name,
            price: rupees(amount ?? plan.amount),
            quantity: 1,
          },
        ]
      : [],
  };
}
