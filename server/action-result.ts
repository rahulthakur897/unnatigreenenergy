import "server-only";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { ForbiddenError } from "@/server/auth/dal";

export type ActionResult<T = null> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** An expected, user-facing failure (validation of business rules, conflicts…). */
export class AppError extends Error {
  constructor(
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function ok<T>(data: T, message?: string): ActionResult<T> {
  return { ok: true, data, message };
}

/** Validates input against a schema, throwing an AppError with per-field messages on failure. */
export function parseInput<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new AppError("Please correct the highlighted fields.", fieldErrors);
  }
  return result.data;
}

/**
 * Wraps a server action body: framework errors (redirect, notFound) are rethrown,
 * expected errors become `{ ok: false }`, and unexpected ones are logged and reported generically.
 */
export async function action<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof AppError) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
    if (error instanceof ForbiddenError) return { ok: false, error: error.message };
    if (isUniqueViolation(error)) return { ok: false, error: "That record already exists (duplicate value)." };
    console.error("[action]", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export function isUniqueViolation(error: unknown): boolean {
  const text = String((error as { message?: string; cause?: { message?: string } })?.cause?.message ?? (error as Error)?.message ?? "");
  return /UNIQUE constraint failed/i.test(text);
}
