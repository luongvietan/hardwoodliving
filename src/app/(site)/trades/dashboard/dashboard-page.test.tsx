/**
 * TradeDashboardPage (Server Component) – Integration tests for the trade dashboard.
 *
 * Tests authentication check, redirect for unauthenticated users,
 * profile display, and logout button presence.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TradeDashboardPage from "./page";

// ── Supabase mock ────────────────────────────────────────────────────────────

const mockGetUser = vi.fn();
const mockSelect = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetUser(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => mockSelect(),
        }),
      }),
    }),
  }),
}));

// Mock LogoutButton as client component
vi.mock("./LogoutButton", () => ({
  LogoutButton: () => <button>Log Out</button>,
}));

// ── Helper ───────────────────────────────────────────────────────────────────

async function renderDashboard() {
  const jsx = await TradeDashboardPage();
  return render(<>{jsx}</>);
}

// ── Test data ────────────────────────────────────────────────────────────────

const mockUser = {
  id: "user-123",
  email: "john@doe.com",
  user_metadata: { name: "John Doe", company: "Doe Construction" },
};

const mockTradeProfile = {
  name: "John Doe",
  company: "Doe Construction",
  business_type: "General Contractor",
  email: "john@doe.com",
  status: "approved",
};

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockGetUser.mockReset();
  mockSelect.mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("TradeDashboardPage", () => {
  it("redirects to login when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(renderDashboard()).rejects.toThrow("NEXT_REDIRECT:/trades/login");
  });

  it("renders dashboard heading for authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Trade Dashboard");
  });

  it("displays welcome message with user name", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(screen.getByText(/Welcome back, John Doe/)).toBeInTheDocument();
  });

  it("displays account information section", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(screen.getByText("Account Information")).toBeInTheDocument();
    expect(screen.getByText("john@doe.com")).toBeInTheDocument();
    expect(screen.getByText("Doe Construction")).toBeInTheDocument();
  });

  it("displays business type from trade profile", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(screen.getByText("General Contractor")).toBeInTheDocument();
  });

  it("displays account status badge", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("renders logout button", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it("renders quick links for Browse Products and Contact Support", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: mockTradeProfile });

    await renderDashboard();

    expect(screen.getByText("Browse Products")).toBeInTheDocument();
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
  });

  it("falls back to user_metadata name when no trade profile", async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSelect.mockResolvedValue({ data: null });

    await renderDashboard();

    expect(screen.getByText(/Welcome back, John Doe/)).toBeInTheDocument();
  });
});
