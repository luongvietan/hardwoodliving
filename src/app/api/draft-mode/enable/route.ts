import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

/**
 * Draft Mode Enable Route
 *
 * Used by Sanity Presentation Tool to activate Next.js Draft Mode.
 * When enabled, sanityFetch will use perspective: 'previewDrafts'
 * so editors can preview unpublished content.
 */

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error(
    "Missing environment variable SANITY_API_READ_TOKEN. Required for draft mode."
  );
}

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
