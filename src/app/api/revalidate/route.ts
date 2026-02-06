import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sanity webhook revalidation endpoint.
 * Revalidates Next.js cache tags when content changes in Sanity.
 * 
 * Configure a Sanity webhook with:
 * - URL: https://your-domain.com/api/revalidate
 * - Secret: SANITY_REVALIDATE_SECRET
 * - Projection: { _type }
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  // Validate secret
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?._type;

    if (!type) {
      return NextResponse.json({ message: "Missing _type in body" }, { status: 400 });
    }

    // Map Sanity document types to cache tags
    const tagMap: Record<string, string[]> = {
      homepage: ["homepage"],
      siteSettings: ["siteSettings"],
      product: ["product"],
      category: ["category"],
      page: ["page"],
      testimonial: ["homepage"], // testimonials appear on homepage
    };

    const tags = tagMap[type] || [type];

    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
