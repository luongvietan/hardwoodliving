/**
 * ExportButton – Unit tests for CSV export button component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExportButton from "./ExportButton";

describe("ExportButton", () => {
  it("renders Export CSV text", () => {
    render(<ExportButton type="inquiries" />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("links to correct API endpoint for inquiries", () => {
    render(<ExportButton type="inquiries" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("href", "/api/export?type=inquiries");
  });

  it("links to correct API endpoint for trades", () => {
    render(<ExportButton type="trades" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("href", "/api/export?type=trades");
  });

  it("includes status filter in URL when provided", () => {
    render(<ExportButton type="inquiries" status="new" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute(
      "href",
      "/api/export?type=inquiries&status=new",
    );
  });

  it("omits status filter when set to 'all'", () => {
    render(<ExportButton type="trades" status="all" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("href", "/api/export?type=trades");
  });

  it("has download attribute with correct filename for inquiries", () => {
    render(<ExportButton type="inquiries" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("download", "inquiries-export.csv");
  });

  it("has download attribute with correct filename for trades", () => {
    render(<ExportButton type="trades" />);
    const link = screen.getByText("Export CSV").closest("a");
    expect(link).toHaveAttribute("download", "trades-export.csv");
  });
});
