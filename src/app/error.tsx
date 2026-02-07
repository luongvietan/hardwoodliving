"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
        Something went wrong
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Unexpected Error
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        We&apos;re sorry, something went wrong on our end. Please try again or
        navigate back to the homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
