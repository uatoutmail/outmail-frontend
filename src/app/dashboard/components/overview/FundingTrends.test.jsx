import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FundingTrends from "./FundingTrends";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
// recharts needs real layout (ResizeObserver) jsdom doesn't provide.
vi.mock("recharts", () => ({
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("FundingTrends", () => {
  it("shows an empty state when there is no funding data", async () => {
    api.get.mockResolvedValue({ data: { industries: [], totalEvents: 0, totalAmountM: 0 } });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText(/no funding rounds tracked/i)).toBeInTheDocument());
  });

  it("renders totals and the most-active industries by relative score, not dollar amount", async () => {
    api.get.mockResolvedValue({
      data: {
        relative: true,
        industries: [
          { industry: "FinTech", relativeScore: 100, amountM: 1500, events: 4 },
          { industry: "HealthTech", relativeScore: 25, amountM: 50, events: 1 },
        ],
        totalEvents: 5,
        totalAmountM: 1550,
      },
    });
    render(<FundingTrends selectedPeriod="30" />);

    await waitFor(() => expect(screen.getByText("FinTech")).toBeInTheDocument());
    expect(screen.getByText(/last 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/5 rounds/)).toBeInTheDocument();
    expect(screen.getByText(/relative signal strength/i)).toBeInTheDocument();
    expect(screen.getByText("Most Active")).toBeInTheDocument();
    // Billions-formatting is exercised here (via the badge), not as a
    // separate exact-text assertion — "$1.5B" is not an isolated text node
    // anywhere (it's concatenated with "4 signals · " inside the same span).
    expect(screen.getByText(/4 signals · \$1\.5B/)).toBeInTheDocument();
    expect(screen.getByText(/1 signal · \$50M/)).toBeInTheDocument();
  });

  it("shows the empty state when every industry has a zero relative score, even though the array isn't empty", async () => {
    api.get.mockResolvedValue({
      data: {
        relative: true,
        industries: [
          { industry: "FinTech", relativeScore: 0, amountM: 0, events: 0 },
          { industry: "HealthTech", relativeScore: 0, amountM: 0, events: 0 },
        ],
        totalEvents: 0,
        totalAmountM: 0,
      },
    });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText(/no funding rounds tracked/i)).toBeInTheDocument());
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

  it("toggles between bar and pie chart views", async () => {
    api.get.mockResolvedValue({
      data: {
        industries: [{ industry: "FinTech", relativeScore: 100, amountM: 100, events: 1 }],
        totalEvents: 1,
        totalAmountM: 100,
      },
    });
    render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(screen.getByText("FinTech")).toBeInTheDocument());

    const toggle = screen.getByTitle(/switch to pie chart/i);
    await userEvent.click(toggle);
    expect(screen.getByTitle(/switch to bar chart/i)).toBeInTheDocument();
  });

  it("re-fetches when selectedPeriod changes", async () => {
    api.get.mockResolvedValue({ data: { industries: [], totalEvents: 0, totalAmountM: 0 } });
    const { rerender } = render(<FundingTrends selectedPeriod="7" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/news/funding-trends?days=7"));

    rerender(<FundingTrends selectedPeriod="30" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/news/funding-trends?days=30"));
  });
});
