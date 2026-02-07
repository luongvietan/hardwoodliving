"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm } from "@/lib/actions/contact";
import type { ContactActionResult } from "@/lib/actions/contact";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ContactFormProps {
  /** Pre-fill the product interest field (e.g. from product detail page). */
  defaultProductInterest?: string;
}

// ---------------------------------------------------------------------------
// Room type options
// ---------------------------------------------------------------------------
const ROOM_TYPES = [
  "",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Hallway",
  "Dining Room",
  "Basement",
  "Commercial Space",
  "Other",
] as const;

// ---------------------------------------------------------------------------
// Budget range options
// ---------------------------------------------------------------------------
const BUDGET_RANGES = [
  "",
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $30,000",
  "Over $30,000",
  "Not sure yet",
] as const;

// ---------------------------------------------------------------------------
// Submit button (needs its own component for useFormStatus)
// ---------------------------------------------------------------------------
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="min-h-[44px] min-w-[44px] rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Send Inquiry"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Field error display
// ---------------------------------------------------------------------------
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Helper: extract first field error from discriminated union state
// ---------------------------------------------------------------------------
function getFieldError(
  state: ContactActionResult | null,
  field: string,
): string | undefined {
  if (!state || state.success) return undefined;
  return state.fieldErrors?.[field]?.[0];
}

// ---------------------------------------------------------------------------
// ContactForm component
// ---------------------------------------------------------------------------
export default function ContactForm({ defaultProductInterest = "" }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContactForm, null);

  // Show success state
  if (state?.success) {
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
        <h3 className="mt-4 text-lg font-semibold text-green-800">Inquiry Submitted!</h3>
        <p className="mt-2 text-sm text-green-700">{state.data.message}</p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition-colors hover:bg-green-50"
        >
          Submit Another Inquiry
        </a>
      </div>
    );
  }

  // Derive error message and field errors from discriminated union
  const errorMessage = state && !state.success ? state.error : undefined;

  return (
    <form action={formAction} aria-label="Contact consultation form" className="space-y-6">
      {/* Global error message */}
      {errorMessage && (
        <div role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* --- Row 1: Name + Email --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-900">
            Name <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!getFieldError(state, "name")}
            aria-describedby={getFieldError(state, "name") ? "contact-name-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="Your full name"
          />
          <FieldError id="contact-name-error" message={getFieldError(state, "name")} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-900">
            Email <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!getFieldError(state, "email")}
            aria-describedby={getFieldError(state, "email") ? "contact-email-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="you@example.com"
          />
          <FieldError id="contact-email-error" message={getFieldError(state, "email")} />
        </div>
      </div>

      {/* --- Row 2: Phone + Product Interest --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Phone */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-900">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby={getFieldError(state, "phone") ? "contact-phone-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="(604) 555-0123"
          />
          <FieldError id="contact-phone-error" message={getFieldError(state, "phone")} />
        </div>

        {/* Product Interest */}
        <div>
          <label htmlFor="contact-product-interest" className="block text-sm font-medium text-gray-900">
            Product Interest
          </label>
          <input
            id="contact-product-interest"
            name="product_interest"
            type="text"
            defaultValue={defaultProductInterest}
            aria-describedby={getFieldError(state, "product_interest") ? "contact-product-interest-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="e.g., Oak flooring, Maple cabinetry"
          />
          <FieldError id="contact-product-interest-error" message={getFieldError(state, "product_interest")} />
        </div>
      </div>

      {/* --- Row 3: Room Type + Area --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Room Type */}
        <div>
          <label htmlFor="contact-room-type" className="block text-sm font-medium text-gray-900">
            Room Type
          </label>
          <select
            id="contact-room-type"
            name="room_type"
            aria-describedby={getFieldError(state, "room_type") ? "contact-room-type-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          >
            <option value="">Select a room type</option>
            {ROOM_TYPES.filter(Boolean).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="contact-room-type-error" message={getFieldError(state, "room_type")} />
        </div>

        {/* Area */}
        <div>
          <label htmlFor="contact-area" className="block text-sm font-medium text-gray-900">
            Area (sq ft)
          </label>
          <input
            id="contact-area"
            name="area"
            type="text"
            aria-describedby={getFieldError(state, "area") ? "contact-area-error" : undefined}
            className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
            placeholder="e.g., 500"
          />
          <FieldError id="contact-area-error" message={getFieldError(state, "area")} />
        </div>
      </div>

      {/* --- Row 4: Budget --- */}
      <div>
        <label htmlFor="contact-budget" className="block text-sm font-medium text-gray-900">
          Budget
        </label>
        <select
          id="contact-budget"
          name="budget"
          aria-describedby={getFieldError(state, "budget") ? "contact-budget-error" : undefined}
          className="mt-1 block w-full min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
        >
          <option value="">Select a budget range</option>
          {BUDGET_RANGES.filter(Boolean).map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <FieldError id="contact-budget-error" message={getFieldError(state, "budget")} />
      </div>

      {/* --- Row 5: Message --- */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-900">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          aria-describedby={getFieldError(state, "message") ? "contact-message-error" : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm"
          placeholder="Tell us about your project — the more details, the better we can help!"
        />
        <FieldError id="contact-message-error" message={getFieldError(state, "message")} />
      </div>

      {/* --- Submit --- */}
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
