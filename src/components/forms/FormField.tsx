"use client";

import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/types/actions";

// ---------------------------------------------------------------------------
// SubmitButton — shared submit button with pending state
// ---------------------------------------------------------------------------
export function SubmitButton({
  label = "Submit",
  pendingLabel = "Submitting…",
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="min-h-[44px] w-full rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// FieldError — displays a single field validation error
// ---------------------------------------------------------------------------
export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// getFieldError — extracts the first error for a given field from ActionResult
// ---------------------------------------------------------------------------
export function getFieldError<T>(
  state: ActionResult<T> | null,
  field: string,
): string | undefined {
  if (!state || state.success) return undefined;
  return state.fieldErrors?.[field]?.[0];
}
