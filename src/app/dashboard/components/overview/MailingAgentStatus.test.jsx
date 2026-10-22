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

  // Found live, 2026-10-22: a real user stared at a generated code with no
  // idea where it went. Fixed two things - lead with the simpler option
  // (Google sign-in directly in the app), and once a code exists, name the
  // exact field the app's own login screen shows, not just "the app".
  it("suggests signing in with Google directly in the app before the code is generated", async () => {
    api.get.mockResolvedValue({ data: { online: false, lastSeen: null } });
    render(<MailingAgentStatus />);
    expect(await screen.findByText(/sign in with google.*there instead/i)).toBeInTheDocument();
  });

  it('once a code exists, names the exact field on the app\'s login screen, not just "the app"', async () => {
    api.get.mockResolvedValue({ data: { online: false, lastSeen: null } });
    api.post.mockResolvedValue({ data: { code: "LINK99", expiresInSeconds: 300 } });
    render(<MailingAgentStatus />);

    await userEvent.click(await screen.findByRole("button", { name: /link desktop agent/i }));

    expect(await screen.findByText(/enter a one-time code/i)).toBeInTheDocument();
  });
});

// OUT-173: a device that has checked in before but lost its Gmail connection
// is a different situation from never having linked at all, and gets its own
// one-click fix — a deep link straight into the native app's settings panel,
// never a password field on this page (OUT-169 rule).
describe("MailingAgentStatus — previously connected, Gmail disconnected", () => {
  it("shows a Reconnect Gmail deep link when the device has checked in before but credentialConnected is false", async () => {
    const lastSeen = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    api.get.mockResolvedValue({ data: { online: true, lastSeen, credentialConnected: false } });
    render(<MailingAgentStatus />);
    const link = await screen.findByRole("link", { name: /reconnect gmail/i });
    expect(link).toHaveAttribute("href", "outmail://reconnect-gmail");
  });

  it("does not show Reconnect Gmail when credentialConnected is true", async () => {
    const lastSeen = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    api.get.mockResolvedValue({ data: { online: true, lastSeen, credentialConnected: true } });
    render(<MailingAgentStatus />);
    await waitFor(() => expect(screen.getByText("Online")).toBeInTheDocument());
    expect(screen.queryByRole("link", { name: /reconnect gmail/i })).not.toBeInTheDocument();
  });

  it("does not show Reconnect Gmail for a device that has never connected — that's the Link Desktop Agent flow instead", async () => {
    api.get.mockResolvedValue({
      data: { online: false, lastSeen: null, credentialConnected: false },
    });
    render(<MailingAgentStatus />);
    expect(await screen.findByRole("button", { name: /link desktop agent/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /reconnect gmail/i })).not.toBeInTheDocument();
  });
});
