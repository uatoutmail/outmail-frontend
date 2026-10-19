import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MailingAgentStatus from "./MailingAgentStatus";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("MailingAgentStatus — the headline light", () => {
  it("shows Offline and never connected when there is no lastSeen", async () => {
    api.get.mockResolvedValue({ data: { online: false, lastSeen: null } });
    render(<MailingAgentStatus />);
    await waitFor(() => expect(screen.getByText("Offline")).toBeInTheDocument());
    expect(screen.getByText("Never connected")).toBeInTheDocument();
  });

  it("shows Online and the relative last check-in time", async () => {
    const lastSeen = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    api.get.mockResolvedValue({ data: { online: true, lastSeen } });
    render(<MailingAgentStatus />);
    await waitFor(() => expect(screen.getByText("Online")).toBeInTheDocument());
    expect(screen.getByText(/last check-in 5m ago/i)).toBeInTheDocument();
  });

  it("offers no link-code button or download link once online", async () => {
    api.get.mockResolvedValue({ data: { online: true, lastSeen: null } });
    render(<MailingAgentStatus />);
    await waitFor(() => expect(screen.getByText("Online")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /link desktop agent/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /download for/i })).not.toBeInTheDocument();
  });
});

describe("MailingAgentStatus — offline, getting connected", () => {
  it("shows a download link and a link-code button", async () => {
    api.get.mockResolvedValue({ data: { online: false, lastSeen: null } });
    render(<MailingAgentStatus />);
    expect(await screen.findByRole("button", { name: /link desktop agent/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download for/i })).toBeInTheDocument();
  });

  it("generates a link code on click and displays it in place of the button", async () => {
    api.get.mockResolvedValue({ data: { online: false, lastSeen: null } });
    api.post.mockResolvedValue({ data: { code: "LINK99", expiresInSeconds: 300 } });
    render(<MailingAgentStatus />);

    await userEvent.click(await screen.findByRole("button", { name: /link desktop agent/i }));

    expect(await screen.findByText("LINK99")).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledWith("/api/agent/link/code");
    expect(screen.queryByRole("button", { name: /link desktop agent/i })).not.toBeInTheDocument();
  });
});
