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
    // All four stats default to 0 on a failed fetch. Tiles 1 & 2 also show
    // their "of N" secondary (prepared count), which is "of 0" here.
    expect(screen.getAllByText("0").length).toBe(4);
    expect(screen.getAllByText(/of 0/).length).toBe(2);
  });

  it("renders sent vs prepared as 'X of Y', not a single conflated count", async () => {
    api.get.mockResolvedValue({
      data: {
        emailsSentPeriod: 5,
        emailsPreparedPeriod: 9,
        totalEmailsSent: 62,
        totalEmailsPrepared: 121,
        companiesTargeted: 8,
        jobOpeningsShown: 137,
      },
    });
    render(<OutreachStatPills selectedPeriod="7" />);

    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
    expect(screen.getByText(/of 9/)).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();
    expect(screen.getByText(/of 121/)).toBeInTheDocument();
    // Companies Targeted and Job Openings Shown are plain counts, no "of N".
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Job Openings Shown")).toBeInTheDocument();
    expect(screen.getByText("137")).toBeInTheDocument();
  });

  it("re-fetches when selectedPeriod changes", async () => {
    api.get.mockResolvedValue({
      data: {
        emailsSentPeriod: 1,
        emailsPreparedPeriod: 1,
        totalEmailsSent: 1,
        totalEmailsPrepared: 1,
        companiesTargeted: 1,
        jobOpeningsShown: 1,
      },
    });
    const { rerender } = render(<OutreachStatPills selectedPeriod="7" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=7")));

    rerender(<OutreachStatPills selectedPeriod="30" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining("period=30")));
  });
});
