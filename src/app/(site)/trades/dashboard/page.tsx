import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Trade Dashboard | Hardwood Living",
  description: "Your trade account dashboard with wholesale pricing and order management.",
};

export default async function TradeDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/trades/login");
  }

  // Fetch trade profile
  const { data: tradeProfile } = await supabase
    .from("trades")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = tradeProfile?.name || user.user_metadata?.name || user.email;
  const companyName = tradeProfile?.company || user.user_metadata?.company || "Your Company";

  return (
    <Container className="py-16">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Trade Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {userName}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Profile Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Account Information
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{userName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Company</dt>
            <dd className="mt-1 text-sm text-gray-900">{companyName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          {tradeProfile?.business_type && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Business Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {tradeProfile.business_type}
              </dd>
            </div>
          )}
          {tradeProfile?.status && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Account Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tradeProfile.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : tradeProfile.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tradeProfile.status.charAt(0).toUpperCase() +
                    tradeProfile.status.slice(1)}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/products"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Browse Products
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            View our full catalog including wholesale products.
          </p>
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Contact Support
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Get in touch with our trade support team.
          </p>
        </Link>
      </div>
    </Container>
  );
}
