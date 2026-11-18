"use client";

import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type Result<T> = { ok: true; data: T; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Applies a server action result to a form: shows a toast, and maps server-side
 * field errors back onto the matching inputs. Returns the data on success, otherwise null.
 */
export function handleActionResult<T, F extends FieldValues>(
  result: Result<T>,
  form?: UseFormReturn<F>,
  successMessage?: string,
): T | null {
  if (result.ok) {
    const message = result.message ?? successMessage;
    if (message) toast.success(message);
    return result.data;
  }
  if (form && result.fieldErrors) {
    let focused = false;
    for (const [field, message] of Object.entries(result.fieldErrors)) {
      form.setError(field as FieldPath<F>, { type: "server", message }, { shouldFocus: !focused });
      focused = true;
    }
  }
  toast.error(result.error);
  return null;
}
