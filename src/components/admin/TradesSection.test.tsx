/**
 * TradesSection – Unit tests for client-side filtering and export.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TradesSection from "./TradesSection";
import type { Database } from "@/lib/types/supabase";

type Trade = Database["public"]["Tables"]["trades"]["Row"];

const mockTrades: Trade[] = [
  {
    id: "trade-1",
    name: "Jane Builder",
    company: "Builder Co",
    business_type: "General Contractor",
    email: "jane@builder.com",
    phone: "0498765432",
    created_at: "2026-02-01T09:00:00Z",
    status: "approved",
  },
  {
    id: "trade-2",
    name: "Tom Designer",
    company: null,
    business_type: "Interior Designer",
    email: "tom@design.com",
    phone: null,
    created_at: "2026-02-05T16:00:00Z",
    status: "pending",
  },
];

describe("TradesSection", () => {
  it("renders section heading", () => {
    render(<TradesSection trades={mockTrades} />);
    expect(screen.getByText("Trade Registrations")).toBeInTheDocument();
  });

  it("shows all trades by default", () => {
    render(<TradesSection trades={mockTrades} />);
    expect(screen.getByText("Jane Builder")).toBeInTheDocument();
    expect(screen.getByText("Tom Designer")).toBeInTheDocument();
    expect(screen.getByText("2 of 2 shown")).toBeInTheDocument();
  });

  it("renders Export CSV button", () => {
    render(<TradesSection trades={mockTrades} />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("renders status filter dropdown", () => {
    render(<TradesSection trades={mockTrades} />);
    expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
  });

  it("renders date filter inputs", () => {
    render(<TradesSection trades={mockTrades} />);
    expect(screen.getByLabelText("Filter from date")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter to date")).toBeInTheDocument();
  });

  it("filters trades by status when filter changes", async () => {
    const user = userEvent.setup();
    render(<TradesSection trades={mockTrades} />);

    const filter = screen.getByLabelText("Filter by status");
    await user.selectOptions(filter, "pending");

    expect(screen.getByText("Tom Designer")).toBeInTheDocument();
    expect(screen.queryByText("Jane Builder")).not.toBeInTheDocument();
    expect(screen.getByText("1 of 2 shown")).toBeInTheDocument();
  });

  it("shows all trades when 'All Statuses' is selected", async () => {
    const user = userEvent.setup();
    render(<TradesSection trades={mockTrades} />);

    const filter = screen.getByLabelText("Filter by status");
    await user.selectOptions(filter, "approved");
    await user.selectOptions(filter, "all");

    expect(screen.getByText("Jane Builder")).toBeInTheDocument();
    expect(screen.getByText("Tom Designer")).toBeInTheDocument();
  });

  it("export button links to correct API endpoint", () => {
    render(<TradesSection trades={mockTrades} />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("href", "/api/export?type=trades");
  });
});
