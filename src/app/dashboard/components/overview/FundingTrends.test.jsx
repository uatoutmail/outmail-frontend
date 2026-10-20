import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FundingTrends from "./FundingTrends";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
// recharts needs real layout (ResizeObserver) jsdom doesn't provide. The
// heatmap flip side is plain divs, not recharts, so it needs no mock here.
vi.mock("recharts", () => ({
  RadarChart: ({ children }) => <div>{children}</div>,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Radar: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

const METHODOLOGY = "Outmail's analysis of industry momentum — not exact performance metrics";

describe("FundingTrends", () => {
  it("shows an empty state when there is no funding data", async () => {
    api.get.mockResolvedValue({ data: { industries: [], totalEvents: 0, totalAmountM: 0 } });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText(/no funding rounds tracked/i)).toBeInTheDocument());
  });

  it("renders totals, the live methodology disclaimer, and the most-active industries by relative score", async () => {
    api.get.mockResolvedValue({
      data: {
        relative: true,
        methodology: METHODOLOGY,
        industries: [
          { industry: "FinTech", relativeScore: 100, amountM: 1500, events: 4 },
          { industry: "HealthTech", relativeScore: 48, amountM: 50, events: 1 },
        ],
        totalEvents: 5,
        totalAmountM: 1550,
      },
    });
    render(<FundingTrends selectedPeriod="30" />);

    await waitFor(() => expect(screen.getByText("FinTech")).toBeInTheDocument());
    expect(screen.getByText(/last 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/5 rounds/)).toBeInTheDocument();
    // The disclaimer is sourced live from the API, not hardcoded in the
    // component — the backend is the single source of truth for its wording.
    expect(screen.getByText(METHODOLOGY)).toBeInTheDocument();
    expect(screen.getByText("Most Active")).toBeInTheDocument();
    // Billions-formatting is exercised here (via the badge), not as a
    // separate exact-text assertion — "$1.5B" is not an isolated text node
    // anywhere (it's concatenated with "4 signals · " inside the same span).
    expect(screen.getByText(/4 signals · \$1\.5B/)).toBeInTheDocument();
    expect(screen.getByText(/1 signal · \$50M/)).toBeInTheDocument();
  });

  it("does not show a $0 badge for the most-active industry when it has signals but no parseable amount", async () => {
    api.get.mockResolvedValue({
      data: {
        industries: [{ industry: "FinTech", relativeScore: 100, amountM: 0, events: 3 }],
        totalEvents: 3,
        totalAmountM: 0,
      },
    });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText("3 signals")).toBeInTheDocument());
  });

  it("clears data and stops loading when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText(/no funding rounds tracked/i)).toBeInTheDocument());
  });

  it("toggles between the radial spoke and heatmap grid views", async () => {
    api.get.mockResolvedValue({
      data: {
        industries: [{ industry: "FinTech", relativeScore: 100, amountM: 100, events: 1 }],
        totalEvents: 1,
        totalAmountM: 100,
      },
    });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText("FinTech")).toBeInTheDocument());

    const toggle = screen.getByTitle(/switch to heatmap view/i);
    await userEvent.click(toggle);
    expect(screen.getByTitle(/switch to radial view/i)).toBeInTheDocument();
  });

  it("excludes Other from the heatmap grid, which never gets its own cell", async () => {
    api.get.mockResolvedValue({
      data: {
        industries: [
          { industry: "Other", relativeScore: 85, amountM: 0, events: 10 },
          { industry: "FinTech", relativeScore: 60, amountM: 0, events: 2 },
          { industry: "HealthTech", relativeScore: 48, amountM: 0, events: 2 },
        ],
        totalEvents: 14,
        totalAmountM: 0,
      },
    });
    render(<FundingTrends selectedPeriod="7" />);
    await userEvent.click(await screen.findByTitle(/switch to heatmap view/i));

    // Other legitimately still appears elsewhere (the "Most Active" badges
    // are unfiltered), so the check has to be scoped to the heatmap grid
    // specifically — not a page-wide absence check.
    const grid = within(await screen.findByTestId("momentum-heatmap"));
    expect(grid.queryByText("Other")).not.toBeInTheDocument();
    expect(grid.getByText("FinTech")).toBeInTheDocument();
    expect(grid.getByText("HealthTech")).toBeInTheDocument();
    expect(grid.getByText("60")).toBeInTheDocument();
    expect(grid.getByText("48")).toBeInTheDocument();
  });

  it("re-fetches when selectedPeriod changes", async () => {
    api.get.mockResolvedValue({ data: { industries: [], totalEvents: 0, totalAmountM: 0 } });
    const { rerender } = render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/news/funding-trends?days=7"));

    rerender(<FundingTrends selectedPeriod="30" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/news/funding-trends?days=30"));
  });
});
