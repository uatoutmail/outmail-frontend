/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  describeFailure,
  installedVersion,
  isExtensionInstalled,
  pairExtension,
  pingExtension,
} from "./extensionBridge";

// This is the page's half of the handshake with the extension. The behaviour
// that matters is what happens when there is NO extension — which is most
// browsers, most of the time — because a page that hangs waiting for a reply
// that will never come is worse than one that never offered the feature.

/**
 * Stands in for the extension's content script.
 *
 * Replies are dispatched as a constructed MessageEvent rather than sent with
 * postMessage, because jsdom leaves `event.origin` empty on a same-window
 * postMessage. The real browser sets it, and this module checks it, so the
 * check has to be given a real value to test against — otherwise the test
 * would only pass by weakening the product.
 */
function fakeExtension({ replyTo = () => ({ ok: true }), delay = 0, origin } = {}) {
  const from = origin || window.location.origin;
  const handler = (event) => {
    const d = event.data;
    if (!d || d.source !== "outmail-web" || d.channel !== "outmail-pair") return;
    const reply = replyTo(d);
    if (!reply) return; // silence, like an extension that is not there
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { source: "outmail-extension", channel: "outmail-pair", id: d.id, ...reply },
          origin: from,
          source: window,
        })
      );
    }, delay);
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

let detach = null;

beforeEach(() => {
  document.documentElement.removeAttribute("data-outmail-extension");
});

afterEach(() => {
  if (detach) detach();
  detach = null;
  vi.useRealTimers();
});

describe("detecting the extension", () => {
  it("reads the marker the content script writes at document_start", () => {
    expect(isExtensionInstalled()).toBe(false);
    document.documentElement.setAttribute("data-outmail-extension", "2.1.0");
    expect(isExtensionInstalled()).toBe(true);
    expect(installedVersion()).toBe("2.1.0");
  });
});

describe("ping", () => {
  it("reports installed and linked when the extension answers", async () => {
    detach = fakeExtension({
      replyTo: () => ({ ok: true, installed: true, version: "2.1.0", linked: true }),
    });
    expect(await pingExtension()).toEqual({
      installed: true,
      linked: true,
      version: "2.1.0",
      reason: null,
    });
  });

  it("gives up rather than hanging when nothing is listening", async () => {
    // The common case: a browser with no extension. Nothing replies, and the
    // page must still be able to render a sensible state.
    vi.useFakeTimers();
    const promise = pingExtension();
    await vi.advanceTimersByTimeAsync(3000);
    expect(await promise).toMatchObject({ installed: false, reason: "not_installed" });
  });
});

describe("pairing", () => {
  it("sends the code and returns the extension's verdict", async () => {
    const seen = [];
    detach = fakeExtension({
      replyTo: (d) => {
        seen.push(d);
        return { ok: true, email: "ananya@example.com" };
      },
    });

    const r = await pairExtension("ABC123");

    expect(seen[0]).toMatchObject({ action: "pair", code: "ABC123" });
    expect(r).toMatchObject({ ok: true, email: "ananya@example.com" });
  });

  it("passes a refusal straight through", async () => {
    detach = fakeExtension({ replyTo: () => ({ ok: false, reason: "reload_required" }) });
    expect(await pairExtension("ABC123")).toMatchObject({ ok: false, reason: "reload_required" });
  });

  it("ignores a reply carrying somebody else's request id", async () => {
    // Two connect attempts in flight must not resolve each other.
    vi.useFakeTimers();
    detach = fakeExtension({ replyTo: () => ({ ok: true, id: "ignored" }) });
    const impostor = (e) => {
      if (e.data?.source !== "outmail-web") return;
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            source: "outmail-extension",
            channel: "outmail-pair",
            id: "someone-else",
            ok: true,
          },
          origin: window.location.origin,
          source: window,
        })
      );
    };
    window.addEventListener("message", impostor);
    const detachImpostor = () => window.removeEventListener("message", impostor);

    const promise = pairExtension("ABC123");
    await vi.advanceTimersByTimeAsync(3000);
    detachImpostor();
    expect(await promise).toMatchObject({ ok: false, reason: "not_installed" });
  });

  it("refuses a reply that claims to come from another origin", async () => {
    vi.useFakeTimers();
    detach = fakeExtension({ origin: "https://evil.example.com" });
    const promise = pairExtension("ABC123");
    await vi.advanceTimersByTimeAsync(3000);
    expect(await promise).toMatchObject({ ok: false, reason: "not_installed" });
  });
});

describe("explaining a failure", () => {
  it("gives each reason its own actionable sentence", () => {
    // Every one of these is a different problem with a different fix.
    // Collapsing them into "something went wrong" is how someone ends up
    // reinstalling an extension that was working fine.
    const messages = [
      describeFailure("not_installed"),
      describeFailure("reload_required"),
      describeFailure("extension_unreachable"),
    ];
    expect(new Set(messages).size).toBe(3);
    expect(messages.every((m) => m.length > 20)).toBe(true);
    expect(describeFailure("reload_required")).toMatch(/reload/i);
  });

  it("falls back to whatever the backend said rather than swallowing it", () => {
    expect(describeFailure("Invalid or expired code")).toBe("Invalid or expired code");
  });
});
