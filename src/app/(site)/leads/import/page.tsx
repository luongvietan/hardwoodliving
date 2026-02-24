import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/isAdmin";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getAllCategoriesQuery } from "@/lib/sanity/queries";
import ImportTable from "./ImportTable";

export const metadata: Metadata = {
  title: "Import Products | Hardwood Living",
  description: "Bulk import products into Sanity from a spreadsheet or CSV file.",
};

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  parent?: { _id: string; title: string } | null;
}

export default async function ImportProductsPage() {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/trades/login");
  if (!isAdmin(user)) redirect("/trades/dashboard");

  // ── Fetch categories for the dropdown ──────────────────────────────────
  const allCategories = await sanityFetch<Category[] | null>({
    query: getAllCategoriesQuery,
    tags: ["category"],
  });

  const categories = (allCategories ?? []).map((c) => ({
    _id: c._id,
    title: c.parent ? `${c.parent.title} › ${c.title}` : c.title,
  }));

  return (
    <Container className="py-10">
      {/* ── Page header ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/leads" className="hover:text-accent-orange">
              Admin
            </Link>
            <span>/</span>
            <span className="text-gray-900">Import Products</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Import Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter products manually or upload a CSV file. All rows are saved to
            Sanity in one click.
          </p>
        </div>

        {/* Admin nav links */}
        <div className="flex items-center gap-2">
          <Link
            href="/leads"
            className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            Leads
          </Link>
          <span className="rounded border border-accent-orange bg-orange-50 px-3 py-1.5 text-sm font-medium text-accent-orange">
            Import
          </span>
          <Link
            href="/admin"
            className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            Studio
          </Link>
        </div>
      </div>

      {/* ── Tips banner ── */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>Tips:</strong> Download the CSV template to see all available
        columns. Drag &amp; drop a filled CSV to load rows instantly. The{" "}
        <strong>Specs</strong> button per row (or &ldquo;Show Specs Columns&rdquo;) exposes
        all 25 product specification fields.
      </div>

      {/* ── Spreadsheet UI ── */}
      <ImportTable categories={categories} />
    </Container>
  );
}
