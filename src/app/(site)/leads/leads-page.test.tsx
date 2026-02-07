/**
 * LeadsPage (Server Component) – Integration tests for the leads management page.
 *
 * Tests authentication check, admin authorization, redirect for
 * unauthenticated/unauthorized users, section headings, and data display.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LeadsPage from "./page";

// ── Supabase mock ────────────────────────────────────────────────────────────

const mockGetUser = vi.fn();
const mockInquiriesData = vi.fn();
const mockTradesData = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetUser(),
    },
    from: (table: string) => ({
      select: () => ({
        order: () => {
          if (table === "inquiries") return mockInquiriesData();
          if (table === "trades") return mockTradesData();
          return { data: null, error: null };
        },
        eq: () => ({
          single: () => ({ data: null }),
        }),
      }),
    }),
  }),
}));

// ── Admin check mock ─────────────────────────────────────────────────────────

vi.mock("@/lib/utils/isAdmin", () => ({
  isAdmin: vi.fn((user) => {
    // Only admin@hardwoodliving.com is admin in tests
    return user?.email === "admin@hardwoodliving.com";
  }),
}));

// ── Helper ───────────────────────────────────────────────────────────────────

async function renderLeadsPage() {
  const jsx = await LeadsPage();
  return render(<>{jsx}</>);
}

// ── Test data ────────────────────────────────────────────────────────────────

const mockAdminUser = {
  id: "admin-123",
  email: "admin@hardwoodliving.com",
};

const mockTradeUser = {
  id: "trade-456",
  email: "trade@example.com",
};

const mockInquiries = [
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
];

const mockTrades = [
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
];

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockGetUser.mockReset();
  mockInquiriesData.mockReset();
  mockTradesData.mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("LeadsPage", () => {
  it("redirects to login when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(renderLeadsPage()).rejects.toThrow(
      "NEXT_REDIRECT:/trades/login",
    );
  });

  it("redirects to dashboard when user is not admin", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockTradeUser } });

    await expect(renderLeadsPage()).rejects.toThrow(
      "NEXT_REDIRECT:/trades/dashboard",
    );
  });

  it("renders page heading for admin user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Leads Management",
    );
  });

  it("renders Contact Inquiries section heading", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(screen.getByText("Contact Inquiries")).toBeInTheDocument();
  });

  it("renders Trade Registrations section heading", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(screen.getByText("Trade Registrations")).toBeInTheDocument();
  });

  it("displays inquiry data in the table", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("displays trade data in the table", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(screen.getByText("Jane Builder")).toBeInTheDocument();
    expect(screen.getByText("Builder Co")).toBeInTheDocument();
  });

  it("renders Export CSV buttons for both sections", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    const exportButtons = screen.getAllByText("Export CSV");
    expect(exportButtons).toHaveLength(2);
  });

  it("renders status filter dropdowns for both sections", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    const filters = screen.getAllByLabelText("Filter by status");
    expect(filters).toHaveLength(2);
  });

  it("renders date filter inputs for both sections", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: mockInquiries, error: null });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    const fromFilters = screen.getAllByLabelText("Filter from date");
    const toFilters = screen.getAllByLabelText("Filter to date");
    expect(fromFilters).toHaveLength(2);
    expect(toFilters).toHaveLength(2);
  });

  it("handles null data gracefully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({ data: null, error: null });
    mockTradesData.mockResolvedValue({ data: null, error: null });

    await renderLeadsPage();

    expect(screen.getByText("No inquiries found.")).toBeInTheDocument();
    expect(
      screen.getByText("No trade registrations found."),
    ).toBeInTheDocument();
  });

  it("shows error banner when Supabase query fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockAdminUser } });
    mockInquiriesData.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });
    mockTradesData.mockResolvedValue({ data: mockTrades, error: null });

    await renderLeadsPage();

    expect(
      screen.getByText(/Some data could not be loaded/),
    ).toBeInTheDocument();
  });
});
