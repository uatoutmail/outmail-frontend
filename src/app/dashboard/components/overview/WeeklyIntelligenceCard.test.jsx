import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WeeklyIntelligenceCard from "./WeeklyIntelligenceCard";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("WeeklyIntelligenceCard", () => {
  it("shows an empty state when there is no intelligence yet", async () => {
    api.get.mockResolvedValue({ data: { intelligence: null } });
    render(<WeeklyIntelligenceCard />);
    await waitFor(() => expect(screen.getByText(/no market read yet/i)).toBeInTheDocument());
  });

  it("renders the week label, summary, industries, and companies", async () => {
    api.get.mockResolvedValue({
      data: {
        intelligence: {
          weekOf: "2026-08-10T00:00:00Z",
          summary: "Fintech and healthtech are hiring aggressively this week.",
          industries: [
            { industry: "FinTech", confidence: 0.82, reason: "Multiple funding rounds" },
            { industry: "HealthTech", confidence: 0.6 },
          ],
          companies: [
            { name: "Acme Corp", hiringProbability: 0.9, reasons: ["Posted 5 new roles"] },
          ],
        },
      },
    });
    render(<WeeklyIntelligenceCard />);

    await waitFor(() => expect(screen.getByText(/fintech and healthtech/i)).toBeInTheDocument());
    expect(screen.getByText(/week of/i)).toBeInTheDocument();
    expect(screen.getByText("FinTech")).toBeInTheDocument();
    expect(screen.getByText(/82% confidence/i)).toBeInTheDocument();
    expect(screen.getByText("Multiple funding rounds")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    // Only 2 industries — nothing to hide, so no expand control at all.
    expect(screen.queryByRole("button", { name: /show all/i })).not.toBeInTheDocument();
  });

  it("caps industries at 5 (not 4) and companies at 8", async () => {
    api.get.mockResolvedValue({
      data: {
        intelligence: {
          industries: Array.from({ length: 6 }, (_, i) => ({ industry: `Industry${i}` })),
          companies: Array.from({ length: 10 }, (_, i) => ({ name: `Company${i}` })),
        },
      },
    });
    render(<WeeklyIntelligenceCard />);

    await waitFor(() => expect(screen.getByText("Industry0")).toBeInTheDocument());
    // The generation prompt already allows up to 6 — the UI used to hard-cap
    // at 4 regardless of how many the model actually returned.
    expect(screen.getByText("Industry4")).toBeInTheDocument();
    expect(screen.queryByText("Industry5")).not.toBeInTheDocument();
    expect(screen.getByText("Company7")).toBeInTheDocument();
    expect(screen.queryByText("Company8")).not.toBeInTheDocument();
  });

  it("shows a working expand toggle once there are more than 2 industries", async () => {
    api.get.mockResolvedValue({
      data: {
        intelligence: {
          industries: Array.from({ length: 5 }, (_, i) => ({
            industry: `Industry${i}`,
            confidence: 0.9,
          })),
        },
      },
    });
    render(<WeeklyIntelligenceCard />);

    const btn = await screen.findByRole("button", { name: /show all 5/i });
    await userEvent.click(btn);
    expect(await screen.findByRole("button", { name: /show less/i })).toBeInTheDocument();
  });

  it("shows the empty state (not a crash) when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<WeeklyIntelligenceCard />);
    await waitFor(() => expect(screen.getByText(/no market read yet/i)).toBeInTheDocument());
  });
});
