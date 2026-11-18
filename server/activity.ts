import "server-only";
import { db } from "@/server/db";
import { activityLog } from "@/server/db/schema";

type Executor = Pick<typeof db, "insert">;

export type ActivityEntity = "lead" | "customer" | "invoice" | "payment" | "product" | "settings";

/** Records an entry for the dashboard's recent-activity feed. */
export async function logActivity(
  entry: { entityType: ActivityEntity; entityId: string; action: string; description: string; userId?: string | null },
  executor: Executor = db,
) {
  await executor.insert(activityLog).values({ ...entry, userId: entry.userId ?? null });
}
