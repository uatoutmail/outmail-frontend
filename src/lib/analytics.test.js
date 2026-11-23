import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkoutParams, track } from "./analytics";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    "outmail.attribution",
    JSON.stringify({ last: { utm_source: "zoom", utm_campaign: "kiet-s1" } })
  );
});
afterEach(() => {
  delete window.gtag;
});

describe("track", () => {
  it("sends the event with the visitor's UTM tags attached", () => {
    window.gtag = vi.fn();
    track("purchase", { value: 999 });
    expect(window.gtag).toHaveBeenCalledWith("event", "purchase", {
      utm_source: "zoom",
      utm_campaign: "kiet-s1",
      value: 999,
    });
  });

  it("does nothing, and never throws, without gtag or when gtag throws", () => {
    expect(() => track("sign_up")).not.toThrow();
    window.gtag = () => {
      throw new Error("blocked");
    };
    expect(() => track("sign_up")).not.toThrow();
  });
});

describe("checkoutParams", () => {
  it("reports rupees, the coupon and the order id in GA4 ecommerce shape", () => {
    const plan = { code: "PLAN_A", name: "Outreach & Jobs", amount: 149900, currency: "INR" };
    expect(
      checkoutParams({ plan, amount: 99900, coupon: "KIET999", transactionId: "order_1" })
    ).toEqual({
      currency: "INR",
      value: 999,
      coupon: "KIET999",
      transaction_id: "order_1",
      items: [{ item_id: "PLAN_A", item_name: "Outreach & Jobs", price: 999, quantity: 1 }],
    });
  });
});
