/**
 * TradesTable – Unit tests for the trades table component.
 *
 * Tests empty state, data rendering, status badges, date formatting,
 * and click-to-view-details functionality.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TradesTable from "./TradesTable";
import type { Database } from "@/lib/types/supabase";

type Trade = Database["public"]["Tables"]["trades"]["Row"];

// ── Test data ────────────────────────────────────────────────────────────────

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

// ── Tests ────────────────────────────────────────────────────────────────────

describe("TradesTable", () => {
  it("renders empty state when no trades provided", () => {
    render(<TradesTable trades={[]} />);

    expect(
      screen.getByText("No trade registrations found."),
    ).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Business Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("renders trade names and emails", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText("Jane Builder")).toBeInTheDocument();
    expect(screen.getByText("jane@builder.com")).toBeInTheDocument();
    expect(screen.getByText("Tom Designer")).toBeInTheDocument();
    expect(screen.getByText("tom@design.com")).toBeInTheDocument();
  });

  it("renders company or dash for null", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText("Builder Co")).toBeInTheDocument();
    // Tom has null company - should show dash
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders business types", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText("General Contractor")).toBeInTheDocument();
    expect(screen.getByText("Interior Designer")).toBeInTheDocument();
  });

  it("renders status badges with correct text", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("renders formatted dates", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(screen.getByText(/1 Feb 2026/)).toBeInTheDocument();
    expect(screen.getByText(/5 Feb 2026/)).toBeInTheDocument();
  });

  it("rows have aria-label for accessibility", () => {
    render(<TradesTable trades={mockTrades} />);

    expect(
      screen.getByLabelText("View details for Jane Builder"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("View details for Tom Designer"),
    ).toBeInTheDocument();
  });

  it("expands detail panel on row click", async () => {
    const user = userEvent.setup();
    render(<TradesTable trades={mockTrades} />);

    // Detail panel should not be visible initially
    expect(
      screen.queryByText("Trade Registration Details"),
    ).not.toBeInTheDocument();

    // Click Jane's row
    await user.click(screen.getByLabelText("View details for Jane Builder"));

    // Detail panel should now be visible with extra fields
    expect(
      screen.getByText("Trade Registration Details"),
    ).toBeInTheDocument();
    expect(screen.getByText("0498765432")).toBeInTheDocument();
  });

  it("collapses detail panel on second click", async () => {
    const user = userEvent.setup();
    render(<TradesTable trades={mockTrades} />);

    const row = screen.getByLabelText("View details for Jane Builder");

    // Click to expand
    await user.click(row);
    expect(
      screen.getByText("Trade Registration Details"),
    ).toBeInTheDocument();

    // Click to collapse
    await user.click(row);
    expect(
      screen.queryByText("Trade Registration Details"),
    ).not.toBeInTheDocument();
  });
});
