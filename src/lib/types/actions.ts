// ---------------------------------------------------------------------------
// Standard Server Action response type — used by ALL Server Actions.
// Architecture: discriminated union for type-safe success/error narrowing.
// ---------------------------------------------------------------------------

/**
 * Standard response shape for all Server Actions.
 *
 * Usage:
 *   - `ActionResult<{ message: string }>` — action that returns a success message
 *   - `ActionResult<Product>` — action that returns a created/updated resource
 *   - `ActionResult<null>` — action with no meaningful success payload
 *
 * TypeScript narrows automatically:
 *   if (result.success) { result.data } else { result.error, result.fieldErrors }
 */
export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
