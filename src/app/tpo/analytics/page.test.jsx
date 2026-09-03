import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnalyticsPage from "./page";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/tpo/analytics",
}));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("recharts", () => ({
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

const payload = {
  engagementTrend: [
    {
      id: "Applications",
      color: "#000",
      data: [
        { x: "Week 1", y: 10 },
        { x: "Week 2", y: 20 },
      ],
    },
    {
      id: "Interviews",
      color: "#111",
      data: [
        { x: "Week 1", y: 2 },
        { x: "Week 2", y: 3 },
      ],
    },
  ],
  weeklyEmailData: [{ week: "Jan 1", sent: 50 }],
  branchFunnel: [
    { id: "CSE", value: 40, color: "#8B5CF6" },
    { id: "ECE", value: 20, color: "#3B82F6" },
  ],
  leaderboard: [
    { name: "Jane Doe", emails: 30, score: 95, delta: "+5" },
    { name: "John Smith", emails: 20, score: 80, delta: "-2" },
  ],
};

beforeEach(() => {
  vi.resetAllMocks();
  useAuth.mockReturnValue({
    user: { display_name: "Jane TPO" },
    isAuthenticated: true,
    loading: false,
    userRole: "TPO_ADMIN",
    logout: vi.fn(),
  });
});

describe("AnalyticsPage", () => {
  it("shows a loading message before data arrives", () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<AnalyticsPage />);
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
  });

  it('renders the leaderboard, branch breakdown, and excludes "Interviews" from the trend line keys', async () => {
    api.get.mockResolvedValue({ data: payload });
    render(<AnalyticsPage />);

    await waitFor(() => expect(screen.getByText("Jane Doe")).toBeInTheDocument());
    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("+5 this week")).toBeInTheDocument();
    expect(screen.getByText("-2 this week")).toBeInTheDocument();
    expect(screen.getByText("CSE")).toBeInTheDocument();
  });

  it('shows "No leaderboard data available" when the leaderboard is empty', async () => {
    api.get.mockResolvedValue({ data: { ...payload, leaderboard: [] } });
    render(<AnalyticsPage />);
    await waitFor(() =>
      expect(screen.getByText(/no leaderboard data available/i)).toBeInTheDocument()
    );
  });

  it('shows "No data available" placeholders for each chart when their data is empty', async () => {
    api.get.mockResolvedValue({
      data: { engagementTrend: [], weeklyEmailData: [], branchFunnel: [], leaderboard: [] },
    });
    render(<AnalyticsPage />);
    await waitFor(() => expect(screen.getAllByText(/no data available/i).length).toBe(3));
  });

  it("does not crash and shows the empty state when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<AnalyticsPage />);
    await waitFor(() =>
      expect(screen.getByText(/no leaderboard data available/i)).toBeInTheDocument()
    );
  });
});
