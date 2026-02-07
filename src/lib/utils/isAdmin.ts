import type { User } from "@supabase/supabase-js";

/**
 * Check if a Supabase Auth user has admin privileges.
 *
 * Compares the user's email against the ADMIN_EMAILS environment variable
 * (comma-separated list of admin email addresses).
 *
 * Falls back to app_metadata.role === "admin" if available.
 */
export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;

  // Check against environment variable (comma-separated emails)
  const adminEmails = process.env.ADMIN_EMAILS;
  if (adminEmails) {
    const emails = adminEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (emails.includes(user.email.toLowerCase())) {
      return true;
    }
  }

  // Fallback: check Supabase user metadata for admin role
  if (user.app_metadata?.role === "admin") {
    return true;
  }

  return false;
}
