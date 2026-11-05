import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import BillingStateModal from "./BillingStateModal";

describe("BillingStateModal", () => {
  it("renders nothing when closed", () => {
    render(<BillingStateModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByLabelText(/billing state/i)).not.toBeInTheDocument();
  });

  it("calls onConfirm with the picked state, not before one is picked", async () => {
    const onConfirm = vi.fn();
    render(<BillingStateModal open onConfirm={onConfirm} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /continue to payment/i }));
    // required + no value selected — the browser blocks submission, so
    // onConfirm must not have fired.
    expect(onConfirm).not.toHaveBeenCalled();

    await userEvent.selectOptions(screen.getByLabelText(/billing state/i), "Karnataka");
    await userEvent.click(screen.getByRole("button", { name: /continue to payment/i }));
    expect(onConfirm).toHaveBeenCalledWith("Karnataka");
  });

  it("calls onCancel on the Cancel button, without ever calling onConfirm", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<BillingStateModal open onConfirm={onConfirm} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel on Escape", async () => {
    const onCancel = vi.fn();
    render(<BillingStateModal open onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("lists Rajasthan — the GSTIN's own state — among the options", () => {
    render(<BillingStateModal open onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Rajasthan" })).toBeInTheDocument();
  });
});
