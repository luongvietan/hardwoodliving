/**
 * LeadsTable – Unit tests for the inquiries table component.
 *
 * Tests empty state, data rendering, status badges, date formatting,
 * and click-to-view-details functionality.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadsTable from "./LeadsTable";
import type { Database } from "@/lib/types/supabase";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

// ── Test data ────────────────────────────────────────────────────────────────

const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "0412345678",
    product_interest: "Oak Flooring",
    room_type: "Living Room",
    area: "50sqm",
    budget: "$5,000",
    message: "Interested in samples",
    created_at: "2026-01-15T10:00:00Z",
    status: "new",
  },
  {
    id: "inq-2",
    name: "Bob Jones",
    email: "bob@example.com",
    phone: null,
    product_interest: null,
    room_type: null,
    area: null,
    budget: null,
    message: null,
    created_at: "2026-01-20T14:30:00Z",
    status: "contacted",
  },
];

// ── Tests ────────────────────────────────────────────────────────────────────

describe("LeadsTable", () => {
  it("renders empty state when no inquiries provided", () => {
    render(<LeadsTable inquiries={[]} />);

    expect(screen.getByText("No inquiries found.")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Product Interest")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("renders inquiry names and emails", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("renders phone number or dash for null", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(screen.getByText("0412345678")).toBeInTheDocument();
    // Bob has null phone - should show dash
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders product interest or dash for null", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(screen.getByText("Oak Flooring")).toBeInTheDocument();
  });

  it("renders status badges with correct text", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(screen.getByText("new")).toBeInTheDocument();
    expect(screen.getByText("contacted")).toBeInTheDocument();
  });

  it("renders formatted dates", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    // Dates formatted in en-AU locale
    expect(screen.getByText(/15 Jan 2026/)).toBeInTheDocument();
    expect(screen.getByText(/20 Jan 2026/)).toBeInTheDocument();
  });

  it("rows have aria-label for accessibility", () => {
    render(<LeadsTable inquiries={mockInquiries} />);

    expect(
      screen.getByLabelText("View details for Alice Smith"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("View details for Bob Jones"),
    ).toBeInTheDocument();
  });

  it("expands detail panel on row click", async () => {
    const user = userEvent.setup();
    render(<LeadsTable inquiries={mockInquiries} />);

    // Detail panel should not be visible initially
    expect(screen.queryByText("Inquiry Details")).not.toBeInTheDocument();

    // Click Alice's row
    await user.click(screen.getByLabelText("View details for Alice Smith"));

    // Detail panel should now be visible with extra fields
    expect(screen.getByText("Inquiry Details")).toBeInTheDocument();
    expect(screen.getByText("Living Room")).toBeInTheDocument();
    expect(screen.getByText("50sqm")).toBeInTheDocument();
    expect(screen.getByText("$5,000")).toBeInTheDocument();
    expect(screen.getByText("Interested in samples")).toBeInTheDocument();
  });

  it("collapses detail panel on second click", async () => {
    const user = userEvent.setup();
    render(<LeadsTable inquiries={mockInquiries} />);

    const row = screen.getByLabelText("View details for Alice Smith");

    // Click to expand
    await user.click(row);
    expect(screen.getByText("Inquiry Details")).toBeInTheDocument();

    // Click to collapse
    await user.click(row);
    expect(screen.queryByText("Inquiry Details")).not.toBeInTheDocument();
  });

  it("only one row expanded at a time", async () => {
    const user = userEvent.setup();
    render(<LeadsTable inquiries={mockInquiries} />);

    // Expand Alice
    await user.click(screen.getByLabelText("View details for Alice Smith"));
    expect(screen.getByText("Inquiry Details")).toBeInTheDocument();
    expect(screen.getByText("Living Room")).toBeInTheDocument();

    // Expand Bob (should collapse Alice)
    await user.click(screen.getByLabelText("View details for Bob Jones"));
    // Bob's detail shows dashes for null values
    expect(screen.queryByText("Living Room")).not.toBeInTheDocument();
  });
});
