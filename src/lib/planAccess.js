/**
 * What each plan unlocks, defined once.
 *
 * The plan ladder used to be inline conditionals in dashboard/page.jsx, which
 * is how it drifted: mentorship was gated on PLAN_C and jobs on PLAN_B/PLAN_C,
 * neither of which matches what we now sell. PLAN_C is retired entirely.
 *
 * IMPORTANT — this file hides features, it does not protect them. The real
 * enforcement is server-side (`requirePlan` / `requireSubscription`); before
 * OUT-225 the backend could not tell PLAN_A from PLAN_B at all, so a ₹999
 * customer calling the mentorship API directly was served. Keep the two in
 * step, and never treat this as the gate.
 *
 * Current ladder:
 *   PLAN_A  Outreach & Jobs               ₹999/year
 *   PLAN_B  Outreach, Jobs & Mentorship   ₹4,999/year, 25 seats
 */

export const FEATURE_PLANS = {
  coldOutreach: ['PLAN_A', 'PLAN_B'],
  jobOpenings: ['PLAN_A', 'PLAN_B'],
  autofill: ['PLAN_A', 'PLAN_B'],
  mentorship: ['PLAN_B'],
};

/** Which plan a locked feature should send the user to buy. */
export const UPGRADE_TARGET = {
  coldOutreach: 'PLAN_A',
  jobOpenings: 'PLAN_A',
  autofill: 'PLAN_A',
  mentorship: 'PLAN_B',
};

/** Whether the user's live plan includes a feature. */
export function hasFeature(user, feature) {
  const code = user?.currentPlan?.code;
  if (!code) return false;
  return (FEATURE_PLANS[feature] || []).includes(code);
}

/**
 * Why a feature is locked — the two cases need different words.
 *
 *   'none'    never paid, or the placement year lapsed  -> "Get Outmail"
 *   'upgrade' paying customer on a lower tier           -> "Upgrade"
 *
 * Telling a paying customer to "subscribe" reads as a bug and erodes trust in
 * a product they have already paid for.
 */
export function lockReason(user, feature) {
  if (hasFeature(user, feature)) return null;
  return user?.currentPlan?.code ? 'upgrade' : 'none';
}

/** Days until the placement year ends; null if unknown, negative if lapsed. */
export function daysUntilExpiry(user) {
  if (!user?.accessExpiresAt) return null;
  return Math.ceil((new Date(user.accessExpiresAt) - Date.now()) / 86400000);
}
