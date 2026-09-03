import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The checkout component — the only place a customer can give us money, and
 * until now the largest untested file in the repo.
 *
 * What these pin down is the behaviour that costs real money when it breaks:
 * that no price is ever invented, that a sold-out plan cannot be bought, that
 * a signed-out visitor is not dropped into Razorpay, and that one click
 * cannot become two charges.
 */
vi.mock("@/lib/payments", () => ({
  getPlans: vi.fn(),
  startCheckout: vi.fn(),
  validateCoupon: vi.fn(),
}));
vi.mock("@/lib/checkoutIntent", () => ({ rememberIntent: vi.fn(), takeIntent: vi.fn(() => null) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const { getPlans, startCheckout } = await import("@/lib/payments");
const { useAuth } = await import("@/context/AuthContext");
const Pricing = (await import("./pricing")).default;

const PLAN_A = {
  id: "pa",
  code: "PLAN_A",
  name: "Outreach & Jobs",
  amount: 99900,
  currency: "INR",
  list_amount: 149900,
  launchPlacesTotal: 1000,
  launchPlacesLeft: 1000,
};
const PLAN_B = {
  id: "pb",
  code: "PLAN_B",
  name: "Outreach, Jobs & Mentorship",
  amount: 499900,
  currency: "INR",
  max_seats: 25,
  seatsRemaining: 25,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ isAuthenticated: true, refreshUser: vi.fn() });
  getPlans.mockResolvedValue([PLAN_A, PLAN_B]);
  startCheckout.mockResolvedValue({ ok: true });
});

describe("pricing — every number comes from the API", () => {
  it("renders the price the API returned, not a hardcoded one", async () => {
    render(<Pricing />);
    expect(await screen.findByText("₹999")).toBeInTheDocument();
    expect(screen.getByText("₹4,999")).toBeInTheDocument();
  });

  it("shows the struck-through list price only when there is a real one", async () => {
    getPlans.mockResolvedValue([{ ...PLAN_A, list_amount: null }, PLAN_B]);
    render(<Pricing />);
    await screen.findByText("₹999");
    // A struck price that never applied is misleading reference pricing.
    expect(screen.queryByText("₹1,499")).not.toBeInTheDocument();
  });

  it("says so when plans cannot be loaded, rather than rendering a guess", async () => {
    getPlans.mockRejectedValue(new Error("network down"));
    render(<Pricing />);
    expect(await screen.findByText(/could not load our plans/i)).toBeInTheDocument();
    expect(screen.queryByText("₹999")).not.toBeInTheDocument();
  });
});

describe("pricing — who can buy", () => {
  it("asks a signed-out visitor to sign in instead of opening checkout", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, refreshUser: vi.fn() });
    render(<Pricing />);
    const buttons = await screen.findAllByRole("button", { name: /sign in to continue/i });
    await userEvent.click(buttons[0]);
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("disables a sold-out plan and never sends it to checkout", async () => {
    getPlans.mockResolvedValue([PLAN_A, { ...PLAN_B, seatsRemaining: 0 }]);
    render(<Pricing />);
    const soldOut = await screen.findByRole("button", { name: /fully subscribed/i });
    expect(soldOut).toBeDisabled();
    await userEvent.click(soldOut);
    expect(startCheckout).not.toHaveBeenCalled();
  });
});

describe("pricing — one click, one charge", () => {
  it("passes the plan the user actually clicked", async () => {
    render(<Pricing />);
    const buy = (await screen.findAllByRole("button", { name: /^get it$/i }))[0];
    await userEvent.click(buy);
    await waitFor(() =>
      expect(startCheckout).toHaveBeenCalledWith(expect.objectContaining({ planId: "pa" }))
    );
  });

  it("locks every buy button while a checkout is in flight", async () => {
    // The Razorpay modal is theirs; once it closes we are still waiting on our
    // own /verify call, and that gap is where a second click becomes a second
    // order.
    let release;
    startCheckout.mockImplementation(
      () =>
        new Promise((r) => {
          release = r;
        })
    );
    render(<Pricing />);
    const buy = (await screen.findAllByRole("button", { name: /^get it$/i }))[0];
    await userEvent.click(buy);
    await waitFor(() => expect(buy).toBeDisabled());
    for (const b of screen.getAllByRole("button")) {
      if (/get it|take a seat|fully subscribed/i.test(b.textContent)) expect(b).toBeDisabled();
    }
    release?.({ ok: true });
  });

  it("tells the user which phase it is in, so a pause is not read as a hang", async () => {
    startCheckout.mockImplementation(() => new Promise(() => {}));
    render(<Pricing />);
    const buy = (await screen.findAllByRole("button", { name: /^get it$/i }))[0];
    await userEvent.click(buy);
    expect(await screen.findByRole("button", { name: /opening/i })).toBeInTheDocument();
  });
});

describe("pricing — the all-in claim", () => {
  it("states that the displayed price is the total", async () => {
    // Showing ₹999 and charging more at checkout is drip pricing, which the
    // CCPA's 2023 dark-pattern guidelines name directly.
    render(<Pricing />);
    expect(await screen.findByText(/inclusive of all taxes/i)).toBeInTheDocument();
    expect(screen.getByText(/no fees added at\s+checkout/i)).toBeInTheDocument();
  });
});
