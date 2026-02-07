import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import TradeRegistrationForm from "@/components/forms/TradeRegistrationForm";

export const metadata: Metadata = {
  title: "Register | Trade Program | Hardwood Living",
  description:
    "Register for a trade account to access wholesale pricing, dedicated support, and exclusive products.",
};

export default function TradeRegisterPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Trade Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form below to register for a trade account and access
            wholesale pricing.
          </p>
        </div>

        {/* Registration Form */}
        <div className="mt-8">
          <TradeRegistrationForm />
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
