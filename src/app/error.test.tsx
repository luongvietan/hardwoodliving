import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "./error";

describe("Error page", () => {
  const mockReset = vi.fn();

  it("renders error heading and message", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<ErrorPage error={testError} reset={mockReset} />);

    expect(screen.getByText("Unexpected Error")).toBeTruthy();
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("renders Try Again button that calls reset", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<ErrorPage error={testError} reset={mockReset} />);

    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainBtn).toBeTruthy();

    fireEvent.click(tryAgainBtn);
    expect(mockReset).toHaveBeenCalled();
  });

  it("renders a link to homepage", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<ErrorPage error={testError} reset={mockReset} />);

    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute("href")).toBe("/");
  });

  it("renders a link to browse products", () => {
    const testError = Object.assign(new globalThis.Error("Test error"), {});
    render(<ErrorPage error={testError} reset={mockReset} />);

    const productsLink = screen.getByRole("link", { name: /browse products/i });
    expect(productsLink).toBeTruthy();
    expect(productsLink.getAttribute("href")).toBe("/products");
  });
});
