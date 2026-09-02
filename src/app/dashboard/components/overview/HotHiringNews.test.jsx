import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HotHiringNews from "./HotHiringNews";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("HotHiringNews", () => {
  it("shows an empty state when there are no hot companies today", async () => {
    api.get.mockResolvedValue({ data: { hot_companies: [] } });
    render(<HotHiringNews />);
    await waitFor(() => expect(screen.getByText(/no fresh hiring signals/i)).toBeInTheDocument());
  });

  it("renders up to 5 headlines built from company/role/location", async () => {
    const hotCompanies = Array.from({ length: 7 }, (_, i) => ({
      company: `Company${i}`,
      role: "Engineer",
      location: "Remote",
      signals: ["SaaS"],
    }));
    api.get.mockResolvedValue({ data: { hot_companies: hotCompanies } });
    render(<HotHiringNews />);

    await waitFor(() =>
      expect(screen.getByText("Company0 hiring for Engineer")).toBeInTheDocument()
    );
    expect(screen.getByText("Company4 hiring for Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Company5 hiring for Engineer")).not.toBeInTheDocument();
    expect(screen.getAllByText("SaaS").length).toBeGreaterThan(0);
  });

  it('falls back to "Hiring" tag and "Remote" source when signals/location are absent', async () => {
    api.get.mockResolvedValue({ data: { hot_companies: [{ company: "Acme", role: "PM" }] } });
    render(<HotHiringNews />);

    await waitFor(() => expect(screen.getByText("Acme hiring for PM")).toBeInTheDocument());
    expect(screen.getByText("Hiring")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("shows the empty state (not a crash) when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<HotHiringNews />);
    await waitFor(() => expect(screen.getByText(/no fresh hiring signals/i)).toBeInTheDocument());
  });
});
