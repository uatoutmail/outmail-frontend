/**
 * Turns whatever happened during checkout into words a customer should read.
 *
 * Someone has just tried to give us money. What they see next decides whether
 * they trust the product, so each outcome gets its own wording rather than a
 * generic error:
 *
 *   cancelled  they changed their mind — NOT an error, and must not look like one
 *   failed     Razorpay declined — plain retry, no blame
 *   already    a re-verify of a paid order — never imply a second charge
 *   error      something went wrong on our side
 *
 * Standing rule, deliberately enforced here: users must never see backend
 * internals. Everything below is a fixed string. The raw error is logged for us
 * and never rendered.
 */

export const OUTCOME = {
  SUCCESS: 'success',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  ALREADY: 'already',
  SOLD_OUT: 'sold_out',
  ERROR: 'error',
};

/** Classify a thrown error or a verify response into one of the outcomes. */
export function classify(err) {
  const msg = String(err?.message || '');
  if (/cancel/i.test(msg)) return OUTCOME.CANCELLED;

  const status = err?.response?.status;
  const code = err?.response?.data?.code;
  if (code === 'PLAN_SOLD_OUT' || status === 409) return OUTCOME.SOLD_OUT;
  if (status === 400) return OUTCOME.FAILED;

  // A payment.failed event surfaced by Razorpay's own handler.
  if (/payment failed|declin|insufficient/i.test(msg)) return OUTCOME.FAILED;
  return OUTCOME.ERROR;
}

export function message(outcome) {
  switch (outcome) {
    case OUTCOME.SUCCESS:
      return { tone: 'success', title: "You're in.", body: 'Your placement year has started. Everything is unlocked.' };
    case OUTCOME.CANCELLED:
      // Deliberately neutral. Changing your mind is not a failure, and colouring
      // it red teaches people that leaving a payment screen is dangerous.
      return { tone: 'neutral', title: 'Payment cancelled', body: 'Nothing has been charged. You can pick a plan whenever you are ready.' };
    case OUTCOME.FAILED:
      return { tone: 'error', title: 'That payment did not go through', body: 'No money has been taken. You can try again, or use a different method.' };
    case OUTCOME.ALREADY:
      // Shown only for a genuinely OLD payment — someone returning to a plan
      // they already hold. A first purchase whose webhook simply landed first
      // gets SUCCESS, because telling a new customer they already own it reads
      // as a double charge.
      return { tone: 'success', title: 'You already have this plan', body: 'Your existing plan is still active — you have not been charged again.' };
    case OUTCOME.SOLD_OUT:
      return { tone: 'error', title: 'That plan is full', body: 'All seats are taken right now. The other plan is still available.' };
    default:
      return { tone: 'error', title: 'Something went wrong', body: "We could not complete the payment. If money has left your account it will be returned automatically, and you can contact support@outmail.in." };
  }
}

/** Rupee formatting from paise, the unit the API speaks. */
export function formatPaise(paise, currency = 'INR') {
  if (paise == null) return null;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(paise / 100);
}
