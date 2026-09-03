/**
 * Notices when a plan became active without the user ever seeing a confirmation.
 *
 * THE CASE THIS EXISTS FOR
 *   /verify is the browser's confirmation; the webhook is the source of truth.
 *   A user can pay, close the tab before /verify fires, and be activated by the
 *   webhook seconds later — having seen nothing. They return to a site that
 *   looks exactly as it did before they paid, and a reasonable person pays
 *   again (OUT-228).
 *
 * HOW IT WORKS
 *   We remember the last plan code we have acknowledged to this user. When the
 *   dashboard loads and their live plan differs from that, the activation was
 *   never shown, so we show it now.
 *
 * localStorage, not sessionStorage: the whole point is that the tab which made
 * the payment is gone.
 */

const KEY = "outmail.acknowledgedPlan";

/** The plan we should confirm to the user right now, or null. */
export function pendingActivation(user) {
  if (typeof window === "undefined") return null;
  const code = user?.currentPlan?.code;
  if (!code) return null;
  try {
    return localStorage.getItem(KEY) === code ? null : user.currentPlan;
  } catch {
    return null;
  }
}

/** Record that the user has now seen their plan confirmed. */
export function acknowledge(user) {
  if (typeof window === "undefined") return;
  const code = user?.currentPlan?.code;
  if (!code) return;
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* nothing to do */
  }
}

/**
 * Clear on sign-out. Without this, a shared or lab machine would suppress the
 * confirmation for the NEXT student who buys the same plan on it — and campus
 * machines are shared constantly.
 */
export function reset() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}
