/**
 * TradeRegistrationForm – Component tests for the trade registration form.
 *
 * Tests the form rendering, field presence, validation indicators,
 * success state display, and login link.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TradeRegistrationForm from "./TradeRegistrationForm";

// Mock the server action - useActionState needs a mock
const mockFormAction = vi.fn();
const mockRouterPush = vi.fn();
let mockState: null | { success: true; data: { message: string; redirectTo?: string } } | { success: false; error: string; fieldErrors?: Record<string, string[]> } = null;

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: () => [mockState, mockFormAction],
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
  usePathname: () => "/trades/register",
}));

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockState = null;
  mockRouterPush.mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("TradeRegistrationForm", () => {
  // ── Form field rendering ─────────────────────────────────────────────────

  it("renders the form with aria label", () => {
    render(<TradeRegistrationForm />);
    expect(
      screen.getByRole("form", { name: /trade registration form/i }),
    ).toBeInTheDocument();
  });

  it("renders Full Name input field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("renders Company Name input field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
  });

  it("renders Business Type select field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
  });

  it("renders Email input field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders Phone input field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it("renders Password input field", () => {
    render(<TradeRegistrationForm />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the submit button with correct text", () => {
    render(<TradeRegistrationForm />);
    expect(
      screen.getByRole("button", { name: /create trade account/i }),
    ).toBeInTheDocument();
  });

  it("renders a 'Log in here' link for existing users", () => {
    render(<TradeRegistrationForm />);
    const loginLink = screen.getByRole("link", { name: /log in here/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/trades/login");
  });

  it("renders password hint text", () => {
    render(<TradeRegistrationForm />);
    expect(
      screen.getByText(/must be at least 8 characters with uppercase/i),
    ).toBeInTheDocument();
  });

  // ── Business type options ────────────────────────────────────────────────

  it("renders business type options including General Contractor", () => {
    render(<TradeRegistrationForm />);
    const select = screen.getByLabelText(/business type/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByText("General Contractor")).toBeInTheDocument();
    expect(screen.getByText("Flooring Installer")).toBeInTheDocument();
  });

  // ── Success state ────────────────────────────────────────────────────────

  it("shows success message after successful registration", () => {
    mockState = {
      success: true,
      data: { message: "Registration successful! Check your email." },
    };

    render(<TradeRegistrationForm />);
    expect(screen.getByText("Registration Successful!")).toBeInTheDocument();
    expect(
      screen.getByText("Registration successful! Check your email."),
    ).toBeInTheDocument();
  });

  it("shows Go to Login link after successful registration", () => {
    mockState = {
      success: true,
      data: { message: "Registration successful!" },
    };

    render(<TradeRegistrationForm />);
    const loginLink = screen.getByRole("link", { name: /go to login/i });
    expect(loginLink).toHaveAttribute("href", "/trades/login");
  });

  // ── Error state ──────────────────────────────────────────────────────────

  it("shows global error message on failure", () => {
    mockState = {
      success: false,
      error: "Please fix the errors below.",
    };

    render(<TradeRegistrationForm />);
    expect(
      screen.getByText("Please fix the errors below."),
    ).toBeInTheDocument();
  });

  it("shows field-level error for email", () => {
    mockState = {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: { email: ["This email is already registered."] },
    };

    render(<TradeRegistrationForm />);
    expect(
      screen.getByText("This email is already registered."),
    ).toBeInTheDocument();
  });
});
