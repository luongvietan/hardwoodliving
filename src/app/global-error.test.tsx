import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "./global-error";

describe("GlobalError page", () => {
  const mockReset = vi.fn();

  it("renders critical error heading and message", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<GlobalError error={testError} reset={mockReset} />);

    expect(screen.getByText("Something Went Wrong")).toBeTruthy();
    expect(screen.getByText("Critical Error")).toBeTruthy();
  });

  it("renders Try Again button that calls reset", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<GlobalError error={testError} reset={mockReset} />);

    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainBtn).toBeTruthy();

    fireEvent.click(tryAgainBtn);
    expect(mockReset).toHaveBeenCalled();
  });

  it("renders a link to homepage for navigation fallback", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<GlobalError error={testError} reset={mockReset} />);

    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute("href")).toBe("/");
  });

  it("renders all critical UI elements for independent fallback", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<GlobalError error={testError} reset={mockReset} />);

    // GlobalError is a self-contained fallback (renders its own html/body in production).
    // In jsdom, html/body are stripped, so verify key content is present instead.
    expect(screen.getByText("A critical error occurred. Please try refreshing the page.")).toBeTruthy();
    expect(screen.getByRole("button", { name: /try again/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /go home/i })).toBeTruthy();
  });
});
