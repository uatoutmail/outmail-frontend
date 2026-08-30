/**
 * Remembers which plan someone chose before they were sent to Google sign-in.
 *
 * THE PROBLEM THIS SOLVES
 *   Clicking a plan while logged out used to redirect to OAuth and land the
 *   user on /dashboard. The plan they picked was simply discarded, and they had
 *   to find pricing again and remember which card they wanted. That is the
 *   highest-intent moment in the whole funnel — someone who has decided to pay —
 *   and we dropped it (OUT-227).
 *
 * WHY sessionStorage AND NOT a `state` PARAMETER
 *   A state round-trip through the backend callback would be more robust, but it
 *   means changing the OAuth handler, and Google sign-in returns to the SAME tab
 *   in the overwhelmingly common case, where sessionStorage survives. The
 *   fallback when it does not survive is landing on /pricing with nothing
 *   auto-opening — mildly annoying, never wrong. A silent auto-charge would be
 *   the unacceptable failure, and that cannot happen: Razorpay always shows its
 *   own confirmation before taking money.
 */

const KEY = 'outmail.checkoutIntent';

// Intent older than this is ignored. Opening a payment modal because of a
// choice someone made an hour ago is startling, not helpful.
const MAX_AGE_MS = 30 * 60 * 1000;

/** Remember a plan choice before redirecting to sign-in. */
export function rememberIntent(planId, planCode) {
  if (typeof window === 'undefined' || !planId) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ planId, planCode, at: Date.now() }));
  } catch {
    // Private browsing or a full quota. Losing the intent is acceptable.
  }
}

/**
 * Read and CLEAR the stored intent — single-use by design. If reading it left it
 * in place, every later visit to /pricing would reopen checkout.
 */
export function takeIntent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw);
    if (!intent?.planId || Date.now() - intent.at > MAX_AGE_MS) return null;
    return intent;
  } catch {
    return null;
  }
}

export function clearIntent() {
  if (typeof window === 'undefined') return;
  try { sessionStorage.removeItem(KEY); } catch { /* nothing to do */ }
}
