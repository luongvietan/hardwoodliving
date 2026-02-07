/**
 * InquiriesSection – Unit tests for client-side filtering and export.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InquiriesSection from "./InquiriesSection";
import type { Database } from "@/lib/types/supabase";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "0412345678",
    product_interest: "Oak Flooring",
    room_type: null,
    area: null,
    budget: null,
    message: null,
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

describe("InquiriesSection", () => {
  it("renders section heading", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    expect(screen.getByText("Contact Inquiries")).toBeInTheDocument();
  });

  it("shows all inquiries by default", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("2 of 2 shown")).toBeInTheDocument();
  });

  it("renders Export CSV button", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("renders status filter dropdown", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
  });

  it("renders date filter inputs", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    expect(screen.getByLabelText("Filter from date")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter to date")).toBeInTheDocument();
  });

  it("filters inquiries by status when filter changes", async () => {
    const user = userEvent.setup();
    render(<InquiriesSection inquiries={mockInquiries} />);

    const filter = screen.getByLabelText("Filter by status");
    await user.selectOptions(filter, "new");

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Jones")).not.toBeInTheDocument();
    expect(screen.getByText("1 of 2 shown")).toBeInTheDocument();
  });

  it("shows all inquiries when 'All Statuses' is selected", async () => {
    const user = userEvent.setup();
    render(<InquiriesSection inquiries={mockInquiries} />);

    const filter = screen.getByLabelText("Filter by status");
    await user.selectOptions(filter, "new");
    await user.selectOptions(filter, "all");

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("export button links to correct API endpoint", () => {
    render(<InquiriesSection inquiries={mockInquiries} />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("href", "/api/export?type=inquiries");
  });
});
