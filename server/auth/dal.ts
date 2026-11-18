import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { UserRole } from "@/lib/billing/constants";
import { readSession } from "./session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarFileId: string | null;
};

/** Current signed-in user, memoised per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await readSession();
  if (!session) return null;
  const { id, name, email, role, avatarFileId } = session.user;
  return { id, name, email, role, avatarFileId };
});

/** Use in pages, layouts, server actions and route handlers that need a signed-in user. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do that.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Admin-only operations: settings, users, cancelling invoices, deleting payments. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") throw new ForbiddenError("Only administrators can do that.");
  return user;
}

export const isAdmin = (user: SessionUser) => user.role === "admin";
