import { describe, it, expect } from "vitest";
import { OUTCOME, classify, message, formatPaise } from "./paymentOutcome";

// Someone has just tried to give us money. What they read next decides whether
// they trust the product, so each outcome gets its own wording (OUT-228).

describe("classify", () => {
  it("treats a dismissed modal as CANCELLED, not an error", () => {
    expect(classify(new Error("Payment cancelled"))).toBe(OUTCOME.CANCELLED);
  });

  it("maps a sold-out plan from the response code", () => {
    expect(classify({ response: { status: 409, data: { code: "PLAN_SOLD_OUT" } } })).toBe(
      OUTCOME.SOLD_OUT
    );
  });

  it("maps a rejected verification to FAILED", () => {
    expect(classify({ response: { status: 400 } })).toBe(OUTCOME.FAILED);
  });

  it("maps a declined card to FAILED", () => {
    expect(classify(new Error("Your card was declined"))).toBe(OUTCOME.FAILED);
  });

  it("falls back to a generic ERROR rather than guessing", () => {
    expect(classify(new Error("socket hang up"))).toBe(OUTCOME.ERROR);
  });
});

describe("message", () => {
  it("cancellation is NEUTRAL — changing your mind is not a failure", () => {
    // Colouring it red teaches people that leaving a payment screen is risky.
    const m = message(OUTCOME.CANCELLED);
    expect(m.tone).toBe("neutral");
    expect(m.body).toMatch(/nothing has been charged/i);
  });

  it("a failed payment reassures that no money was taken", () => {
    expect(message(OUTCOME.FAILED).body).toMatch(/no money has been taken/i);
  });

  it("a re-verify never implies a second charge", () => {
    // Asserted on intent, not on exact wording — the copy changed once already
    // (OUT-228 follow-up) and pinning the string made a copy edit look like a
    // regression. What must never change is the reassurance.
    expect(message(OUTCOME.ALREADY).body).toMatch(/not been charged (again|twice)/i);
  });

  it("NEVER leaks backend internals in any outcome", () => {
    // Standing rule: users must not learn what happened on the backend.
    for (const o of Object.values(OUTCOME)) {
      const { title, body } = message(o);
      expect(`${title} ${body}`).not.toMatch(/prisma|razorpay_|stack|undefined|null|500|Error:/i);
    }
  });

  it("every outcome has a tone the banner knows how to render", () => {
    for (const o of Object.values(OUTCOME)) {
      expect(["success", "error", "neutral"]).toContain(message(o).tone);
    }
  });
});

describe("formatPaise", () => {
  it("renders paise as whole rupees", () => {
    expect(formatPaise(99900)).toMatch(/999/);
    expect(formatPaise(499900)).toMatch(/4,999/);
  });

  it("returns null for a quote-only plan rather than ₹0", () => {
    expect(formatPaise(null)).toBeNull();
  });
});

// The UAT finding: on a real first purchase the webhook activated the customer
// 11 seconds before their browser's verify call arrived, so the order was
// already 'paid' by then. Keying the message off that told a brand-new customer
// "you already have this plan" — which reads as having been charged twice.
describe("the webhook race must not be reported as a repeat purchase", () => {
  it("ALREADY reassures rather than alarms, since it now only means a genuinely old plan", () => {
    const m = message(OUTCOME.ALREADY);
    expect(m.tone).toBe("success");
    expect(m.body).toMatch(/not been charged again/i);
  });

  it("SUCCESS is the message a first-time buyer sees, whichever path activated them", () => {
    expect(message(OUTCOME.SUCCESS).title).toMatch(/you're in/i);
  });
});
