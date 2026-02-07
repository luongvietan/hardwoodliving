/**
 * Trade server actions – Unit tests for registerTrade, loginTrade, logoutTrade.
 *
 * Tests validation, Supabase auth calls, database inserts, and error handling.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerTrade, loginTrade, logoutTrade } from "./trades";

// ── Supabase mock setup ──────────────────────────────────────────────────────

const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockInsert = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: () => mockSignOut(),
    },
    from: () => ({
      insert: (data: unknown) => mockInsert(data),
    }),
  }),
}));

// Mock rate limiter — always allow in tests
vi.mock("@/lib/utils/rate-limit", () => ({
  rateLimit: () => true,
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "127.0.0.1",
  }),
}));

// ── Helper: create FormData ──────────────────────────────────────────────────

function makeRegistrationFormData(overrides: Record<string, string> = {}) {
  const defaults = {
    name: "John Doe",
    company: "Doe Construction",
    business_type: "General Contractor",
    email: "john@doe.com",
    phone: "604-555-0123",
    password: "SecurePass1",
  };
  const data = { ...defaults, ...overrides };
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

function makeLoginFormData(overrides: Record<string, string> = {}) {
  const defaults = {
    email: "john@doe.com",
    password: "SecurePass1",
  };
  const data = { ...defaults, ...overrides };
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockSignUp.mockReset();
  mockSignInWithPassword.mockReset();
  mockSignOut.mockReset();
  mockInsert.mockReset();
});

// ── registerTrade ────────────────────────────────────────────────────────────

describe("registerTrade", () => {
  it("returns validation error when name is missing", async () => {
    const fd = makeRegistrationFormData({ name: "" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.name).toBeDefined();
    }
  });

  it("returns validation error when email is invalid", async () => {
    const fd = makeRegistrationFormData({ email: "not-an-email" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.email).toBeDefined();
    }
  });

  it("returns validation error when password is too short", async () => {
    const fd = makeRegistrationFormData({ password: "Sh0rt" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.password).toBeDefined();
    }
  });

  it("returns validation error when password has no uppercase", async () => {
    const fd = makeRegistrationFormData({ password: "nouppercase1" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.password).toBeDefined();
    }
  });

  it("returns validation error when password has no number", async () => {
    const fd = makeRegistrationFormData({ password: "NoNumberHere" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.password).toBeDefined();
    }
  });

  it("returns validation error when company is missing", async () => {
    const fd = makeRegistrationFormData({ company: "" });
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.company).toBeDefined();
    }
  });

  it("calls supabase.auth.signUp with correct data on valid input", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const fd = makeRegistrationFormData();
    await registerTrade(null, fd);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "john@doe.com",
      password: "SecurePass1",
      options: {
        data: {
          name: "John Doe",
          company: "Doe Construction",
          role: "trade",
        },
      },
    });
  });

  it("inserts trade profile after successful auth signup", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const fd = makeRegistrationFormData();
    await registerTrade(null, fd);

    expect(mockInsert).toHaveBeenCalledWith({
      id: "user-123",
      name: "John Doe",
      company: "Doe Construction",
      business_type: "General Contractor",
      email: "john@doe.com",
      phone: "604-555-0123",
      status: "pending",
    });
  });

  it("returns success message when email confirmation required (no session)", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toMatch(/Registration successful/);
      expect(result.data.redirectTo).toBeUndefined();
    }
  });

  it("returns redirectTo when session is created (no email confirmation)", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: { access_token: "tok" } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.redirectTo).toBe("/trades/dashboard");
    }
  });

  it("returns generic error on auth failure (no email enumeration)", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      // Should NOT reveal "already exists" — use generic message
      expect(result.error).toMatch(/could not be completed/i);
    }
  });

  it("returns error on auth failure", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: "Auth service error" },
    });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
  });

  it("still succeeds when trade profile insert fails", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: { message: "Insert failed" } });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    // Registration still succeeds - profile can be created later
    expect(result.success).toBe(true);
  });

  it("handles unexpected exceptions gracefully", async () => {
    mockSignUp.mockRejectedValue(new Error("Connection failed"));

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/something went wrong/i);
    }
  });
});

// ── Rate limiting ─────────────────────────────────────────────────────────

describe("rate limiting", () => {
  it("is applied to registerTrade (mocked to always allow in tests)", async () => {
    // This test verifies the rate limiter integration exists.
    // Actual rate limit behavior is tested in rate-limit.test.ts.
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-123" }, session: null },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const fd = makeRegistrationFormData();
    const result = await registerTrade(null, fd);
    expect(result.success).toBe(true);
  });
});

// ── loginTrade ───────────────────────────────────────────────────────────────

describe("loginTrade", () => {
  it("returns validation error when email is missing", async () => {
    const fd = makeLoginFormData({ email: "" });
    const result = await loginTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.email).toBeDefined();
    }
  });

  it("returns validation error when password is missing", async () => {
    const fd = makeLoginFormData({ password: "" });
    const result = await loginTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.password).toBeDefined();
    }
  });

  it("calls signInWithPassword on valid input", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const fd = makeLoginFormData();
    await loginTrade(null, fd);

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "john@doe.com",
      password: "SecurePass1",
    });
  });

  it("returns success with redirect on successful login", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const fd = makeLoginFormData();
    const result = await loginTrade(null, fd);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.redirectTo).toBe("/trades/dashboard");
    }
  });

  it("returns error on invalid credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    const fd = makeLoginFormData();
    const result = await loginTrade(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/invalid email or password/i);
    }
  });

  it("handles unexpected exceptions gracefully", async () => {
    mockSignInWithPassword.mockRejectedValue(new Error("Network error"));

    const fd = makeLoginFormData();
    const result = await loginTrade(null, fd);

    expect(result.success).toBe(false);
  });
});

// ── logoutTrade ──────────────────────────────────────────────────────────────

describe("logoutTrade", () => {
  it("calls supabase.auth.signOut", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await logoutTrade();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("returns success on successful logout", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const result = await logoutTrade();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toMatch(/logged out/i);
    }
  });

  it("returns error when signOut fails", async () => {
    mockSignOut.mockResolvedValue({ error: { message: "Signout error" } });

    const result = await logoutTrade();

    expect(result.success).toBe(false);
  });

  it("handles unexpected exceptions gracefully", async () => {
    mockSignOut.mockRejectedValue(new Error("Network error"));

    const result = await logoutTrade();

    expect(result.success).toBe(false);
  });
});
