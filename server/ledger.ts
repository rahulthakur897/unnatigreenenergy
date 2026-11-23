import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { payments } from "@/server/db/schema";

/** Subquery: total received per invoice. Join on `invoiceId`; read `paid` (may be null → 0). */
export function paidByInvoice() {
  return db
    .select({ invoiceId: payments.invoiceId, paid: sql<number>`sum(${payments.amount})`.as("paid_total") })
    .from(payments)
    .groupBy(payments.invoiceId)
    .as("paid_by_invoice");
}
