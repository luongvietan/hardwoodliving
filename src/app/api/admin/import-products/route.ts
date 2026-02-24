import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSanityClient } from "next-sanity";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/isAdmin";
import { rowToSanityDoc, type ImportRow, type SanityImageRef } from "@/lib/sanity/import";

// ─── Sanity write client (server-only) ───────────────────────────────────────

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN env vars."
    );
  }

  return createSanityClient({
    projectId,
    dataset,
    apiVersion: "2024-02-07",
    token,
    useCdn: false,
  });
}

// ─── Image helpers ────────────────────────────────────────────────────────────

/** Download a remote URL into a Buffer, following up to 5 redirects. */
async function fetchBuffer(
  url: string,
  redirectsLeft = 5
): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  };
}

function filenameFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const base = pathname.split("/").pop() ?? "image";
    return base.split("?")[0] || "image";
  } catch {
    return "image";
  }
}

async function uploadImageUrl(
  sanity: ReturnType<typeof getSanityWriteClient>,
  url: string,
  key: string
): Promise<SanityImageRef | null> {
  try {
    const { buffer, contentType } = await fetchBuffer(url);
    const asset = await sanity.assets.upload("image", buffer, {
      filename: filenameFromUrl(url),
      contentType,
    });
    return {
      _type: "image",
      _key: key,
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    console.warn(`[import] Failed to upload image URL "${url}":`, err);
    return null;
  }
}

async function uploadImageFile(
  sanity: ReturnType<typeof getSanityWriteClient>,
  file: File,
  key: string
): Promise<SanityImageRef | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await sanity.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type || "image/jpeg",
    });
    return {
      _type: "image",
      _key: key,
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    console.warn(`[import] Failed to upload image file "${file.name}":`, err);
    return null;
  }
}

// ─── Result type ──────────────────────────────────────────────────────────────

export interface ImportResult {
  index: number;
  title: string;
  success: boolean;
  error?: string;
  imageCount?: number;
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth check — server-side, always
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const rowsJson = formData.get("rows");
  if (!rowsJson || typeof rowsJson !== "string") {
    return NextResponse.json({ error: "Missing rows field" }, { status: 400 });
  }

  let rows: ImportRow[];
  try {
    rows = JSON.parse(rowsJson);
  } catch {
    return NextResponse.json({ error: "Invalid rows JSON" }, { status: 400 });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows to import" }, { status: 400 });
  }

  // 3. Get Sanity write client
  let sanity: ReturnType<typeof getSanityWriteClient>;
  try {
    sanity = getSanityWriteClient();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sanity config error" },
      { status: 500 }
    );
  }

  // 4. Process each row
  const results: ImportResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = row.title?.trim() || `Row ${i + 1}`;

    try {
      // Collect image refs from all sources
      const imageRefs: SanityImageRef[] = [];
      let imgIdx = 0;

      // 4a. Upload file images (sent as form fields: images[rowIndex][fileIndex])
      let fileIdx = 0;
      while (true) {
        const fileField = formData.get(`images[${i}][${fileIdx}]`);
        if (!fileField) break;
        if (fileField instanceof File && fileField.size > 0) {
          const ref = await uploadImageFile(sanity, fileField, `img-${imgIdx}`);
          if (ref) {
            imageRefs.push(ref);
            imgIdx++;
          }
        }
        fileIdx++;
      }

      // 4b. Upload URL images (pipe-separated in row.imageUrls)
      if (row.imageUrls?.trim()) {
        const urls = row.imageUrls
          .split("|")
          .map((u) => u.trim())
          .filter((u) => u.startsWith("http"));

        for (const url of urls) {
          const ref = await uploadImageUrl(sanity, url, `img-${imgIdx}`);
          if (ref) {
            imageRefs.push(ref);
            imgIdx++;
          }
        }
      }

      // 4c. Build and write Sanity document
      const doc = rowToSanityDoc(row, imageRefs);
      if (!doc) {
        results.push({
          index: i,
          title,
          success: false,
          error: "Invalid row: missing title or price",
        });
        continue;
      }

      await sanity.createOrReplace(doc);

      results.push({
        index: i,
        title: doc.title,
        success: true,
        imageCount: imageRefs.length,
      });
    } catch (err) {
      results.push({
        index: i,
        title,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 5. Revalidate product cache
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (revalidateTag as any)("product");

  const successCount = results.filter((r) => r.success).length;
  return NextResponse.json({ results, successCount, total: rows.length });
}
