import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import TradeLoginForm from "@/components/forms/TradeLoginForm";

export const metadata: Metadata = {
  title: "Login | Trade Program | Hardwood Living",
  description:
    "Log in to your trade account to access wholesale pricing and your trade dashboard.",
};

export default function TradeLoginPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Trade Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your trade dashboard and wholesale pricing.
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <TradeLoginForm />
        </div>

        {/* Back to trades link */}
        <div className="mt-8 text-center">
          <Link
            href="/trades"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to Trade Program
          </Link>
        </div>
      </div>
    </Container>
  );
}
