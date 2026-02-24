"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginTrade } from "@/lib/actions/trades";
import type { TradeLoginResult } from "@/lib/actions/trades-schema";
import { SubmitButton, FieldError, getFieldError } from "./FormField";

// ---------------------------------------------------------------------------
// TradeLoginForm component
// ---------------------------------------------------------------------------
export default function TradeLoginForm() {
  const [state, formAction] = useActionState(loginTrade, null);
  const router = useRouter();

  // Redirect on successful login
  useEffect(() => {
    if (state?.success) {
      router.push(state.data.redirectTo);
    }
  }, [state, router]);

  // Derive error message
  const errorMessage = state && !state.success ? state.error : undefined;

  return (
    <form
      action={formAction}
      aria-label="Trade login form"
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

      {/* --- Email --- */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!getFieldError(state, "email")}
          aria-describedby={
            getFieldError(state, "email") ? "login-email-error" : undefined
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="you@company.com"
        />
        <FieldError
          id="login-email-error"
          message={getFieldError(state, "email")}
        />
      </div>

      {/* --- Password --- */}
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-900"
        >
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={!!getFieldError(state, "password")}
          aria-describedby={
            getFieldError(state, "password")
              ? "login-password-error"
              : undefined
          }
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="Your password"
        />
        <FieldError
          id="login-password-error"
          message={getFieldError(state, "password")}
        />
      </div>

      {/* --- Submit --- */}
      <div>
        <SubmitButton label="Sign In" pendingLabel="Signing in…" />
      </div>

      {/* --- Register link --- */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/trades/register"
          className="font-medium text-amber-700 hover:text-amber-600"
        >
          Register here
        </Link>
      </p>
    </form>
  );
}
