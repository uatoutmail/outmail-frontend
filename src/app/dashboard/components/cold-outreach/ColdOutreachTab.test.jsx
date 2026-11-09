import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ColdOutreachTab from "./ColdOutreachTab";
import { useAuth } from "@/context/AuthContext";
import { useGmailConnected } from "@/hooks/useGmailConnected";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/hooks/useGmailConnected", () => ({ useGmailConnected: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("./CustomOutreach", () => ({ default: () => <div>Custom Outreach Stub</div> }));
vi.mock("./WeeklyPlan", () => ({ default: () => <div>Weekly Plan Stub</div> }));

const company = {
  id: "co1",
  name: "Acme Corp",
  contacts: [{ id: "contact1", email: "hr@acme.com", first_name: "Jane", contacted: false }],
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  useAuth.mockReturnValue({ user: { display_name: "Student" } });
  useGmailConnected.mockReturnValue({ gmailConnected: true });
  api.get.mockImplementation((url) => {
    if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
    if (url === "/api/outreach/companies")
      return Promise.resolve({
        data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
      });
    if (url === "/api/agent/status") return Promise.resolve({ data: { online: true } });
    if (url === "/api/outreach/status")
      return Promise.resolve({ data: { emails: [], counts: {} } });
    return Promise.resolve({ data: {} });
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ColdOutreachTab — run-outreach gating", () => {
  it("blocks the send when there is no resume uploaded, without calling the API", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /run outreach/i })).toBeDisabled();
  });

  it("blocks the send when Gmail is not connected, without calling the API", async () => {
    useGmailConnected.mockReturnValue({ gmailConnected: false });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /run outreach/i })).toBeDisabled();
  });

  it("queues outreach and shows a success toast naming the company on success", async () => {
    const { toast } = await import("sonner");
    api.post.mockResolvedValue({});
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /run outreach/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/outreach/single", { companyEmailId: "contact1" })
    );
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Acme Corp"));
  });

  it("shows the backend error message when queuing fails", async () => {
    const { toast } = await import("sonner");
    api.post.mockRejectedValue({ response: { data: { error: "Daily send limit reached" } } });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /run outreach/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Daily send limit reached"));
  });

  it('shows "Contacted" instead of a send button for an already-contacted contact', async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: {
            companies: [{ ...company, contacts: [{ ...company.contacts[0], contacted: true }] }],
            pagination: { total: 1, totalPages: 1 },
          },
        });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.getByText("Contacted")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /run outreach/i })).not.toBeInTheDocument();
  });
});

describe("ColdOutreachTab — sub-tabs", () => {
  it("switches to the Custom Outreach panel", async () => {
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /custom outreach/i }));
    expect(screen.getByText("Custom Outreach Stub")).toBeInTheDocument();
  });

  it("switches to the Weekly Plan panel", async () => {
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /weekly plan/i }));
    expect(screen.getByText("Weekly Plan Stub")).toBeInTheDocument();
  });

  it("loads and renders My Outreach history on tab switch", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      if (url === "/api/outreach/status")
        return Promise.resolve({
          data: {
            emails: [{ id: "e1", recipient_email: "hr@acme.com", status: "sent", lane: "single" }],
            counts: { sent: 1 },
          },
        });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /my outreach/i }));
    await waitFor(() => expect(screen.getByText("hr@acme.com")).toBeInTheDocument());
  });
});

describe("ColdOutreachTab — agent status strip", () => {
  it("shows the desktop app as offline when the agent status says so", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      if (url === "/api/agent/status") return Promise.resolve({ data: { online: false } });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText(/desktop app offline/i)).toBeInTheDocument());
  });
});

// 2026-11-09: a student had no way to tell WHY nothing was sending — the
// agent can be online (checking in normally) while the server has it paused.
describe("ColdOutreachTab — why nothing's sending", () => {
  it("shows a banner with the pause reason even while the agent reports online", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      if (url === "/api/agent/status")
        return Promise.resolve({
          data: {
            online: true,
            breaker: { reason: "policy_cooldown", message: "Gmail flagged this account." },
          },
        });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() =>
      expect(screen.getByText(/gmail flagged this account/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/desktop app online/i)).toBeInTheDocument();
  });

  it("includes a local resume time when resumesAt is present", async () => {
    const resumesAt = new Date("2026-11-09T22:47:40.757Z").toISOString();
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      if (url === "/api/agent/status")
        return Promise.resolve({
          data: {
            online: true,
            breaker: { reason: "policy_cooldown", message: "Paused.", resumesAt },
          },
        });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() =>
      expect(screen.getByText(/resumes automatically around/i)).toBeInTheDocument()
    );
  });

  it("shows no banner when breaker is null", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/api/resumes") return Promise.resolve({ data: [{ id: "r1" }] });
      if (url === "/api/outreach/companies")
        return Promise.resolve({
          data: { companies: [company], pagination: { total: 1, totalPages: 1 } },
        });
      if (url === "/api/agent/status")
        return Promise.resolve({ data: { online: true, breaker: null } });
      return Promise.resolve({ data: {} });
    });
    render(<ColdOutreachTab />);
    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.queryByText(/resumes automatically around/i)).not.toBeInTheDocument();
  });
});
