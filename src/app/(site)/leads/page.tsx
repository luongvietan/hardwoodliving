import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/isAdmin";
import InquiriesSection from "@/components/admin/InquiriesSection";
import TradesSection from "@/components/admin/TradesSection";

export const metadata: Metadata = {
  title: "Leads Management | Hardwood Living",
  description:
    "Admin view for managing contact inquiries and trade registrations.",
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/trades/login");
  }

  // Admin authorization check
  if (!isAdmin(user)) {
    redirect("/trades/dashboard");
  }

  // Fetch inquiries (newest first - default sort)
  const { data: inquiries, error: inquiriesError } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch trades (newest first - default sort)
  const { data: trades, error: tradesError } = await supabase
    .from("trades")
    .select("*")
    .order("created_at", { ascending: false });

  const hasError = inquiriesError || tradesError;

  return (
    <Container className="py-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Leads Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage contact inquiries and trade registrations.
        </p>
      </div>

      {/* Error banner */}
      {hasError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Some data could not be loaded. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Inquiries with filtering and export */}
      <InquiriesSection inquiries={inquiries ?? []} />

      {/* Trades with filtering and export */}
      <TradesSection trades={trades ?? []} />
    </Container>
  );
}
