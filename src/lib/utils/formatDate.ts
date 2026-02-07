/**
 * Format an ISO date string to a human-readable locale date.
 * Uses en-AU locale (e.g. "15 Jan 2026").
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
