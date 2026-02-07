"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          We couldn&apos;t load your dashboard. This might be a temporary issue.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Try Again
          </button>
          <Link
            href="/trades"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Back to Trade Program
          </Link>
        </div>
      </div>
    </Container>
  );
}
