import { client } from "./client";
import type { QueryParams } from "next-sanity";

/**
 * Server-side data fetching helper with Next.js caching.
 * Revalidates every 60 seconds (ISR) by default.
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
  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}
