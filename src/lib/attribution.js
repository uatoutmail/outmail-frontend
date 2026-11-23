/**
 * Where a visitor came from: UTM tags, referrer and landing page.
 *
 * Captured in the browser on every page load and kept in localStorage, so it
 * survives the Google sign-in round trip (which lands back on /auth/success
 * with google.com as the referrer and no UTM tags). Two touches are kept:
 *   first - the visit that first brought them, kept for 90 days;
 *   last  - the most recent visit that carried UTM tags.
 * The backend stores first on the user at sign-up and both on each order.
 * Reporting only: never used for price or access.
 */
const KEY = "outmail.attribution";
const FIRST_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
// Our own hops, which must never overwrite the real source.
// accounts.google.com is the sign-in page; www.google.com (search) is a real source.
const INTERNAL_REFERRERS = [
  /(^|\.)outmail\.in$/,
  /^accounts\.google\.com$/,
  /(^|\.)razorpay\.com$/,
  /(^|\.)onrender\.com$/,
];

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};
const write = (value) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // private mode or storage blocked: attribution is best-effort
  }
};

function externalReferrer(referrer) {
  try {
    const host = new URL(referrer).hostname;
    return INTERNAL_REFERRERS.some((re) => re.test(host)) ? null : host;
  } catch {
    return null;
  }
}

/** Builds a touch from a URL and referrer, or null when there is nothing to record. */
export function touchFrom(href, referrer, now = Date.now()) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const touch = {};
  for (const key of UTM) {
    const value = url.searchParams.get(key);
    if (value) touch[key] = value.slice(0, 200);
  }
  const ref = externalReferrer(referrer);
  if (ref) touch.referrer = ref;
  if (!Object.keys(touch).length) return null;
  touch.landing_path = url.pathname.slice(0, 200);
  touch.captured_at = new Date(now).toISOString();
  return touch;
}

/** Records this page view's source, if it has one. Safe to call on every navigation. */
export function captureAttribution(
  href = window.location.href,
  referrer = document.referrer,
  now = Date.now()
) {
  const touch = touchFrom(href, referrer, now);
  if (!touch) return read();
  const stored = read() || {};
  const firstFresh = stored.first && now - Date.parse(stored.first.captured_at || 0) < FIRST_TTL_MS;
  const next = { first: firstFresh ? stored.first : touch, last: touch };
  write(next);
  return next;
}

/** { first, last } or null. */
export function getAttribution() {
  return read();
}

/** UTM fields flattened for an analytics event (last touch wins, then first). */
export function attributionParams() {
  const a = read();
  const touch = a?.last || a?.first;
  if (!touch) return {};
  const out = {};
  for (const key of [...UTM, "referrer"]) if (touch[key]) out[key] = touch[key];
  return out;
}
