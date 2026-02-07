/**
 * Supabase middleware – Unit tests for route protection and session refresh.
 *
 * Tests that protected routes redirect unauthenticated users,
 * public routes are accessible, and authenticated users are redirected
 * away from auth pages.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateSession } from "./middleware";

// ── Mock setup ───────────────────────────────────────────────────────────────

const mockGetUser = vi.fn();

// Mock NextResponse
const mockRedirect = vi.fn();
const mockNextResponse = {
  cookies: {
    set: vi.fn(),
  },
};

vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(() => mockNextResponse),
    redirect: (...args: unknown[]) => {
      mockRedirect(...args);
      return { redirected: true, cookies: { set: vi.fn() } };
    },
  },
}));

// Mock Supabase SSR
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: () => mockGetUser(),
    },
  })),
}));

// ── Helper: create mock NextRequest ──────────────────────────────────────────

function createMockRequest(pathname: string) {
  const url = new URL(`http://localhost:3000${pathname}`);
  return {
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone: () => ({
        pathname: "",
        toString: () => url.toString(),
      }),
    },
  } as unknown as Parameters<typeof updateSession>[0];
}

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockGetUser.mockReset();
  mockRedirect.mockReset();

  // Set env vars
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("updateSession", () => {
  // ── Public routes ──────────────────────────────────────────────────────

  it("allows unauthenticated access to public routes", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = createMockRequest("/");

    const response = await updateSession(request);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(response).toBe(mockNextResponse);
  });

  it("allows unauthenticated access to /trades page", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = createMockRequest("/trades");

    const response = await updateSession(request);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(response).toBe(mockNextResponse);
  });

  it("allows unauthenticated access to /products page", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = createMockRequest("/products");

    const response = await updateSession(request);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(response).toBe(mockNextResponse);
  });

  // ── Protected routes ───────────────────────────────────────────────────

  it("redirects unauthenticated users from /trades/dashboard to /trades/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = createMockRequest("/trades/dashboard");

    await updateSession(request);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectArg = mockRedirect.mock.calls[0][0];
    expect(redirectArg.pathname).toBe("/trades/login");
  });

  it("redirects unauthenticated users from /trades/dashboard/settings to /trades/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = createMockRequest("/trades/dashboard/settings");

    await updateSession(request);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectArg = mockRedirect.mock.calls[0][0];
    expect(redirectArg.pathname).toBe("/trades/login");
  });

  it("allows authenticated users to access /trades/dashboard", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } } });
    const request = createMockRequest("/trades/dashboard");

    const response = await updateSession(request);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(response).toBe(mockNextResponse);
  });

  // ── Auth page redirects for logged-in users ────────────────────────────

  it("redirects authenticated users from /trades/login to /trades/dashboard", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } } });
    const request = createMockRequest("/trades/login");

    await updateSession(request);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectArg = mockRedirect.mock.calls[0][0];
    expect(redirectArg.pathname).toBe("/trades/dashboard");
  });

  it("redirects authenticated users from /trades/register to /trades/dashboard", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-123" } } });
    const request = createMockRequest("/trades/register");

    await updateSession(request);

    expect(mockRedirect).toHaveBeenCalled();
    const redirectArg = mockRedirect.mock.calls[0][0];
    expect(redirectArg.pathname).toBe("/trades/dashboard");
  });

  // ── Environment variable checks ───────────────────────────────────────

  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const request = createMockRequest("/");

    await expect(updateSession(request)).rejects.toThrow(
      "Missing env.NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const request = createMockRequest("/");

    await expect(updateSession(request)).rejects.toThrow(
      "Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });
});
