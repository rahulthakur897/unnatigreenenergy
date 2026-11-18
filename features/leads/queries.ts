import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { customers, leadActivities, leads, users } from "@/server/db/schema";

export async function listLeads() {
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadDetail(id: string) {
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) return null;
  const activities = await db
    .select({
      id: leadActivities.id,
      type: leadActivities.type,
      content: leadActivities.content,
      createdAt: leadActivities.createdAt,
      createdBy: users.name,
    })
    .from(leadActivities)
    .leftJoin(users, eq(users.id, leadActivities.createdBy))
    .where(eq(leadActivities.leadId, id))
    .orderBy(desc(leadActivities.createdAt));
  const customer = lead.customerId
    ? ((await db.select({ id: customers.id, name: customers.name }).from(customers).where(eq(customers.id, lead.customerId)))[0] ?? null)
    : null;
  return { lead, activities, customer };
}
