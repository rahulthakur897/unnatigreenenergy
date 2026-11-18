import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { paymentStatusOf } from "@/lib/billing/invoice-calc";
import { todayISO } from "@/lib/billing/dates";
import { db } from "@/server/db";
import { customers, invoices, payments } from "@/server/db/schema";
import { paidByInvoice } from "@/server/ledger";

/** Per-customer totals over generated (non-draft, non-cancelled) invoices. */
function customerTotals() {
  const paid = paidByInvoice();
  return db
    .select({
      customerId: invoices.customerId,
      invoiceCount: sql<number>`count(*)`.as("invoice_count"),
      billed: sql<number>`sum(${invoices.total})`.as("billed"),
      received: sql<number>`sum(coalesce(${paid.paid}, 0))`.as("received"),
      lastInvoiceDate: sql<string | null>`max(${invoices.invoiceDate})`.as("last_invoice_date"),
    })
    .from(invoices)
    .leftJoin(paid, eq(paid.invoiceId, invoices.id))
    .where(eq(invoices.status, "generated"))
    .groupBy(invoices.customerId)
    .as("customer_totals");
}

export type CustomerListItem = Awaited<ReturnType<typeof listCustomers>>[number];

export async function listCustomers() {
  const totals = customerTotals();
  const rows = await db
    .select({
      customer: customers,
      invoiceCount: sql<number>`coalesce(${totals.invoiceCount}, 0)`,
      billed: sql<number>`coalesce(${totals.billed}, 0)`,
      received: sql<number>`coalesce(${totals.received}, 0)`,
      lastInvoiceDate: totals.lastInvoiceDate,
    })
    .from(customers)
    .leftJoin(totals, eq(totals.customerId, customers.id))
    .orderBy(asc(customers.name));
  return rows.map((r) => ({
    ...r.customer,
    invoiceCount: r.invoiceCount,
    billed: r.billed,
    received: r.received,
    outstanding: Math.max(0, r.billed - r.received),
    lastInvoiceDate: r.lastInvoiceDate,
  }));
}

export type CustomerOption = Awaited<ReturnType<typeof listCustomerOptions>>[number];

/** Lightweight list for the invoice form's customer picker. */
export async function listCustomerOptions() {
  return db
    .select({
      id: customers.id,
      name: customers.name,
      contactPerson: customers.contactPerson,
      mobile: customers.mobile,
      email: customers.email,
      gstin: customers.gstin,
      billingAddress: customers.billingAddress,
      shippingAddress: customers.shippingAddress,
      state: customers.state,
      stateCode: customers.stateCode,
    })
    .from(customers)
    .orderBy(asc(customers.name));
}

export async function getCustomerDetail(id: string) {
  const [customer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  if (!customer) return null;

  const paid = paidByInvoice();
  const invoiceRows = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      invoiceDate: invoices.invoiceDate,
      dueDate: invoices.dueDate,
      status: invoices.status,
      total: invoices.total,
      paid: sql<number>`coalesce(${paid.paid}, 0)`,
    })
    .from(invoices)
    .leftJoin(paid, eq(paid.invoiceId, invoices.id))
    .where(eq(invoices.customerId, id))
    .orderBy(desc(invoices.invoiceDate), desc(invoices.createdAt));

  const today = todayISO();
  const invoiceList = invoiceRows.map((inv) => ({
    ...inv,
    paymentStatus: paymentStatusOf(inv, inv.paid, today),
    balance: inv.status === "generated" ? Math.max(0, inv.total - inv.paid) : 0,
  }));

  const recentPayments = await db
    .select({
      id: payments.id,
      paymentDate: payments.paymentDate,
      amount: payments.amount,
      mode: payments.mode,
      reference: payments.reference,
      invoiceId: payments.invoiceId,
      invoiceNumber: invoices.invoiceNumber,
    })
    .from(payments)
    .innerJoin(invoices, eq(invoices.id, payments.invoiceId))
    .where(and(eq(invoices.customerId, id)))
    .orderBy(desc(payments.paymentDate), desc(payments.createdAt))
    .limit(20);

  const generated = invoiceList.filter((i) => i.status === "generated");
  const totalPurchases = generated.reduce((s, i) => s + i.total, 0);
  const paidAmount = generated.reduce((s, i) => s + Math.min(i.paid, i.total), 0);

  return {
    customer,
    invoices: invoiceList,
    payments: recentPayments,
    stats: {
      totalInvoices: generated.length,
      draftInvoices: invoiceList.filter((i) => i.status === "draft").length,
      totalPurchases,
      paidAmount,
      outstanding: generated.reduce((s, i) => s + i.balance, 0),
      overdueCount: generated.filter((i) => i.paymentStatus === "overdue").length,
    },
  };
}
