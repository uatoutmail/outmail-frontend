import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RecentOutreachFeed from "./RecentOutreachFeed";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("RecentOutreachFeed", () => {
  it("shows an empty state when there is no recent activity", async () => {
    api.get.mockResolvedValue({ data: { analytics: { recentActivity: [] } } });
    render(<RecentOutreachFeed />);
    await waitFor(() => expect(screen.getByText(/no emails sent yet/i)).toBeInTheDocument());
  });

  it("renders up to 5 entries, preferring organization_name over the email domain", async () => {
    const logs = Array.from({ length: 7 }, (_, i) => ({
      id: `l${i}`,
      organization_name: i === 0 ? "Acme Corp" : undefined,
      recipient_email: `hr@company${i}.com`,
      subject: i === 0 ? "Excited to connect" : undefined,
      sent_at: new Date().toISOString(),
    }));
    api.get.mockResolvedValue({ data: { analytics: { recentActivity: logs } } });
    render(<RecentOutreachFeed />);

    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.getByText("Excited to connect")).toBeInTheDocument();
    // Falls back to the recipient's domain when no organization_name.
    expect(screen.getByText("company1.com")).toBeInTheDocument();
    expect(screen.getAllByText("Cold Outreach").length).toBe(4);
    // Only the first 5 render.
    expect(screen.queryByText("company5.com")).not.toBeInTheDocument();
  });

  it("stops loading and shows the empty state when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<RecentOutreachFeed />);
    await waitFor(() => expect(screen.getByText(/no emails sent yet/i)).toBeInTheDocument());
  });
});
