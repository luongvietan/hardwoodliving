/**
 * TradeLoginForm – Component tests for the trade login form.
 *
 * Tests form rendering, field presence, error display, and register link.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TradeLoginForm from "./TradeLoginForm";

// Mock the server action and hooks
const mockFormAction = vi.fn();
const mockRouterPush = vi.fn();
let mockState: null | { success: true; data: { message: string; redirectTo: string } } | { success: false; error: string; fieldErrors?: Record<string, string[]> } = null;

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: () => [mockState, mockFormAction],
    // useEffect runs callback after render — simulate with queueMicrotask for closer fidelity
    useEffect: (fn: () => void) => { queueMicrotask(fn); },
  };
});

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/trades/login",
}));

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockState = null;
  mockRouterPush.mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("TradeLoginForm", () => {
  // ── Form rendering ───────────────────────────────────────────────────────

  it("renders the form with aria label", () => {
    render(<TradeLoginForm />);
    expect(
      screen.getByRole("form", { name: /trade login form/i }),
    ).toBeInTheDocument();
  });

  it("renders Email input field", () => {
    render(<TradeLoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders Password input field", () => {
    render(<TradeLoginForm />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Sign In button", () => {
    render(<TradeLoginForm />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders Register here link", () => {
    render(<TradeLoginForm />);
    const registerLink = screen.getByRole("link", { name: /register here/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/trades/register");
  });

  // ── Error state ──────────────────────────────────────────────────────────

  it("shows global error message on failure", () => {
    mockState = {
      success: false,
      error: "Invalid email or password. Please try again.",
    };

    render(<TradeLoginForm />);
    expect(
      screen.getByText("Invalid email or password. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows field-level email error", () => {
    mockState = {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: { email: ["Email is required"] },
    };

    render(<TradeLoginForm />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  // ── Success redirect ─────────────────────────────────────────────────────

  it("redirects to dashboard on successful login", async () => {
    mockState = {
      success: true,
      data: { message: "Login successful!", redirectTo: "/trades/dashboard" },
    };

    render(<TradeLoginForm />);
    // Wait for queueMicrotask-based useEffect to flush
    await new Promise((r) => setTimeout(r, 0));
    expect(mockRouterPush).toHaveBeenCalledWith("/trades/dashboard");
  });
});
