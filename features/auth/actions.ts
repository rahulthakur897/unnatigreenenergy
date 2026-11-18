"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSession, deleteCurrentSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { safeNextPath, signInSchema, type SignInInput } from "./schemas";

/* Simple in-memory throttle: 5 failed attempts per email+IP per 15 minutes. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function throttleKey(email: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${email}|${ip}`;
}

// Verifying against a dummy hash keeps response time similar for unknown emails.
let dummyHash: Promise<string> | null = null;

export async function signIn(input: SignInInput, next?: string): Promise<ActionResult<{ redirectTo: string }>> {
  return action(async () => {
    const data = parseInput(signInSchema, input);
    const key = await throttleKey(data.email);
    const entry = attempts.get(key);
    if (entry && entry.resetAt > Date.now() && entry.count >= MAX_ATTEMPTS) {
      throw new AppError("Too many failed attempts. Please wait 15 minutes and try again.");
    }

    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    dummyHash ??= hashPassword("not-a-real-password");
    const valid = await verifyPassword(data.password, user?.passwordHash ?? (await dummyHash));

    if (!user || !valid || !user.isActive) {
      const current = entry && entry.resetAt > Date.now() ? entry : { count: 0, resetAt: Date.now() + WINDOW_MS };
      attempts.set(key, { ...current, count: current.count + 1 });
      throw new AppError(user && !user.isActive ? "This account has been deactivated." : "Incorrect email or password.");
    }

    attempts.delete(key);
    await createSession(user.id, data.remember);
    return ok({ redirectTo: safeNextPath(next) }, `Welcome back, ${user.name.split(" ")[0]}!`);
  });
}

export async function signOut() {
  await deleteCurrentSession();
  redirect("/login?signedOut=1");
}
