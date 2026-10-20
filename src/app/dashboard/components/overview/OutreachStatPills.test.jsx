import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OutreachStatPills from "./OutreachStatPills";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("OutreachStatPills — fetch failure", () => {
  it("stops the skeleton pulse and falls back to defaults on a rejected fetch, never stays loading forever", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<OutreachStatPills selectedPeriod="7" />);

    await waitFor(() => {
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
    });
    // All four stats default to "0" on a failed fetch now — the fourth tile
    // no longer has a non-numeric "None" fallback (it shows a real delivered
    // count, defaulting to 0 like the other three).
    expect(screen.getAllByText("0").length).toBe(4);
  });

  it("renders real values on a successful fetch, including the real job-openings-delivered count", async () => {
    api.get.mockResolvedValue({
      data: {
        emailsSentPeriod: 12,
        totalEmailsSent: 340,
        companiesTargeted: 8,
        jobOpeningsShown: 137,
      },
    });
    render(<OutreachStatPills selectedPeriod="7" />);

    await waitFor(() => expect(screen.getByText("12")).toBeInTheDocument());
    expect(screen.getByText("340")).toBeInTheDocument();
    expect(screen.getByText("Job Openings Shown")).toBeInTheDocument();
    expect(screen.getByText("137")).toBeInTheDocument();
  });

  it("re-fetches when selectedPeriod changes", async () => {
    api.get.mockResolvedValue({
      data: { emailsSentPeriod: 1, totalEmailsSent: 1, companiesTargeted: 1, jobOpeningsShown: 1 },
    });
    const { rerender } = render(<OutreachStatPills selectedPeriod="7" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=7")));

    rerender(<OutreachStatPills selectedPeriod="30" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=30")));
  });
});
