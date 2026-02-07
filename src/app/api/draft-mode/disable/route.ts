import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Draft Mode Disable Route
 *
 * Disables Next.js Draft Mode so the site returns to serving
 * published (cached) content.
 */
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.json({ status: "Draft mode disabled" });
}
