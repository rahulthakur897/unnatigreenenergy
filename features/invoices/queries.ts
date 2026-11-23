import "server-only";
import { asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { GST_RATES } from "@/lib/billing/constants";
import { todayISO } from "@/lib/billing/dates";
import { calculateInvoice, paymentStatusOf, type InvoiceTotals } from "@/lib/billing/invoice-calc";
import { formatQty, paiseToRupeeString } from "@/lib/billing/money";
import { stateNameFromCode } from "@/lib/billing/states";
import { db } from "@/server/db";
import { invoiceItems, invoices, payments, users, type CompanySettings, type Invoice, type InvoiceItem } from "@/server/db/schema";
import { paidByInvoice } from "@/server/ledger";
import { getCompanySettings } from "@/server/settings";
import { splitTerms, type InvoiceDocument, type SellerSnapshot } from "./document";
import type { InvoiceFormValues } from "./schemas";
import { sellerSnapshotFrom } from "./service";

export type InvoiceListItem = Awaited<ReturnType<typeof listInvoices>>[number];

export async function listInvoices() {
  const paid = paidByInvoice();
  const rows = await db
    .select({
      id: invoices.id,
      invoiceType: invoices.invoiceType,
      invoiceNumber: invoices.invoiceNumber,
      invoiceDate: invoices.invoiceDate,
      dueDate: invoices.dueDate,
      customerId: invoices.customerId,
      billName: invoices.billName,
      billGstin: invoices.billGstin,
      total: invoices.total,
      status: invoices.status,
      createdAt: invoices.createdAt,
      paid: sql<number>`coalesce(${paid.paid}, 0)`,
    })
    .from(invoices)
    .leftJoin(paid, eq(paid.invoiceId, invoices.id))
    .orderBy(desc(invoices.invoiceDate), desc(invoices.createdAt));
  const today = todayISO();
  return rows.map((r) => ({
    ...r,
    paymentStatus: paymentStatusOf(r, r.paid, today),
    balance: r.status === "generated" ? Math.max(0, r.total - r.paid) : 0,
  }));
}

export async function getInvoiceWithItems(id: string) {
  const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  if (!invoice) return null;
  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)).orderBy(asc(invoiceItems.position));
  return { invoice, items };
}

export async function getInvoiceDetail(id: string) {
  const base = await getInvoiceWithItems(id);
  if (!base) return null;
  const { invoice } = base;

  const paymentRows = await db
    .select({
      id: payments.id,
      paymentDate: payments.paymentDate,
      amount: payments.amount,
      mode: payments.mode,
      reference: payments.reference,
      notes: payments.notes,
      createdAt: payments.createdAt,
      recordedBy: users.name,
    })
    .from(payments)
    .leftJoin(users, eq(users.id, payments.createdBy))
    .where(eq(payments.invoiceId, id))
    .orderBy(desc(payments.paymentDate), desc(payments.createdAt));

  // Correction chain: the invoice this one replaces, and any drafts/invoices that replace it.
  const related = await db
    .select({ id: invoices.id, invoiceNumber: invoices.invoiceNumber, status: invoices.status, replacesInvoiceId: invoices.replacesInvoiceId })
    .from(invoices)
    .where(or(eq(invoices.replacesInvoiceId, id), invoice.replacesInvoiceId ? eq(invoices.id, invoice.replacesInvoiceId) : sql`0`));

  const people = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(inArray(users.id, [invoice.createdBy, invoice.cancelledBy].filter((v): v is string => !!v)));
  const nameOf = (uid: string | null) => people.find((p) => p.id === uid)?.name ?? null;

  const paid = paymentRows.reduce((s, p) => s + p.amount, 0);
  return {
    ...base,
    payments: paymentRows,
    paid,
    balance: invoice.status === "generated" ? Math.max(0, invoice.total - paid) : 0,
    paymentStatus: paymentStatusOf(invoice, paid, todayISO()),
    replaces: related.find((r) => r.id === invoice.replacesInvoiceId) ?? null,
    replacedBy: related.filter((r) => r.replacesInvoiceId === id),
    createdByName: nameOf(invoice.createdBy),
    cancelledByName: nameOf(invoice.cancelledBy),
  };
}

/** Seller details: frozen snapshot for generated/cancelled invoices, live settings for drafts. */
export function sellerFor(invoice: Invoice, settings: CompanySettings): SellerSnapshot {
  if (invoice.sellerSnapshot) {
    try {
      return { ...sellerSnapshotFrom(settings), ...(JSON.parse(invoice.sellerSnapshot) as SellerSnapshot) };
    } catch {
      /* fall through to live settings */
    }
  }
  return sellerSnapshotFrom(settings);
}

export async function buildInvoiceDocument(invoice: Invoice, items: InvoiceItem[], settings?: CompanySettings): Promise<InvoiceDocument> {
  const company = settings ?? (await getCompanySettings());
  const seller = sellerFor(invoice, company);
  const totals: InvoiceTotals = {
    lines: items.map((i) => ({ amount: i.amount, taxAmount: i.taxAmount })),
    subtotal: invoice.subtotal,
    taxableAmount: invoice.taxableAmount,
    cgstAmount: invoice.cgstAmount,
    sgstAmount: invoice.sgstAmount,
    igstAmount: invoice.igstAmount,
    totalTax: invoice.cgstAmount + invoice.sgstAmount + invoice.igstAmount,
    roundOff: invoice.roundOff,
    total: invoice.total,
    breakup: taxBreakup(invoice, items),
  };

  const billTo = {
    name: invoice.billName,
    address: invoice.billAddress,
    gstin: invoice.billGstin,
    state: invoice.billState || stateNameFromCode(invoice.billStateCode),
    stateCode: invoice.billStateCode,
    phone: invoice.billPhone,
    email: invoice.billEmail,
  };

  return {
    invoiceType: invoice.invoiceType,
    invoiceNumber: invoice.invoiceNumber ?? "DRAFT",
    numberIsProvisional: !invoice.invoiceNumber,
    status: invoice.status,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    placeOfSupply: invoice.placeOfSupply,
    vehicleNumber: invoice.vehicleNumber,
    transporterName: invoice.transporterName,
    lrNumber: invoice.lrNumber,
    ewayBillNumber: invoice.ewayBillNumber,
    seller,
    billTo,
    shipTo: invoice.shipSameAsBilling
      ? billTo
      : {
          name: invoice.shipName,
          address: invoice.shipAddress,
          gstin: invoice.shipGstin,
          state: invoice.shipState || stateNameFromCode(invoice.shipStateCode),
          stateCode: invoice.shipStateCode,
        },
    items: items.map((i) => ({
      description: i.description,
      hsnCode: i.hsnCode,
      quantity: i.quantity,
      unit: i.unit,
      rate: i.rate,
      gstRate: i.gstRate,
      amount: i.amount,
    })),
    taxType: invoice.taxType,
    totals,
    terms: splitTerms(invoice.terms),
    notes: invoice.notes,
  };
}

/** Per-rate breakdown, recomputed with the same calculator used at generation time. */
function taxBreakup(invoice: Invoice, items: InvoiceItem[]) {
  return calculateInvoice(
    items.map((i) => ({ quantity: i.quantity, rate: i.rate, gstRate: i.gstRate })),
    { taxType: invoice.taxType, roundOff: false },
  ).breakup;
}

/** Form values for editing a draft. */
export function formValuesFromInvoice(invoice: Invoice, items: InvoiceItem[]): InvoiceFormValues {
  return {
    invoiceType: invoice.invoiceType,
    invoiceNumber: invoice.invoiceNumber ?? "",
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate ?? "",
    customerId: invoice.customerId ?? "",
    billName: invoice.billName,
    billAddress: invoice.billAddress,
    billGstin: invoice.billGstin,
    billState: invoice.billState,
    billStateCode: invoice.billStateCode,
    billPhone: invoice.billPhone,
    billEmail: invoice.billEmail,
    shipSameAsBilling: invoice.shipSameAsBilling,
    shipName: invoice.shipName,
    shipAddress: invoice.shipAddress,
    shipGstin: invoice.shipGstin,
    shipState: invoice.shipState,
    shipStateCode: invoice.shipStateCode,
    placeOfSupply: invoice.placeOfSupply,
    vehicleNumber: invoice.vehicleNumber,
    transporterName: invoice.transporterName,
    lrNumber: invoice.lrNumber,
    ewayBillNumber: invoice.ewayBillNumber,
    items: items.map((i) => ({
      productId: i.productId ?? "",
      description: i.description,
      hsnCode: i.hsnCode,
      unit: i.unit,
      quantity: formatQty(i.quantity),
      rate: paiseToRupeeString(i.rate),
      gstRate: ((GST_RATES as readonly string[]).includes(i.gstRate) ? i.gstRate : "18") as InvoiceFormValues["items"][number]["gstRate"],
    })),
    terms: invoice.terms,
    notes: invoice.notes,
  };
}
