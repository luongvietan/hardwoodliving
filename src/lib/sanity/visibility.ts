/**
 * Product visibility helper.
 * Determines which visibility levels a user can see based on authentication status.
 *
 * - Public (unauthenticated): can only see "public" products
 * - Trade (authenticated): can see "public" and "wholesale" products
 * - Hidden products are never shown on the public site
 */

export type UserRole = "public" | "trade";

/**
 * Returns the visibility options array for GROQ queries based on user role.
 */
export function getVisibilityOptions(role: UserRole): string[] {
  if (role === "trade") {
    return ["public", "wholesale"];
  }
  return ["public"];
}

/**
 * Determines user role from authentication state.
 * Attempts to check Supabase auth; defaults to "public" if auth is unavailable.
 */
export async function getUserRole(
  supabaseClient?: { auth: { getUser: () => Promise<{ data: { user: { app_metadata?: { role?: string }; user_metadata?: { role?: string } } | null } }> } },
  roleOverride?: UserRole
): Promise<UserRole> {
  try {
    if (roleOverride) {
      return roleOverride;
    }

    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getUser();
      const user = data?.user;
      const role = user?.app_metadata?.role || user?.user_metadata?.role;
      if (role === "trade") {
        return "trade";
      }
      return "public";
    }

    // Dynamic import to avoid breaking when Supabase is not configured
    const supabase = await (await import("@/lib/supabase/server")).createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    const role = user?.app_metadata?.role || user?.user_metadata?.role;
    if (role === "trade") {
      return "trade";
    }
  } catch {
    // Supabase not configured or auth check failed - default to public
  }

  return "public";
}
