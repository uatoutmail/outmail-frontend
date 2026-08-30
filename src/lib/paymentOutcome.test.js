import { describe, it, expect } from "vitest";
import { OUTCOME, classify, message, formatPaise } from "./paymentOutcome";

// Someone has just tried to give us money. What they read next decides whether
// they trust the product, so each outcome gets its own wording (OUT-228).

describe("classify", () => {
  it("treats a dismissed modal as CANCELLED, not an error", () => {
    expect(classify(new Error("Payment cancelled"))).toBe(OUTCOME.CANCELLED);
  });

  it("maps a sold-out plan from the response code", () => {
    expect(classify({ response: { status: 409, data: { code: "PLAN_SOLD_OUT" } } })).toBe(OUTCOME.SOLD_OUT);
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
    expect(message(OUTCOME.ALREADY).body).toMatch(/not been charged twice/i);
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
