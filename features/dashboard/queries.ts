import "server-only";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { financialYearMonths, financialYearOf, financialYearRange, todayISO } from "@/lib/billing/dates";
import { paymentStatusOf } from "@/lib/billing/invoice-calc";
import { db } from "@/server/db";
import { activityLog, customers, invoices, leads, payments, users } from "@/server/db/schema";
import { paidByInvoice } from "@/server/ledger";

/** All dashboard figures, computed from the database on every request. */
export async function getDashboardData(fy = financialYearOf(todayISO())) {
  const today = todayISO();
  const { from, to } = financialYearRange(fy);
  const paid = paidByInvoice();

  const invoiceRows = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      invoiceDate: invoices.invoiceDate,
      dueDate: invoices.dueDate,
      billName: invoices.billName,
      status: invoices.status,
      total: invoices.total,
      createdAt: invoices.createdAt,
      paid: sql<number>`coalesce(${paid.paid}, 0)`,
    })
    .from(invoices)
    .leftJoin(paid, eq(paid.invoiceId, invoices.id));

  const withStatus = invoiceRows.map((i) => ({ ...i, paymentStatus: paymentStatusOf(i, i.paid, today) }));
  const generated = withStatus.filter((i) => i.status === "generated");

  const statusCounts = {
    paid: generated.filter((i) => i.paymentStatus === "paid"),
    partially_paid: generated.filter((i) => i.paymentStatus === "partially_paid"),
    pending: generated.filter((i) => i.paymentStatus === "pending"),
    overdue: generated.filter((i) => i.paymentStatus === "overdue"),
    draft: withStatus.filter((i) => i.status === "draft"),
    cancelled: withStatus.filter((i) => i.status === "cancelled"),
  };
  const sum = (rows: { total: number; paid: number }[], key: "total" | "balance") =>
    rows.reduce((s, r) => s + (key === "total" ? r.total : Math.max(0, r.total - r.paid)), 0);

  // Monthly invoiced (by invoice date) and collected (by payment date) for the financial year.
  const monthlyInvoiced = await db
    .select({ month: sql<string>`substr(${invoices.invoiceDate}, 1, 7)`, total: sql<number>`sum(${invoices.total})`, count: sql<number>`count(*)` })
    .from(invoices)
    .where(and(eq(invoices.status, "generated"), gte(invoices.invoiceDate, from), lte(invoices.invoiceDate, to)))
    .groupBy(sql`substr(${invoices.invoiceDate}, 1, 7)`);
  const monthlyCollected = await db
    .select({ month: sql<string>`substr(${payments.paymentDate}, 1, 7)`, total: sql<number>`sum(${payments.amount})` })
    .from(payments)
    .innerJoin(invoices, eq(invoices.id, payments.invoiceId))
    .where(and(eq(invoices.status, "generated"), gte(payments.paymentDate, from), lte(payments.paymentDate, to)))
    .groupBy(sql`substr(${payments.paymentDate}, 1, 7)`);

  const monthly = financialYearMonths(fy).map((month) => ({
    month,
    invoiced: monthlyInvoiced.find((m) => m.month === month)?.total ?? 0,
    invoices: monthlyInvoiced.find((m) => m.month === month)?.count ?? 0,
    collected: monthlyCollected.find((m) => m.month === month)?.total ?? 0,
  }));

  const [customerCount] = await db.select({ n: sql<number>`count(*)` }).from(customers);
  const [leadCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      open: sql<number>`sum(case when ${leads.status} not in ('converted','lost') then 1 else 0 end)`,
      thisMonth: sql<number>`sum(case when substr(${leads.createdAt}, 1, 7) = ${today.slice(0, 7)} then 1 else 0 end)`,
    })
    .from(leads);

  const recentActivity = await db
    .select({
      id: activityLog.id,
      entityType: activityLog.entityType,
      entityId: activityLog.entityId,
      action: activityLog.action,
      description: activityLog.description,
      createdAt: activityLog.createdAt,
      userName: users.name,
    })
    .from(activityLog)
    .leftJoin(users, eq(users.id, activityLog.userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(8);

  const latestLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5);

  const recentInvoices = [...withStatus].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return {
    fy,
    stats: {
      totalRevenue: sum(generated, "total"),
      collected: generated.reduce((s, i) => s + Math.min(i.paid, i.total), 0),
      totalInvoices: generated.length,
      draftInvoices: statusCounts.draft.length,
      paidInvoices: statusCounts.paid.length,
      pendingAmount: sum(generated, "balance"),
      pendingCount: generated.filter((i) => i.paymentStatus !== "paid").length,
      overdueCount: statusCounts.overdue.length,
      overdueAmount: sum(statusCounts.overdue, "balance"),
      customers: customerCount.n,
      leads: leadCounts.total ?? 0,
      openLeads: leadCounts.open ?? 0,
      leadsThisMonth: leadCounts.thisMonth ?? 0,
    },
    statusBreakdown: (Object.keys(statusCounts) as (keyof typeof statusCounts)[]).map((key) => ({
      key,
      count: statusCounts[key].length,
      amount: sum(statusCounts[key], "total"),
    })),
    monthly,
    recentInvoices,
    recentActivity,
    latestLeads,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
