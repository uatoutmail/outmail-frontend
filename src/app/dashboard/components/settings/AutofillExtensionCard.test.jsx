import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AutofillExtensionCard from "./AutofillExtensionCard";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { post: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AutofillExtensionCard — generating a link code", () => {
  it("generates and displays a code with a success toast", async () => {
    api.post.mockResolvedValue({ data: { code: "ABC123", expiresInSeconds: 600 } });
    const { toast } = await import("sonner");
    render(<AutofillExtensionCard />);

    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));

    await waitFor(() => expect(screen.getByText("ABC123")).toBeInTheDocument());
    expect(screen.getByText(/expires in 10:00/i)).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Link code generated");
  });

  it("shows the backend error when generation fails", async () => {
    api.post.mockRejectedValue({ response: { data: { error: "No active plan" } } });
    const { toast } = await import("sonner");
    render(<AutofillExtensionCard />);

    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("No active plan"));
    expect(screen.getByRole("button", { name: /generate link code/i })).toBeInTheDocument();
  });

  it("falls back to a generic error message when the backend gives none", async () => {
    api.post.mockRejectedValue(new Error("network down"));
    const { toast } = await import("sonner");
    render(<AutofillExtensionCard />);

    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to generate code (an active plan is required)."
      )
    );
  });

  it("counts the expiry timer down and lets the user regenerate before it runs out", async () => {
    api.post.mockResolvedValue({ data: { code: "ABC123", expiresInSeconds: 5 } });
    render(<AutofillExtensionCard />);
    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));
    await waitFor(() => expect(screen.getByText("ABC123")).toBeInTheDocument());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(screen.getByText(/expires in 0:02/i)).toBeInTheDocument();

    api.post.mockResolvedValue({ data: { code: "XYZ999", expiresInSeconds: 600 } });
    await userEvent.click(screen.getByRole("button", { name: /generate a new code/i }));
    await waitFor(() => expect(screen.getByText("XYZ999")).toBeInTheDocument());
  });

  it("reverts to the generate button once the code fully expires", async () => {
    api.post.mockResolvedValue({ data: { code: "ABC123", expiresInSeconds: 2 } });
    render(<AutofillExtensionCard />);
    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));
    await waitFor(() => expect(screen.getByText("ABC123")).toBeInTheDocument());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(screen.queryByText("ABC123")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate link code/i })).toBeInTheDocument();
  });
});

describe("AutofillExtensionCard — copy", () => {
  it("copies the code to the clipboard and shows a toast", async () => {
    api.post.mockResolvedValue({ data: { code: "ABC123", expiresInSeconds: 600 } });
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    const { toast } = await import("sonner");
    render(<AutofillExtensionCard />);
    await userEvent.click(screen.getByRole("button", { name: /generate link code/i }));
    await waitFor(() => expect(screen.getByText("ABC123")).toBeInTheDocument());

    await userEvent.click(screen.getByTitle("Copy code"));

    expect(writeText).toHaveBeenCalledWith("ABC123");
    expect(toast.success).toHaveBeenCalledWith("Copied");
  });
});
