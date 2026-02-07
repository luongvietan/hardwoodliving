/**
 * StatusBadge – Unit tests for the shared status badge component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge, {
  INQUIRY_STATUS_COLORS,
  TRADE_STATUS_COLORS,
} from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="new" />);
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("applies default gray style when no colorMap provided", () => {
    render(<StatusBadge status="unknown" />);
    const badge = screen.getByText("unknown");
    expect(badge.className).toContain("bg-gray-100");
  });

  it("applies custom color from colorMap", () => {
    render(
      <StatusBadge status="new" colorMap={INQUIRY_STATUS_COLORS} />,
    );
    const badge = screen.getByText("new");
    expect(badge.className).toContain("bg-blue-100");
  });

  it("falls back to default for unrecognized status in colorMap", () => {
    render(
      <StatusBadge status="archived" colorMap={INQUIRY_STATUS_COLORS} />,
    );
    const badge = screen.getByText("archived");
    expect(badge.className).toContain("bg-gray-100");
  });

  it("renders inquiry status colors correctly", () => {
    const { rerender } = render(
      <StatusBadge status="new" colorMap={INQUIRY_STATUS_COLORS} />,
    );
    expect(screen.getByText("new").className).toContain("bg-blue-100");

    rerender(
      <StatusBadge status="contacted" colorMap={INQUIRY_STATUS_COLORS} />,
    );
    expect(screen.getByText("contacted").className).toContain("bg-green-100");
  });

  it("renders trade status colors correctly", () => {
    const { rerender } = render(
      <StatusBadge status="approved" colorMap={TRADE_STATUS_COLORS} />,
    );
    expect(screen.getByText("approved").className).toContain("bg-green-100");

    rerender(
      <StatusBadge status="pending" colorMap={TRADE_STATUS_COLORS} />,
    );
    expect(screen.getByText("pending").className).toContain("bg-yellow-100");

    rerender(
      <StatusBadge status="rejected" colorMap={TRADE_STATUS_COLORS} />,
    );
    expect(screen.getByText("rejected").className).toContain("bg-red-100");
  });

  it("capitalizes the status text via CSS class", () => {
    render(<StatusBadge status="new" />);
    const badge = screen.getByText("new");
    expect(badge.className).toContain("capitalize");
  });
});
