import { describe, it, expect, beforeEach } from "vitest";
import { pendingActivation, acknowledge, reset } from "./planActivation";

// The failure this guards against: a user pays, closes the tab before /verify
// fires, and the webhook activates them seconds later. They come back to a site
// that looks unchanged and pay a second time.

const user = (code) => (code ? { currentPlan: { code, name: code } } : {});

beforeEach(() => localStorage.clear());

describe("pendingActivation", () => {
  it("reports a plan the user has never been shown", () => {
    expect(pendingActivation(user("PLAN_A"))?.code).toBe("PLAN_A");
  });

  it("stops reporting it once acknowledged", () => {
    acknowledge(user("PLAN_A"));
    expect(pendingActivation(user("PLAN_A"))).toBeNull();
  });

  it("reports again when the user upgrades to a different plan", () => {
    acknowledge(user("PLAN_A"));
    expect(pendingActivation(user("PLAN_B"))?.code).toBe("PLAN_B");
  });

  it("reports nothing for a user with no plan", () => {
    expect(pendingActivation(user(null))).toBeNull();
    expect(pendingActivation(null)).toBeNull();
  });
});

describe("reset", () => {
  it("clears on sign-out so a shared machine does not suppress the next student's confirmation", () => {
    // Campus machines are shared constantly; without this the second buyer of
    // the same plan on the same computer would silently see nothing.
    acknowledge(user("PLAN_A"));
    reset();
    expect(pendingActivation(user("PLAN_A"))?.code).toBe("PLAN_A");
  });
});
