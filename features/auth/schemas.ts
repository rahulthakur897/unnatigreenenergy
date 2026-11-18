import { z } from "zod";
import { requiredEmail } from "@/lib/billing/validation";

export const signInSchema = z.object({
  email: requiredEmail(),
  password: z.string().min(1, "Password is required").max(128),
  remember: z.boolean(),
});
export type SignInInput = z.infer<typeof signInSchema>;

/** Only allow redirects back into the dashboard (prevents open redirects). */
export function safeNextPath(next: string | null | undefined): string {
  if (next && next.startsWith("/dashboard") && !next.startsWith("//")) return next;
  return "/dashboard";
}
