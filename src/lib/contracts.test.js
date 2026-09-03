import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), warn: vi.fn(), debug: vi.fn() } }));

const { PlansSchema, PlanSchema, parseOrReport } = await import("./contracts");
const { logger } = await import("@/lib/logger");

/**
 * These schemas guard the money path. The failure they exist to prevent
 * already happened once: the site advertised a free plan the backend charged
 * for, because the shape the page assumed and the shape the API returned had
 * drifted apart with nothing checking (OUT-232).
 */
const plan = {
  id: "p1",
  code: "PLAN_A",
  name: "Outreach & Jobs",
  amount: 99900,
  currency: "INR",
  list_amount: 149900,
};

beforeEach(() => vi.clearAllMocks());

describe("PlanSchema", () => {
  it("accepts a real plan", () => {
    expect(PlanSchema.safeParse(plan).success).toBe(true);
  });

  it("accepts fields the backend has not sent yet", () => {
    // launchPlacesLeft did not exist until recently. A frontend that rejects
    // a plan for a missing optional field breaks on every deploy skew.
    const { list_amount, ...minimal } = plan;
    expect(PlanSchema.safeParse(minimal).success).toBe(true);
  });

  it("accepts fields the backend adds later", () => {
    // Additive backend changes are normal and must never be an error.
    expect(PlanSchema.safeParse({ ...plan, somethingNew: true }).success).toBe(true);
  });

  it("rejects an amount that is not an integer number of paise", () => {
    // 999.5 paise means someone divided by 100 twice, which is exactly the
    // bug that shows a customer the wrong price.
    expect(PlanSchema.safeParse({ ...plan, amount: 999.5 }).success).toBe(false);
  });

  it("rejects a negative price", () => {
    expect(PlanSchema.safeParse({ ...plan, amount: -1 }).success).toBe(false);
  });

  it("rejects a price sent as a string", () => {
    // "99900" would render fine and arithmetic on it would silently concatenate.
    expect(PlanSchema.safeParse({ ...plan, amount: "99900" }).success).toBe(false);
  });

  it("rejects a plan with no code, which every gate keys on", () => {
    const { code, ...noCode } = plan;
    expect(PlanSchema.safeParse(noCode).success).toBe(false);
  });

  it("defaults currency to INR rather than leaving it undefined", () => {
    const { currency, ...noCurrency } = plan;
    expect(PlanSchema.parse(noCurrency).currency).toBe("INR");
  });
});

describe("parseOrReport", () => {
  it("returns the parsed value when the response is valid", () => {
    expect(parseOrReport(PlansSchema, [plan], "plans")).toHaveLength(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("NEVER throws on a bad payload — it reports and passes it through", () => {
    // The failure mode being defended against is showing the wrong number,
    // not showing nothing. An out-of-date schema must not take pricing down.
    const bad = [{ code: "PLAN_A" }];
    const out = parseOrReport(PlansSchema, bad, "plans");
    expect(out).toBe(bad);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("names the endpoint in the report, so the alert is actionable", () => {
    parseOrReport(PlansSchema, "not an array", "GET /api/payments/plans");
    expect(logger.error.mock.calls[0][0]).toContain("GET /api/payments/plans");
  });

  it("survives null and undefined payloads", () => {
    expect(() => parseOrReport(PlansSchema, null, "plans")).not.toThrow();
    expect(() => parseOrReport(PlansSchema, undefined, "plans")).not.toThrow();
  });
});
