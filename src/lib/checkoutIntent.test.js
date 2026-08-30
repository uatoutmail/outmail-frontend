import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rememberIntent, takeIntent, clearIntent } from "./checkoutIntent";

// Clicking a plan while logged out used to redirect to Google and land the user
// on /dashboard, discarding the choice entirely — at the single highest-intent
// moment in the funnel (OUT-227).

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.useRealTimers());

describe("rememberIntent / takeIntent", () => {
  it("carries a plan choice across sign-in", () => {
    rememberIntent("p1", "PLAN_A");
    expect(takeIntent()).toMatchObject({ planId: "p1", planCode: "PLAN_A" });
  });

  it("is SINGLE USE — reading it clears it", () => {
    // Otherwise every later visit to /pricing would reopen Razorpay.
    rememberIntent("p1", "PLAN_A");
    takeIntent();
    expect(takeIntent()).toBeNull();
  });

  it("ignores intent older than 30 minutes", () => {
    // Opening a payment modal because of a choice made an hour ago is
    // startling, not helpful.
    rememberIntent("p1", "PLAN_A");
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 31 * 60 * 1000);
    expect(takeIntent()).toBeNull();
  });

  it("keeps intent that is still fresh", () => {
    rememberIntent("p1", "PLAN_A");
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 5 * 60 * 1000);
    expect(takeIntent()).not.toBeNull();
  });

  it("returns null when nothing was stored", () => {
    expect(takeIntent()).toBeNull();
  });

  it("survives corrupted storage rather than throwing on a page load", () => {
    sessionStorage.setItem("outmail.checkoutIntent", "not json");
    expect(() => takeIntent()).not.toThrow();
    expect(takeIntent()).toBeNull();
  });

  it("ignores a stored entry with no planId", () => {
    sessionStorage.setItem("outmail.checkoutIntent", JSON.stringify({ at: Date.now() }));
    expect(takeIntent()).toBeNull();
  });

  it("stores nothing when there is no plan to remember", () => {
    rememberIntent(null, null);
    expect(takeIntent()).toBeNull();
  });

  it("clearIntent discards a pending choice", () => {
    rememberIntent("p1", "PLAN_A");
    clearIntent();
    expect(takeIntent()).toBeNull();
  });
});
