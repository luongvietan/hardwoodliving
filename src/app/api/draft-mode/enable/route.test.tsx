/**
 * Draft Mode Enable Route Tests
 *
 * Verifies that the /api/draft-mode/enable endpoint is correctly
 * configured using defineEnableDraftMode from next-sanity.
 */
import { describe, it, expect, vi } from "vitest";

// ── Hoisted (runs before vi.mock factories and module evaluation) ────────────

const { mockWithConfig, mockDefineEnableDraftMode } = vi.hoisted(() => {
  // Set env var before route.ts module-level validation
  process.env.SANITY_API_READ_TOKEN = "test-read-token";

  return {
    mockWithConfig: vi.fn().mockReturnValue({ fake: "configured-client" }),
    mockDefineEnableDraftMode: vi.fn().mockReturnValue({ GET: vi.fn() }),
  };
});

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/lib/sanity/client", () => ({
  client: {
    withConfig: (...args: unknown[]) => mockWithConfig(...args),
  },
}));

vi.mock("next-sanity/draft-mode", () => ({
  defineEnableDraftMode: (...args: unknown[]) =>
    mockDefineEnableDraftMode(...args),
}));

// Module is evaluated once when first imported — mocks capture the top-level calls
import { GET } from "./route";

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Draft Mode Enable Route (/api/draft-mode/enable)", () => {
  it("exports a GET handler from defineEnableDraftMode", () => {
    expect(GET).toBeDefined();
  });

  it("calls defineEnableDraftMode with a client object", () => {
    expect(mockDefineEnableDraftMode).toHaveBeenCalledOnce();
    const callArgs = mockDefineEnableDraftMode.mock.calls[0][0];
    expect(callArgs).toHaveProperty("client");
  });

  it("configures the client with SANITY_API_READ_TOKEN", () => {
    expect(mockWithConfig).toHaveBeenCalledOnce();
    expect(mockWithConfig).toHaveBeenCalledWith({
      token: "test-read-token",
    });
  });
});
