import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";

export const SESSION_COOKIE = "uge_session";
const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_MS = 12 * 60 * 60 * 1000; // 12 hours

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Creates a DB session and sets the httpOnly cookie. Call only from server actions / route handlers. */
export async function createSession(userId: string, remember: boolean) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + (remember ? REMEMBER_MS : DEFAULT_MS));
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;

  // Opportunistically clear this user's expired sessions.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date().toISOString())));
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt: expires.toISOString(), userAgent });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Without "remember me" the cookie lasts for the browser session (and at most 12 h server-side).
    ...(remember ? { expires } : {}),
  });
}

/** Looks up the user for the current session cookie (or null). */
export async function readSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ user: users, sessionId: sessions.id })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date().toISOString())))
    .limit(1);
  if (!row || !row.user.isActive) return null;
  return row;
}

export async function deleteCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  jar.delete(SESSION_COOKIE);
}

/** Signs a user out everywhere (e.g. after a password reset). */
export async function deleteUserSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
