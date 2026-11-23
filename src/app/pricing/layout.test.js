import { describe, expect, it } from "vitest";
import { describePrice } from "./layout";

// The /pricing share text must quote the live price, never a hardcoded one.
describe("describePrice", () => {
  it("quotes the live founding price and what it rises to", () => {
    const text = describePrice([
      { code: "PLAN_A", amount: 99900, list_amount: 149900, launchPlacesTotal: 1000 },
    ]);
    expect(text).toMatch(
      /^₹999 for 12 months \(founding price for the first 1,000 students, then ₹1,499\)/
    );
    expect(text).toMatch(/Full refund within 7 days\.$/);
  });

  it("drops the founding clause once the price is the standard one", () => {
    expect(describePrice([{ code: "PLAN_A", amount: 149900, list_amount: 149900 }])).toMatch(
      /^₹1,499 for 12 months: /
    );
  });

  it("falls back to price-free text when the plans are missing or odd", () => {
    for (const plans of [
      null,
      [],
      [{ code: "PLAN_B", amount: 499900 }],
      [{ code: "PLAN_A", amount: 0 }],
    ]) {
      expect(describePrice(plans)).toMatch(/^One payment for your whole placement year/);
    }
  });
});
