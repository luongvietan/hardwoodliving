/**
 * Visibility helper – Unit tests.
 * Tests the getVisibilityOptions function for different user roles.
 */
import { describe, it, expect, vi } from "vitest";

vi.unmock("@/lib/sanity/visibility");
vi.unmock("./visibility");

describe("getVisibilityOptions", () => {
  it("returns only 'public' for public role", async () => {
    const { getVisibilityOptions } = await import("./visibility");
    const options = getVisibilityOptions("public");
    expect(options).toEqual(["public"]);
  });

  it("returns 'public' and 'wholesale' for trade role", async () => {
    const { getVisibilityOptions } = await import("./visibility");
    const options = getVisibilityOptions("trade");
    expect(options).toEqual(["public", "wholesale"]);
  });

  it("never includes 'hidden' for any role", async () => {
    const { getVisibilityOptions } = await import("./visibility");
    expect(getVisibilityOptions("public")).not.toContain("hidden");
    expect(getVisibilityOptions("trade")).not.toContain("hidden");
  });
});

describe("getUserRole", () => {
  it("returns trade when supabase user exists", async () => {
    const { getUserRole } = await import("./visibility");
    const role = await getUserRole(undefined, "trade");
    expect(role).toBe("trade");
  });

  it("returns public when user exists without trade role", async () => {
    const mockClient = {
      auth: {
        getUser: async () => ({ data: { user: { id: "user-2" } } }),
      },
    };

    const { getUserRole } = await import("./visibility");
    const role = await getUserRole(mockClient);
    expect(role).toBe("public");
  });

  it("returns public when supabase returns no user", async () => {
    const mockClient = {
      auth: {
        getUser: async () => ({ data: { user: null } }),
      },
    };

    const { getUserRole } = await import("./visibility");
    const role = await getUserRole(mockClient);
    expect(role).toBe("public");
  });

  it("returns public when supabase throws", async () => {
    const mockClient = {
      auth: {
        getUser: async () => {
          throw new Error("boom");
        },
      },
    };

    const { getUserRole } = await import("./visibility");
    const role = await getUserRole(mockClient);
    expect(role).toBe("public");
  });
});
