import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AutofillExtensionCard from "./AutofillExtensionCard";
import { api } from "@/lib/api";
import { isExtensionInstalled, pairExtension, pingExtension } from "@/lib/extensionBridge";

// The one-click connect is also the user's agreement to the data disclosure
// (Chrome Web Store prominent disclosure), so the disclosure must sit above the
// button and the agreement must travel with the code.

vi.mock("@/lib/api", () => ({ api: { post: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/extensionBridge", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isExtensionInstalled: vi.fn(),
    pingExtension: vi.fn(),
    pairExtension: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  isExtensionInstalled.mockReturnValue(true);
  pingExtension.mockResolvedValue({ installed: true, linked: false });
});

describe("AutofillExtensionCard — connecting in this browser", () => {
  it("shows the disclosure above an Agree and connect button", async () => {
    render(<AutofillExtensionCard />);
    expect(await screen.findByRole("button", { name: /agree and connect/i })).toBeInTheDocument();
    expect(screen.getByText(/downloads your saved profile and resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Gemini/)).toBeInTheDocument();
    expect(pairExtension).not.toHaveBeenCalled();
  });

  it("sends the agreement with the code when clicked", async () => {
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: true });
    render(<AutofillExtensionCard />);
    await userEvent.click(await screen.findByRole("button", { name: /agree and connect/i }));
    await waitFor(() => expect(pairExtension).toHaveBeenCalledWith("ABC123", { consent: true }));
  });
});
