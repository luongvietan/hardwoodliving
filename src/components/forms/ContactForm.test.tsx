import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ContactActionResult } from "@/lib/actions/contact";

// ---------------------------------------------------------------------------
// Mutable state that the mocks read from
// ---------------------------------------------------------------------------
const mockActionState = {
  state: null as ContactActionResult | null,
  formAction: vi.fn(),
  isPending: false,
};

const mockFormStatus = {
  pending: false,
};

// ---------------------------------------------------------------------------
// Mock react (useActionState) and react-dom (useFormStatus)
// ---------------------------------------------------------------------------
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: () => [
      mockActionState.state,
      mockActionState.formAction,
      mockActionState.isPending,
    ],
  };
});

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormStatus: () => mockFormStatus,
  };
});

vi.mock("@/lib/actions/contact", () => ({
  submitContactForm: vi.fn(),
  contactFormSchema: {
    safeParse: vi.fn(() => ({ success: true, data: {} })),
  },
}));

// ---------------------------------------------------------------------------
// Import component after mocks
// ---------------------------------------------------------------------------
import ContactForm from "./ContactForm";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActionState.state = null;
    mockActionState.isPending = false;
    mockFormStatus.pending = false;
  });

  it("renders the form with all required fields", () => {
    render(<ContactForm />);

    // Required fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Optional fields
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/room type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument();
  });

  it("marks name and email as required (aria-required)", () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    expect(nameInput).toHaveAttribute("aria-required", "true");
    expect(emailInput).toHaveAttribute("aria-required", "true");
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
  });

  it("associates labels with inputs via htmlFor/id", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("id", "contact-name");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("id", "contact-email");
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute("id", "contact-phone");
  });

  it("pre-fills product interest when defaultProductInterest is provided", () => {
    render(<ContactForm defaultProductInterest="Oak Flooring" />);

    const productInput = screen.getByLabelText(/product interest/i);
    expect(productInput).toHaveValue("Oak Flooring");
  });

  it("renders room type dropdown with options", () => {
    render(<ContactForm />);

    const roomSelect = screen.getByLabelText(/room type/i);
    expect(roomSelect.tagName).toBe("SELECT");

    expect(screen.getByText("Living Room")).toBeInTheDocument();
    expect(screen.getByText("Kitchen")).toBeInTheDocument();
    expect(screen.getByText("Commercial Space")).toBeInTheDocument();
  });

  it("renders budget dropdown with options", () => {
    render(<ContactForm />);

    const budgetSelect = screen.getByLabelText(/budget/i);
    expect(budgetSelect.tagName).toBe("SELECT");

    expect(screen.getByText("Under $1,000")).toBeInTheDocument();
    expect(screen.getByText("Over $30,000")).toBeInTheDocument();
  });

  it("displays field errors when present (ActionResult discriminated union)", () => {
    mockActionState.state = {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: {
        name: ["Name is required"],
        email: ["Please enter a valid email address"],
      },
    };

    render(<ContactForm />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Please fix the errors below.")).toBeInTheDocument();
  });

  it("marks inputs as aria-invalid when field errors exist", () => {
    mockActionState.state = {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: { name: ["Name is required"] },
    };

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
  });

  it("shows success state after successful submission", () => {
    mockActionState.state = {
      success: true,
      data: { message: "Thank you for your inquiry!" },
    };

    render(<ContactForm />);

    expect(screen.getByText("Inquiry Submitted!")).toBeInTheDocument();
    expect(screen.getByText("Thank you for your inquiry!")).toBeInTheDocument();

    // Form should not be visible in success state
    expect(screen.queryByRole("button", { name: /send inquiry/i })).not.toBeInTheDocument();
  });

  it("shows Submit Another Inquiry link after success", () => {
    mockActionState.state = {
      success: true,
      data: { message: "Thank you for your inquiry!" },
    };

    render(<ContactForm />);

    const resetLink = screen.getByText("Submit Another Inquiry");
    expect(resetLink).toBeInTheDocument();
    expect(resetLink.closest("a")).toHaveAttribute("href", "/contact");
  });

  it("shows loading state when form is pending", () => {
    mockFormStatus.pending = true;

    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: /submitting/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
  });

  it("applies WCAG touch target sizing on all interactive elements", () => {
    render(<ContactForm />);

    // Verify min-h-[44px] class on all text inputs for WCAG 2.5.8 touch target compliance.
    // jsdom does not compute CSS pixel values, so class presence is the pragmatic check.
    const inputFields = [
      screen.getByLabelText(/name/i),
      screen.getByLabelText(/email/i),
      screen.getByLabelText(/phone/i),
      screen.getByLabelText(/product interest/i),
      screen.getByLabelText(/area/i),
    ];
    for (const input of inputFields) {
      expect(input.className).toContain("min-h-[44px]");
    }

    // Select elements
    const selectFields = [
      screen.getByLabelText(/room type/i),
      screen.getByLabelText(/budget/i),
    ];
    for (const select of selectFields) {
      expect(select.className).toContain("min-h-[44px]");
    }

    // Submit button
    const submitButton = screen.getByRole("button", { name: /send inquiry/i });
    expect(submitButton.className).toContain("min-h-[44px]");
    expect(submitButton.className).toContain("min-w-[44px]");
  });

  it("has proper autocomplete attributes for name and email", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute("autocomplete", "tel");
  });

  it("renders the form with an aria-label for accessibility", () => {
    render(<ContactForm />);

    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-label", "Contact consultation form");
  });

  it("enables HTML5 client-side validation (no noValidate)", () => {
    render(<ContactForm />);

    const form = screen.getByRole("form");
    // The form should NOT have noValidate, so HTML5 required/type="email" validation fires client-side
    expect(form).not.toHaveAttribute("novalidate");
  });
});
