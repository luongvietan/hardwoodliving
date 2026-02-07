/**
 * StudioPage – Admin Page Component Test
 *
 * Verifies that the Sanity Studio admin page renders the NextStudio component.
 * NextStudio and sanity.config are mocked since they depend on browser/env APIs.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-sanity/studio → render a simple placeholder
vi.mock("next-sanity/studio", () => ({
  NextStudio: ({ config }: { config: Record<string, unknown> }) => (
    <div data-testid="sanity-studio" data-basepath={config?.basePath as string}>
      Sanity Studio
    </div>
  ),
}));

// Mock sanity.config (reads env vars at module level)
vi.mock("../../../../../sanity.config", () => ({
  default: {
    name: "default",
    title: "Hardwood Living",
    basePath: "/admin",
    projectId: "test-id",
    dataset: "production",
  },
}));

import StudioPage from "./page";

describe("StudioPage (Admin /admin)", () => {
  it("renders the Sanity Studio component", () => {
    render(<StudioPage />);
    expect(screen.getByTestId("sanity-studio")).toBeInTheDocument();
    expect(screen.getByText("Sanity Studio")).toBeInTheDocument();
  });

  it("passes config with basePath /admin", () => {
    render(<StudioPage />);
    const studio = screen.getByTestId("sanity-studio");
    expect(studio).toHaveAttribute("data-basepath", "/admin");
  });
});
