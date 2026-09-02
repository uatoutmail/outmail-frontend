import { api } from "./api";

/**
 * Razorpay Checkout client for the customer-facing site.
 *
 * WIRED as of OUT-226. It was orphaned for a long time — the pricing CTA sent
 * visitors to /dashboard and never reached startCheckout, so no customer could
 * pay from the website at all. component/pricing.jsx now calls it per plan.
 *
 * Flow, and where each call lands on the backend:
 *   getPlans()      GET  /api/payments/plans           public
 *   validateCoupon()POST /api/payments/validate-coupon auth, preview only
 *   startCheckout() POST /api/payments/orders          auth, creates the order
 *                   -> Razorpay Checkout modal (hosted by Razorpay)
 *                   -> POST /api/payments/verify       auth, confirms signature
 * The webhook confirms the same payment server-to-server and is what makes
 * activation survive a closed tab; the browser never sees it.
 */

// Fetch active plans (public). Step 1 — renders the pricing cards.
export const getPlans = async () => {
  // quiet: the landing page renders a "couldn't load live pricing" fallback in
  // place. Blanking the whole site would hide the very content someone is
  // there to read.
  const response = await api.get("/api/payments/plans", { quiet: true });
  return response.data;
};

// Preview a coupon's price before checkout (auth). Read-only: usage is counted
// on the backend at verify time, not here, so previewing never burns a spot.
export const validateCoupon = async ({ code, planId }) => {
  const response = await api.post("/api/payments/validate-coupon", { code, planId });
  return response.data; // { valid, finalAmount, originalAmount, savings, spotsLeft, error }
};

// Create the order (auth). Step 3 — the backend creates it at Razorpay and
// mirrors it locally before the modal opens.
//
// `amount` and `currency` are NOT sent: the backend derives the price from the
// plan or coupon and rejects a body that tries to set it, because any paid
// order — at any amount — grants the paid send-cap tier. Passing them here
// would be silently ignored at best and read as tampering at worst.
const createPaymentOrder = async ({ planId, couponCode }) => {
  const response = await api.post("/api/payments/orders", { planId, couponCode });
  return response.data; // { orderId, razorpayOrderId, amount, currency, keyId }
};

// Confirm the payment from the browser (auth). Step 4a — gives the user an
// immediate answer; the webhook is the actual source of truth.
const verifyPayment = async (payload) => {
  const response = await api.post("/api/payments/verify", payload);
  return response.data;
};

// Load Razorpay's hosted Checkout script on demand, once. Kept out of the app
// bundle so visitors who never reach checkout don't pay for it.
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * The whole checkout, end to end: create order -> open Razorpay -> verify.
 *
 * Resolves with the verify response, which carries `wasAlreadyPaid` so the
 * caller can tell a first purchase from a re-verify and never imply a second
 * charge.
 *
 * Resolves with the verify response once the payment is confirmed, and rejects
 * on cancellation ("Payment cancelled"), on a Razorpay-reported failure, or if
 * verification fails — so a caller can tell "user changed their mind" from
 * "payment went wrong" and word the message accordingly.
 *
 * `prefill` is optional { name, email } to save the user retyping.
 */
export const startCheckout = async ({ planId, couponCode, prefill = {}, onModalClosed } = {}) => {
  const ok = await loadRazorpayScript();
  if (!ok) throw new Error("Failed to load Razorpay. Check your connection.");

  const order = await createPaymentOrder({ planId, couponCode });

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      // Shown in Razorpay's modal — one of the few places a customer sees the
      // brand mid-payment, so the spelling matters. It is "Outmail".
      name: "Outmail",
      description: "Outmail subscription",
      order_id: order.razorpayOrderId,
      prefill,
      theme: { color: "#6c00ff" },
      handler: async (response) => {
        // Razorpay's modal has closed and we are now waiting on our own /verify
        // call. That gap is invisible without this callback, and an unexplained
        // pause after paying is exactly when people click again.
        onModalClosed?.();
        try {
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    rzp.on("payment.failed", (resp) =>
      reject(new Error(resp?.error?.description || "Payment failed"))
    );
    rzp.open();
  });
};
