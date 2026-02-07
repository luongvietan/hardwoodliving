import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity Webhook Revalidation Endpoint
 *
 * Receives webhook notifications from Sanity when content is published,
 * validates the signature, and revalidates the corresponding Next.js cache tags.
 *
 * ## Webhook Setup (Sanity Dashboard)
 * 1. Go to: sanity.io/manage → Project → API → Webhooks
 * 2. Create new webhook with:
 *    - Name: "Next.js Revalidation"
 *    - URL: https://your-domain.com/api/revalidate
 *    - Trigger on: Create, Update, Delete
 *    - Filter: (leave empty for all types, or use _type in ["product", "category", "page", "homepage", "siteSettings", "testimonial"])
 *    - Projection: {_type, "slug": slug.current}
 *    - Secret: (copy from SANITY_REVALIDATE_SECRET in your .env)
 *    - Enable webhook signature verification
 */

type WebhookPayload = {
  _type: string;
  slug?: string;
};

// Map Sanity document types to Next.js cache tags
const TAG_MAP: Record<string, string[]> = {
  product: ["product"],
  category: ["category"],
  page: ["page"],
  homepage: ["homepage"],
  siteSettings: ["siteSettings"],
  testimonial: ["homepage"], // testimonials appear on homepage
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        "Missing environment variable SANITY_REVALIDATE_SECRET",
        { status: 500 }
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ message: "Invalid signature", isValidSignature }),
        { status: 401 }
      );
    }

    if (!body?._type) {
      return new Response(
        JSON.stringify({ message: "Bad Request: missing _type", body }),
        { status: 400 }
      );
    }

    // Determine which cache tags to revalidate
    const tags = TAG_MAP[body._type] || [body._type];

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    });
  } catch (err: unknown) {
    console.error("Revalidation error:", err);
    return new Response(
      JSON.stringify({ message: "Error revalidating", error: String(err) }),
      { status: 500 }
    );
  }
}
