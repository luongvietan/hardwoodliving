import { client } from "./client";
import type { QueryParams } from "next-sanity";

/**
 * Server-side data fetching helper with Next.js caching and Draft Mode support.
 *
 * - In normal mode: uses ISR caching with cache tags for on-demand revalidation.
 * - In Draft Mode (enabled via Presentation Tool): fetches preview drafts without caching.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  // Check if Next.js Draft Mode is active
  let isDraftMode = false;
  try {
    const { draftMode } = await import("next/headers");
    const draft = await draftMode();
    isDraftMode = draft.isEnabled;
  } catch {
    // draftMode() not available (e.g., during static generation or tests)
  }

  if (isDraftMode) {
    // Draft Mode: fetch unpublished content without caching
    return client
      .withConfig({ useCdn: false })
      .fetch<T>(query, params, {
        perspective: "previewDrafts",
        // No caching for draft content
        next: { revalidate: 0 },
      });
  }

  // Normal mode: ISR with cache tags
  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}
