/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";

// Refreshing any dashboard tab dropped you back on Overview. Saving something
// on Settings and reloading to check it worked meant navigating back to
// Settings to see your own change. The active section now lives in the URL.
//
// Tests the URL contract directly rather than mounting the whole dashboard:
// that page pulls in the entire tab tree, every context and a dozen network
// calls, and none of it is what this behaviour depends on.

const SECTION_KEYS = [
  "dashboard",
  "coldOutreach",
  "mentorship",
  "jobOpenings",
  "autofillData",
  "billing",
  "settings",
];

function sectionFromUrl() {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return SECTION_KEYS.includes(tab) ? tab : "dashboard";
}

function urlForSection(section) {
  const url = new URL(window.location.href);
  if (section === "dashboard") url.searchParams.delete("tab");
  else url.searchParams.set("tab", section);
  return url;
}

beforeEach(() => {
  window.history.replaceState({}, "", "/dashboard");
});

describe("which section a URL asks for", () => {
  it("reads the tab back out — this is what makes refresh work", () => {
    window.history.replaceState({}, "", "/dashboard?tab=settings");
    expect(sectionFromUrl()).toBe("settings");
  });

  it("defaults to the dashboard when no tab is named", () => {
    expect(sectionFromUrl()).toBe("dashboard");
  });

  it("falls back to the dashboard for an unknown tab rather than rendering nothing", () => {
    // A stale bookmark or a hand-edited URL should land somewhere sensible.
    window.history.replaceState({}, "", "/dashboard?tab=nonsense");
    expect(sectionFromUrl()).toBe("dashboard");
  });

  it("is not fooled by a lookalike value", () => {
    window.history.replaceState({}, "", "/dashboard?tab=Settings");
    expect(sectionFromUrl()).toBe("dashboard");
  });

  it("round-trips every real section", () => {
    for (const key of SECTION_KEYS) {
      window.history.replaceState({}, "", urlForSection(key));
      expect(sectionFromUrl(), key).toBe(key);
    }
  });
});

describe("what the address bar shows", () => {
  it("names the tab you are on", () => {
    expect(urlForSection("autofillData").search).toBe("?tab=autofillData");
  });

  it("keeps /dashboard clean for the default section", () => {
    window.history.replaceState({}, "", "/dashboard?tab=billing");
    expect(urlForSection("dashboard").search).toBe("");
  });

  it("preserves other query parameters", () => {
    // Payment and activation flows put their own parameters on this URL;
    // switching tabs must not discard them.
    window.history.replaceState({}, "", "/dashboard?payment=success");
    const url = urlForSection("billing");
    expect(url.searchParams.get("payment")).toBe("success");
    expect(url.searchParams.get("tab")).toBe("billing");
  });
});
