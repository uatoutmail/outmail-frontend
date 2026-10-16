// Talking to the Outmail Autofill extension from a page on outmail.in.
//
// WHY THIS EXISTS
//   Connecting the extension used to mean generating a code, selecting it,
//   copying it, opening the popup and pasting it. Six steps and a manual
//   transfer at the moment a new user has the least patience. The extension
//   ships a content script on our domain; this is the page's half of that
//   conversation, so connecting becomes one click — or none, on the page that
//   opens by itself the moment the extension is installed.
//
// WHAT CROSSES THE BOUNDARY
//   One direction only. We hand the extension a short-lived, single-use link
//   code; it exchanges that with our API itself and keeps the token. A token
//   never comes back to this page, which is the whole reason the handshake
//   goes through a code at all.

const CHANNEL = "outmail-pair";
const FROM_PAGE = "outmail-web";
const FROM_EXTENSION = "outmail-extension";

/** Hard ceiling on how long we wait for an extension that may not be there. */
const REPLY_TIMEOUT_MS = 2500;

let counter = 0;

/**
 * Is the extension present?
 *
 * Reads the attribute the content script writes at document_start, before any
 * of our own code runs — so this is synchronous and cannot race. It is a hint,
 * not proof: nothing is granted on the strength of it, and pairing still goes
 * through the message handshake below.
 */
export function isExtensionInstalled() {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute("data-outmail-extension");
}

export function installedVersion() {
  if (typeof document === "undefined") return null;
  return document.documentElement.getAttribute("data-outmail-extension");
}

/**
 * One request, one reply, with a timeout.
 *
 * The timeout is the normal case, not the exception: on a browser with no
 * extension installed nothing is listening, and "no reply" is the answer.
 */
function request(action, payload = {}) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve({ ok: false, reason: "no_window" });

    const id = `outmail-${Date.now()}-${++counter}`;
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
      resolve(result);
    };

    const onMessage = (event) => {
      if (event.source !== window) return;
      if (event.origin !== window.location.origin) return;
      const d = event.data;
      if (!d || d.source !== FROM_EXTENSION || d.channel !== CHANNEL || d.id !== id) return;
      finish(d);
    };

    const timer = setTimeout(
      () => finish({ ok: false, reason: "not_installed" }),
      REPLY_TIMEOUT_MS
    );
    window.addEventListener("message", onMessage);
    window.postMessage(
      { source: FROM_PAGE, channel: CHANNEL, id, action, ...payload },
      window.location.origin
    );
  });
}

/**
 * Asks the extension whether it is there and whether it is already linked.
 * Deliberately does not learn WHICH account it is linked to — on a shared
 * laptop that is not this page's business, and it is not needed to decide
 * whether to offer a Connect button.
 */
export async function pingExtension() {
  const r = await request("ping");
  return {
    installed: !!r.ok && !!r.installed,
    linked: !!r.linked,
    version: r.version || null,
    reason: r.ok ? null : r.reason || "not_installed",
  };
}

/**
 * What the extension does with data, shown before connecting and agreed to
 * with one click (Chrome Web Store "prominent disclosure and consent"). The
 * extension popup shows the same four points, word for word, for anyone who
 * connects with a code instead. Change both together.
 */
export const EXTENSION_DATA_DISCLOSURE = [
  "Downloads your saved profile and resume from your Outmail account",
  "Reads the form on the page you asked it to fill, and only that page",
  "Sends the wording of questions it does not recognise to Outmail to find your saved answer. Outmail uses Google Gemini for this. Your answers are not sent to Gemini",
  "Saves answers you type into those questions to your Outmail account, so they fill next time",
];

/**
 * Hands a link code to the extension. The token stays on its side.
 *
 * `consent` must be true: the extension refuses to link unless the user has
 * just agreed to EXTENSION_DATA_DISCLOSURE. Only pass it from the click on the
 * "Agree and connect" button, never automatically.
 */
export async function pairExtension(code, { consent = false } = {}) {
  return request("pair", { code, consent: consent === true });
}

/**
 * Turns a failure into something a person can act on.
 *
 * Every one of these is a real state with a different fix, and collapsing them
 * into "something went wrong" is how a user ends up reinstalling an extension
 * that was working fine.
 */
export function describeFailure(reason) {
  switch (reason) {
    case "not_installed":
      return "We can't see the Outmail extension in this browser. Install it, then come back to this page.";
    case "reload_required":
      return "The extension updated while this tab was open. Reload this page and try again.";
    case "extension_unreachable":
      return "The extension is installed but isn't responding. Reload this page, or restart your browser.";
    case "missing_code":
      return "Something went wrong generating your connect code. Try again.";
    case "consent_required":
      return "The extension needs your agreement before it connects. Click Agree and connect.";
    default:
      return reason || "Connecting failed. Try again, and tell us if it keeps happening.";
  }
}
