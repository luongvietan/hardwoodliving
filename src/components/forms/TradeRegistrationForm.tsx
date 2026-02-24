"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerTrade } from "@/lib/actions/trades";
import type { TradeRegistrationResult } from "@/lib/actions/trades-schema";
import { SubmitButton, FieldError, getFieldError } from "./FormField";

// ---------------------------------------------------------------------------
// Business type options
// ---------------------------------------------------------------------------
const BUSINESS_TYPES = [
  "General Contractor",
  "Flooring Installer",
  "Interior Designer",
  "Architect",
  "Builder / Developer",
  "Property Manager",
  "Renovation Specialist",
  "Other",
] as const;

// ---------------------------------------------------------------------------
// TradeRegistrationForm component
// ---------------------------------------------------------------------------
export default function TradeRegistrationForm() {
  const [state, formAction] = useActionState(registerTrade, null);
  const router = useRouter();

  // Auto-redirect when registration returns a redirectTo (session created)
  useEffect(() => {
    if (state?.success && state.data.redirectTo) {
      router.push(state.data.redirectTo);
    }
  }, [state, router]);

  // Show success state (only when no redirect — i.e. email confirmation required)
  if (state?.success && !state.data.redirectTo) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-green-200 bg-green-50 p-8 text-center"
      >
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-green-800">
          Registration Successful!
        </h3>
        <p className="mt-2 text-sm text-green-700">{state.data.message}</p>
        <Link
          href="/trades/login"
          className="mt-6 inline-block rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition-colors hover:bg-green-50"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Derive error message
  const errorMessage = state && !state.success ? state.error : undefined;

  return (
    <form
      action={formAction}
      aria-label="Trade registration form"
      className="space-y-6"
    >
      {/* Global error message */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* --- Name --- */}
      <div>
        <label
          htmlFor="trade-name"
          className="block text-sm font-medium text-gray-900"
        >
          Full Name <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="trade-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!getFieldError(state, "name")}
          aria-describedby={
            getFieldError(state, "name") ? "trade-name-error" : undefined
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="Your full name"
        />
        <FieldError
          id="trade-name-error"
          message={getFieldError(state, "name")}
        />
      </div>

      {/* --- Company Name --- */}
      <div>
        <label
          htmlFor="trade-company"
          className="block text-sm font-medium text-gray-900"
        >
          Company Name{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="trade-company"
          name="company"
          type="text"
          required
          autoComplete="organization"
          aria-required="true"
          aria-invalid={!!getFieldError(state, "company")}
          aria-describedby={
            getFieldError(state, "company") ? "trade-company-error" : undefined
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="Your company name"
        />
        <FieldError
          id="trade-company-error"
          message={getFieldError(state, "company")}
        />
      </div>

      {/* --- Business Type --- */}
      <div>
        <label
          htmlFor="trade-business-type"
          className="block text-sm font-medium text-gray-900"
        >
          Business Type{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <select
          id="trade-business-type"
          name="business_type"
          required
          aria-required="true"
          aria-invalid={!!getFieldError(state, "business_type")}
          aria-describedby={
            getFieldError(state, "business_type")
              ? "trade-business-type-error"
              : undefined
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
        >
          <option value="">Select your business type</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError
          id="trade-business-type-error"
          message={getFieldError(state, "business_type")}
        />
      </div>

      {/* --- Email + Phone row --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Email */}
        <div>
          <label
            htmlFor="trade-email"
            className="block text-sm font-medium text-gray-900"
          >
            Email{" "}
            <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="trade-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!getFieldError(state, "email")}
            aria-describedby={
              getFieldError(state, "email") ? "trade-email-error" : undefined
            }
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="you@company.com"
          />
          <FieldError
            id="trade-email-error"
            message={getFieldError(state, "email")}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="trade-phone"
            className="block text-sm font-medium text-gray-900"
          >
            Phone
          </label>
          <input
            id="trade-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby={
              getFieldError(state, "phone") ? "trade-phone-error" : undefined
            }
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="(604) 555-0123"
          />
          <FieldError
            id="trade-phone-error"
            message={getFieldError(state, "phone")}
          />
        </div>
      </div>

      {/* --- Password --- */}
      <div>
        <label
          htmlFor="trade-password"
          className="block text-sm font-medium text-gray-900"
        >
          Password{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="trade-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={!!getFieldError(state, "password")}
          aria-describedby={
            getFieldError(state, "password")
              ? "trade-password-error"
              : "trade-password-hint"
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="Minimum 8 characters"
        />
        <p id="trade-password-hint" className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters with uppercase, lowercase, and a number.
        </p>
        <FieldError
          id="trade-password-error"
          message={getFieldError(state, "password")}
        />
      </div>

      {/* --- Submit --- */}
      <div>
        <SubmitButton label="Create Trade Account" pendingLabel="Creating Account…" />
      </div>

      {/* --- Login link --- */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/trades/login"
          className="font-medium text-amber-700 hover:text-amber-600"
        >
          Log in here
        </Link>
      </p>
    </form>
  );
}
