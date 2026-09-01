import { describe, it, expect } from "vitest";
import { hasFeature, lockReason, daysUntilExpiry, hasLapsed, FEATURE_PLANS, UPGRADE_TARGET } from "./planAccess";

// The ladder previously lived as inline conditionals and had drifted: mentorship
// was gated on PLAN_C (retired) and jobs on PLAN_B, so a ₹999 Outreach & Jobs
// customer would have been shown a lock on the jobs they had just paid for.

const user = (code, expires) => ({
  currentPlan: code ? { code } : null,
  accessExpiresAt: expires ?? null,
});

describe("hasFeature", () => {
  it("PLAN_A includes outreach, jobs and autofill — it is the whole core product", () => {
    for (const f of ["coldOutreach", "jobOpenings", "autofill"]) {
      expect(hasFeature(user("PLAN_A"), f)).toBe(true);
    }
  });

  it("PLAN_A does NOT include mentorship", () => {
    expect(hasFeature(user("PLAN_A"), "mentorship")).toBe(false);
  });

  it("PLAN_B includes everything", () => {
    for (const f of Object.keys(FEATURE_PLANS)) {
      expect(hasFeature(user("PLAN_B"), f)).toBe(true);
    }
  });

  it("no plan unlocks nothing — there is no free tier", () => {
    for (const f of Object.keys(FEATURE_PLANS)) {
      expect(hasFeature(user(null), f)).toBe(false);
    }
  });

  it("retired PLAN_C unlocks nothing, even though it used to unlock everything", () => {
    for (const f of Object.keys(FEATURE_PLANS)) {
      expect(hasFeature(user("PLAN_C"), f)).toBe(false);
    }
  });
});

describe("lockReason — the two cases need different words", () => {
  it("is null when the feature is available", () => {
    expect(lockReason(user("PLAN_B"), "mentorship")).toBeNull();
  });

  it("says 'upgrade' for a paying customer on a lower tier", () => {
    // Telling someone who has paid to "subscribe" reads as a bug.
    expect(lockReason(user("PLAN_A"), "mentorship")).toBe("upgrade");
  });

  it("says 'none' for someone who has never paid or has lapsed", () => {
    expect(lockReason(user(null), "mentorship")).toBe("none");
  });
});

describe("UPGRADE_TARGET", () => {
  it("points every feature at a plan that actually includes it", () => {
    for (const [feature, code] of Object.entries(UPGRADE_TARGET)) {
      expect(FEATURE_PLANS[feature]).toContain(code);
    }
  });

  it("sends mentorship to PLAN_B and everything else to the cheaper PLAN_A", () => {
    expect(UPGRADE_TARGET.mentorship).toBe("PLAN_B");
    expect(UPGRADE_TARGET.jobOpenings).toBe("PLAN_A");
  });
});

describe("daysUntilExpiry", () => {
  it("counts down the placement year", () => {
    const d = daysUntilExpiry({ accessExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
    expect(d).toBeGreaterThan(29);
    expect(d).toBeLessThanOrEqual(31);
  });

  it("goes negative once lapsed, rather than clamping to zero", () => {
    expect(daysUntilExpiry({ accessExpiresAt: new Date(Date.now() - 5 * 86400000).toISOString() })).toBeLessThan(0);
  });

  it("is null when unknown", () => {
    expect(daysUntilExpiry({})).toBeNull();
  });
});

// The bug: /api/user/me derived accessExpiresAt from ACTIVE access, so it went
// null the moment a year lapsed. daysUntilExpiry then returned null, the banner
// rendered nothing, and a lapsed customer saw a product that had silently
// stopped working (OUT-236).
describe("hasLapsed — 'ran out' must be distinguishable from 'never bought'", () => {
  it("is true for someone whose year ended", () => {
    expect(hasLapsed({ lapsedPlan: { code: "PLAN_A", name: "Outreach & Jobs" }, currentPlan: null })).toBe(true);
  });

  it("is false for someone who never bought anything", () => {
    expect(hasLapsed({ currentPlan: null })).toBe(false);
  });

  it("is false while a plan is still live", () => {
    expect(hasLapsed({ currentPlan: { code: "PLAN_A" }, lapsedPlan: null })).toBe(false);
  });

  it("counts days negative once expired, so the banner can say how long ago", () => {
    const d = daysUntilExpiry({ accessExpiresAt: new Date(Date.now() - 3 * 86400000).toISOString() });
    expect(d).toBeLessThan(0);
  });
});
