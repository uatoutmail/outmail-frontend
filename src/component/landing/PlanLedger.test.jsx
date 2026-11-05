import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlanLedger from "./PlanLedger";

/**
 * Found live 2026-11-06: disabling Plan B in admin correctly removed it
 * from /api/payments/plans, but the pricing page kept rendering a column
 * for it — a permanent pulsing "calculating" skeleton instead of the
 * column simply disappearing. The bug was PriceCell treating "not yet
 * fetched" and "fetched, this plan doesn't exist" identically. These tests
 * pin the fix directly, not just through the pricing page that wraps it.
 */

const PLAN_A = { id: "pa", code: "PLAN_A", amount: 99900, currency: "INR" };
const PLAN_B = { id: "pb", code: "PLAN_B", amount: 499900, currency: "INR" };
const PLAN_C = { id: "pc", code: "PLAN_C", amount: 299900, currency: "INR" };

const noopCta = () => <button type="button">Get it</button>;

describe("PlanLedger — the actual bug fix", () => {
  it("renders no column at all for a plan that is absent, instead of a stuck skeleton", () => {
    render(<PlanLedger plans={[PLAN_A]} renderCta={noopCta} />);
    // Only one price shown — no second skeleton waiting forever for a plan
    // that was deliberately disabled.
    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });

  it("shows a skeleton for BOTH expected columns only while loading=true, never once loading is false", () => {
    const { rerender } = render(<PlanLedger plans={null} loading renderCta={noopCta} />);
    expect(document.querySelectorAll(".animate-pulse")).toHaveLength(2);

    rerender(<PlanLedger plans={[PLAN_A]} loading={false} renderCta={noopCta} />);
    expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });

  it("renders 1 column when only PLAN_A is active", () => {
    render(<PlanLedger plans={[PLAN_A]} renderCta={noopCta} />);
    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(screen.queryByText("₹4,999")).not.toBeInTheDocument();
  });

  it("renders 2 columns when PLAN_A and PLAN_B are both active (the shape live in production today)", () => {
    render(<PlanLedger plans={[PLAN_A, PLAN_B]} renderCta={noopCta} />);
    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(screen.getByText("₹4,999")).toBeInTheDocument();
  });

  it("renders 3 columns when PLAN_A, PLAN_B, and PLAN_C are all active", () => {
    render(<PlanLedger plans={[PLAN_A, PLAN_B, PLAN_C]} renderCta={noopCta} />);
    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(screen.getByText("₹4,999")).toBeInTheDocument();
    expect(screen.getByText("₹2,999")).toBeInTheDocument();
  });

  it("always renders PLAN_A before PLAN_B regardless of array order", () => {
    render(
      <PlanLedger
        plans={[PLAN_B, PLAN_A]}
        renderCta={(p) => <button type="button">{p.code}</button>}
      />
    );
    const buttons = screen.getAllByRole("button").map((b) => b.textContent);
    expect(buttons).toEqual(["PLAN_A", "PLAN_B"]);
  });

  it("renders nothing at all when no known plan is active", () => {
    const { container } = render(<PlanLedger plans={[]} renderCta={noopCta} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("passes the real index to renderCta so the caller can style the first column as primary", () => {
    const renderCta = vi.fn(() => <button type="button">x</button>);
    render(<PlanLedger plans={[PLAN_A, PLAN_B]} renderCta={renderCta} />);
    expect(renderCta).toHaveBeenCalledWith(PLAN_A, { code: "PLAN_A", index: 0 });
    expect(renderCta).toHaveBeenCalledWith(PLAN_B, { code: "PLAN_B", index: 1 });
  });

  it("only shows feature rows relevant to the columns actually rendered", () => {
    render(<PlanLedger plans={[PLAN_A]} renderCta={noopCta} />);
    // PLAN_A doesn't include mentorship — the row still shows (shared
    // matrix), but with a "not included" mark, not hidden entirely.
    expect(screen.getByText("Bi-weekly mentorship sessions")).toBeInTheDocument();
    expect(screen.getAllByLabelText("not included").length).toBeGreaterThan(0);
  });

  it("marks a row included for PLAN_B and not included for PLAN_A in the same render", () => {
    render(<PlanLedger plans={[PLAN_A, PLAN_B]} renderCta={noopCta} />);
    const row = screen.getByText("Bi-weekly mentorship sessions").closest("div");
    expect(within(row).getByLabelText("not included")).toBeInTheDocument();
    expect(within(row).getByLabelText("included")).toBeInTheDocument();
  });
});
