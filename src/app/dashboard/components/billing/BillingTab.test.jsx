import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Focused on the billing-state gate (GST, live 2026-11-05) — the one piece
 * of behaviour this change actually touches. Not a full suite for the tab;
 * the component had none before this and a full retrofit is a separate task.
 */
vi.mock("@/lib/payments", () => ({ startCheckout: vi.fn(), getPlans: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));

const { startCheckout, getPlans } = await import("@/lib/payments");
const { api } = await import("@/lib/api");
const { useAuth } = await import("@/context/AuthContext");
const BillingTab = (await import("./BillingTab")).default;

const PLAN = { id: "pa", code: "PLAN_A", name: "Outreach & Jobs", amount: 99900 };

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({
    user: {
      currentPlan: { code: "PLAN_A", name: "Outreach & Jobs" },
      // Expired, so the renew button is actually rendered.
      accessExpiresAt: new Date(Date.now() - 86400000).toISOString(),
    },
    refreshUser: vi.fn(),
  });
  api.get.mockResolvedValue({ data: [] });
  getPlans.mockResolvedValue([PLAN]);
  startCheckout.mockResolvedValue({ ok: true });
});

describe("BillingTab — renewal is gated on a billing state", () => {
  it("does not call startCheckout until a state is picked and confirmed", async () => {
    render(<BillingTab />);
    const renewBtn = await screen.findByRole("button", { name: /renew to resume/i });
    await userEvent.click(renewBtn);

    expect(await screen.findByLabelText(/billing state/i)).toBeInTheDocument();
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("passes the picked state through to startCheckout", async () => {
    render(<BillingTab />);
    const renewBtn = await screen.findByRole("button", { name: /renew to resume/i });
    await userEvent.click(renewBtn);

    await userEvent.selectOptions(await screen.findByLabelText(/billing state/i), "Rajasthan");
    await userEvent.click(screen.getByRole("button", { name: /continue to payment/i }));

    await waitFor(() =>
      expect(startCheckout).toHaveBeenCalledWith(
        expect.objectContaining({ planId: "pa", billingState: "Rajasthan" })
      )
    );
  });

  it("cancelling the modal never calls startCheckout", async () => {
    render(<BillingTab />);
    const renewBtn = await screen.findByRole("button", { name: /renew to resume/i });
    await userEvent.click(renewBtn);
    await userEvent.click(await screen.findByRole("button", { name: /^cancel$/i }));

    expect(screen.queryByLabelText(/billing state/i)).not.toBeInTheDocument();
    expect(startCheckout).not.toHaveBeenCalled();
  });
});
