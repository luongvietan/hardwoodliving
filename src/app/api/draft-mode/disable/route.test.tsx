/**
 * Draft Mode Disable Route Tests
 *
 * Verifies the /api/draft-mode/disable endpoint correctly
 * disables Next.js Draft Mode.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Use vi.hoisted so the fn is available when vi.mock factory runs (hoisted)
const { mockDisable } = vi.hoisted(() => ({
  mockDisable: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn().mockResolvedValue({
    isEnabled: true,
    disable: mockDisable,
  }),
}));

import { GET } from "./route";

// ── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/draft-mode/disable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls draftMode().disable()", async () => {
    const res = await GET();
    expect(mockDisable).toHaveBeenCalledOnce();
  });

  it("returns JSON response confirming draft mode is disabled", async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe("Draft mode disabled");
  });

  it("returns 200 status code", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });
});
