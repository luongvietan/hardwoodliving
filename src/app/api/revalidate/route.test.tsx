/**
 * Revalidate API Route Tests
 *
 * Tests the webhook revalidation endpoint that Sanity calls
 * when content is published. Verifies signature validation,
 * tag mapping, and error handling.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockRevalidateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}));

const mockParseBody = vi.fn();
vi.mock("next-sanity/webhook", () => ({
  parseBody: (...args: unknown[]) => mockParseBody(...args),
}));

import { POST } from "./route";

// ── Helpers ──────────────────────────────────────────────────────────────────

function createMockRequest(body: Record<string, unknown> = {}): Request {
  return new Request("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as Request;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/revalidate", () => {
  const originalEnv = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = originalEnv;
  });

  it("returns 500 when SANITY_REVALIDATE_SECRET is missing", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const req = createMockRequest();
    const res = await POST(req as never);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toContain("SANITY_REVALIDATE_SECRET");
  });

  it("returns 401 when signature is invalid", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: false,
      body: { _type: "product" },
    });
    const req = createMockRequest({ _type: "product" });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Invalid signature");
  });

  it("returns 400 when _type is missing from body", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: true,
      body: {},
    });
    const req = createMockRequest({});
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain("missing _type");
  });

  it("revalidates correct tags for product type", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: true,
      body: { _type: "product" },
    });
    const req = createMockRequest({ _type: "product" });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(["product"]);
    expect(mockRevalidateTag).toHaveBeenCalledWith("product", "max");
  });

  it("revalidates homepage tag for testimonial type", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: true,
      body: { _type: "testimonial" },
    });
    const req = createMockRequest({ _type: "testimonial" });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tags).toEqual(["homepage"]);
    expect(mockRevalidateTag).toHaveBeenCalledWith("homepage", "max");
  });

  it("revalidates siteSettings tag correctly", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: true,
      body: { _type: "siteSettings" },
    });
    const req = createMockRequest({ _type: "siteSettings" });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tags).toEqual(["siteSettings"]);
  });

  it("falls back to _type as tag for unknown types", async () => {
    mockParseBody.mockResolvedValueOnce({
      isValidSignature: true,
      body: { _type: "customType" },
    });
    const req = createMockRequest({ _type: "customType" });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tags).toEqual(["customType"]);
    expect(mockRevalidateTag).toHaveBeenCalledWith("customType", "max");
  });

  it("returns 500 on unexpected errors", async () => {
    mockParseBody.mockRejectedValueOnce(new Error("Parse failed"));
    const req = createMockRequest();
    const res = await POST(req as never);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Error revalidating");
  });
});
