import { describe, it, expect } from "vitest";
import { STEPS, AFTER_SETUP, TROUBLESHOOTING } from "./gettingStarted";

// This page is customer document #3. Two emails already delivered link into it
// by URL, and one of them links to a specific anchor — so parts of this file
// are a published contract with mail we cannot edit after the fact, not just
// page content.

describe("the setup steps", () => {
  it("keeps the #connect-gmail anchor the emails link to", () => {
    // outmail-backend/src/documents/brand.js LINK.connectGmail points at
    // https://outmail.in/getting-started#connect-gmail, and the welcome and
    // setup-stalled emails both use it. Renaming this id silently downgrades
    // that link to "somewhere on a long page" for everyone who already has the
    // email in their inbox.
    expect(STEPS.map((s) => s.id)).toContain("connect-gmail");
  });

  it("has a unique, anchor-safe id for every step", () => {
    const ids = STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it("numbers the steps in order, with no gaps", () => {
    expect(STEPS.map((s) => s.n)).toEqual(["01", "02", "03", "04", "05"]);
  });

  it("gives every step the fields both the page and the HowTo schema read", () => {
    // howToSchema() reads t, d and id. A step missing one of them publishes a
    // structured-data entry with an empty name or a broken url.
    for (const s of STEPS) {
      expect(s.t, `${s.id} title`).toBeTruthy();
      expect(s.d.length, `${s.id} description`).toBeGreaterThan(40);
      expect(Array.isArray(s.points), `${s.id} points`).toBe(true);
      expect(s.points.length, `${s.id} points`).toBeGreaterThan(0);
    }
  });

  it("promises the same warm-up ramp the backend actually enforces", () => {
    // outreachPolicy.js: PAID_RAMP starts at 5 and caps at 40, and the welcome
    // email quotes those figures. The page saying anything else would be the
    // product and its own documentation disagreeing in public.
    const outreach = AFTER_SETUP.find(([label]) => label === "Outreach volume")[1];
    expect(outreach).toContain("five emails a day");
    expect(outreach).toContain("forty");
  });

  it("states that replies never reach us", () => {
    // Load-bearing: it is why there is no reply count in the weekly digest,
    // and it is the answer to the most common privacy question about outreach.
    const replies = AFTER_SETUP.find(([label]) => label === "Replies")[1];
    expect(replies).toMatch(/your own inbox/i);
  });
});

describe("troubleshooting", () => {
  it("is rendered as visible text, which FAQ markup requires", () => {
    // faqSchema() is generated from this same array. Google only credits FAQ
    // structured data whose answers a visitor can actually read, so the page
    // and the schema must never diverge — sharing the array is what guarantees
    // that, and this asserts the array is the shape the schema expects.
    for (const t of TROUBLESHOOTING) {
      expect(t.q).toBeTruthy();
      expect(t.a.length).toBeGreaterThan(30);
    }
  });

  it("ends with a route to a human", () => {
    const last = TROUBLESHOOTING.at(-1).a;
    expect(last).toContain("support@outmail.in");
    expect(last).toContain("+91 94108 54417");
  });
});
