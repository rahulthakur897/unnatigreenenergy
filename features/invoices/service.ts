import "server-only";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { invoiceTypeLabels, isServiceCode, type InvoiceType } from "@/lib/billing/constants";
import { addDaysISO, daysBetween, financialYearOf, todayISO } from "@/lib/billing/dates";
import { calculateInvoice, effectiveGstRate, formatInvoiceNumber, prefixForType, taxTypeFor } from "@/lib/billing/invoice-calc";
import { Decimal, normalizeDecimal, toPaise } from "@/lib/billing/money";
import { stateNameFromCode } from "@/lib/billing/states";
import { AppError } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import type { SessionUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import {
  customers,
  invoiceItems,
  invoices,
  invoiceSequences,
  payments,
  products,
  stockMovements,
  type CompanySettings,
  type Invoice,
} from "@/server/db/schema";
import type { SellerSnapshot } from "./document";
import { generationIssues, type InvoiceFormData } from "./schemas";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export function sellerSnapshotFrom(settings: CompanySettings): SellerSnapshot {
  return {
    name: settings.name,
    address: settings.address,
    gstin: settings.gstin,
    pan: settings.pan,
    phone: settings.phone,
    email: settings.email,
    state: settings.state,
    stateCode: settings.stateCode,
    logoFileId: settings.logoFileId,
    bankName: settings.bankName,
    bankAccountName: settings.bankAccountName,
    bankAccountNumber: settings.bankAccountNumber,
    bankIfsc: settings.bankIfsc,
    bankBranch: settings.bankBranch,
    upiId: settings.upiId,
    signatoryName: settings.signatoryName,
    signatoryDesignation: settings.signatoryDesignation,
    signatureFileId: settings.signatureFileId,
    footer: settings.defaultFooter,
  };
}

/** Next number in a type's series for a financial year, without consuming it (for the form preview). */
export async function previewNextNumber(settings: CompanySettings, type: InvoiceType, invoiceDate = todayISO()): Promise<string> {
  const prefix = prefixForType(settings, type);
  const fy = financialYearOf(invoiceDate);
  const [seq] = await db
    .select({ lastNumber: invoiceSequences.lastNumber })
    .from(invoiceSequences)
    .where(eq(invoiceSequences.id, `${prefix}|${fy}`));
  return formatInvoiceNumber(prefix, fy, (seq?.lastNumber ?? 0) + 1, settings.numberPadding);
}

/** Atomically takes the next sequence number; skips any number already used (e.g. entered manually). */
async function allocateNumber(tx: Tx, settings: CompanySettings, type: InvoiceType, invoiceDate: string) {
  const prefix = prefixForType(settings, type);
  const fy = financialYearOf(invoiceDate);
  const id = `${prefix}|${fy}`;
  for (let attempt = 0; attempt < 50; attempt++) {
    const [row] = await tx
      .insert(invoiceSequences)
      .values({ id, prefix, financialYear: fy, lastNumber: 1 })
      .onConflictDoUpdate({ target: invoiceSequences.id, set: { lastNumber: sql`${invoiceSequences.lastNumber} + 1` } })
      .returning({ lastNumber: invoiceSequences.lastNumber });
    const invoiceNumber = formatInvoiceNumber(prefix, fy, row.lastNumber, settings.numberPadding);
    const clash = await tx.select({ id: invoices.id }).from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber)).limit(1);
    if (clash.length === 0) return { invoiceNumber, sequenceNumber: row.lastNumber, financialYear: fy };
  }
  throw new AppError("Could not allocate a unique invoice number. Check the numbering settings.");
}

function buildRecord(data: InvoiceFormData, settings: CompanySettings) {
  const taxType = taxTypeFor(settings.stateCode, data.placeOfSupply);
  const items = data.items.map((item, position) => ({
    position,
    productId: item.productId || null,
    description: item.description,
    hsnCode: item.hsnCode,
    unit: item.unit.toUpperCase(),
    quantity: normalizeDecimal(item.quantity),
    rate: toPaise(item.rate),
    gstRate: effectiveGstRate(data.invoiceType, item.gstRate),
  }));
  const totals = calculateInvoice(items, { taxType, roundOff: settings.roundOffTotal });

  const ship = data.shipSameAsBilling
    ? { shipName: "", shipAddress: "", shipGstin: "", shipState: "", shipStateCode: "" }
    : {
        shipName: data.shipName,
        shipAddress: data.shipAddress,
        shipGstin: data.shipGstin,
        shipState: stateNameFromCode(data.shipStateCode) || data.shipState,
        shipStateCode: data.shipStateCode,
      };

  return {
    header: {
      invoiceType: data.invoiceType,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate || null,
      financialYear: financialYearOf(data.invoiceDate),
      billName: data.billName,
      billAddress: data.billAddress,
      billGstin: data.billGstin,
      billState: stateNameFromCode(data.billStateCode) || data.billState,
      billStateCode: data.billStateCode,
      billPhone: data.billPhone,
      billEmail: data.billEmail,
      shipSameAsBilling: data.shipSameAsBilling,
      ...ship,
      placeOfSupply: data.placeOfSupply,
      taxType,
      vehicleNumber: data.vehicleNumber,
      transporterName: data.transporterName,
      lrNumber: data.lrNumber,
      ewayBillNumber: data.ewayBillNumber,
      subtotal: totals.subtotal,
      taxableAmount: totals.taxableAmount,
      cgstAmount: totals.cgstAmount,
      sgstAmount: totals.sgstAmount,
      igstAmount: totals.igstAmount,
      roundOff: totals.roundOff,
      total: totals.total,
      terms: data.terms,
      notes: data.notes,
    },
    items: items.map((item, i) => ({ ...item, amount: totals.lines[i].amount, taxAmount: totals.lines[i].taxAmount })),
  };
}

/**
 * Saves a draft or generates (finalises) an invoice. Everything is recomputed server-side;
 * client-side totals are never trusted. Generated invoices can't be modified afterwards.
 */
export async function saveInvoice(
  data: InvoiceFormData,
  opts: { mode: "draft" | "generate"; invoiceId?: string; user: SessionUser; settings: CompanySettings },
): Promise<{ id: string; invoiceNumber: string | null }> {
  const { mode, invoiceId, user, settings } = opts;

  if (mode === "generate") {
    const issues = generationIssues(data);
    if (Object.keys(issues).length) throw new AppError("Complete the highlighted fields before generating the invoice.", issues);
    if (!settings.autoNumbering && !data.invoiceNumber) {
      throw new AppError("Enter an invoice number (automatic numbering is off).", { invoiceNumber: "Invoice number is required" });
    }
  }

  const record = buildRecord(data, settings);

  return db.transaction(async (tx) => {
    if (invoiceId) {
      const [existing] = await tx.select({ status: invoices.status }).from(invoices).where(eq(invoices.id, invoiceId));
      if (!existing) throw new AppError("Invoice not found.");
      if (existing.status !== "draft") throw new AppError("This invoice has already been generated and can no longer be edited.");
    }

    // Keep the customer link only if the customer still exists.
    let customerId: string | null = data.customerId || null;
    if (customerId) {
      const [c] = await tx.select({ id: customers.id }).from(customers).where(eq(customers.id, customerId));
      if (!c) customerId = null;
    }

    // Snapshot product cost prices for profit reporting.
    const productIds = [...new Set(record.items.map((i) => i.productId).filter((id): id is string => !!id))];
    const productRows = productIds.length
      ? await tx
          .select({ id: products.id, purchasePrice: products.purchasePrice, availableQty: products.availableQty, name: products.name })
          .from(products)
          .where(inArray(products.id, productIds))
      : [];
    const productMap = new Map(productRows.map((p) => [p.id, p]));
    const itemRows = record.items.map((item) => {
      const product = item.productId ? productMap.get(item.productId) : undefined;
      return { ...item, productId: product ? item.productId : null, costPrice: product?.purchasePrice ?? null };
    });

    let numbering: { invoiceNumber: string | null; sequenceNumber: number | null } = { invoiceNumber: null, sequenceNumber: null };
    let generatedFields = {};
    if (mode === "generate") {
      if (settings.autoNumbering) {
        const allocated = await allocateNumber(tx, settings, data.invoiceType, data.invoiceDate);
        numbering = { invoiceNumber: allocated.invoiceNumber, sequenceNumber: allocated.sequenceNumber };
      } else {
        const manual = data.invoiceNumber.trim();
        const clash = await tx
          .select({ id: invoices.id })
          .from(invoices)
          .where(invoiceId ? and(eq(invoices.invoiceNumber, manual), ne(invoices.id, invoiceId)) : eq(invoices.invoiceNumber, manual))
          .limit(1);
        if (clash.length) throw new AppError(`Invoice number ${manual} is already in use.`, { invoiceNumber: "Already used" });
        numbering = { invoiceNumber: manual, sequenceNumber: null };
      }
      generatedFields = {
        status: "generated" as const,
        generatedAt: new Date().toISOString(),
        sellerSnapshot: JSON.stringify(sellerSnapshotFrom(settings)),
      };
    }

    const values = { ...record.header, customerId, ...numbering, ...generatedFields };
    let id = invoiceId;
    if (id) {
      await tx.update(invoices).set(values).where(eq(invoices.id, id));
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
    } else {
      const [row] = await tx
        .insert(invoices)
        .values({ ...values, status: mode === "generate" ? "generated" : "draft", createdBy: user.id })
        .returning({ id: invoices.id });
      id = row.id;
    }
    await tx.insert(invoiceItems).values(itemRows.map((item) => ({ ...item, invoiceId: id! })));

    if (mode === "generate") {
      // Deduct stock for catalogue items.
      for (const item of itemRows) {
        if (!item.productId || isServiceCode(item.hsnCode)) continue;
        const [p] = await tx.select({ availableQty: products.availableQty }).from(products).where(eq(products.id, item.productId));
        const next = new Decimal(p.availableQty).minus(item.quantity).toString();
        await tx.update(products).set({ availableQty: next }).where(eq(products.id, item.productId));
        await tx.insert(stockMovements).values({
          productId: item.productId,
          change: new Decimal(item.quantity).neg().toString(),
          reason: "invoice",
          note: `Sold on ${numbering.invoiceNumber}`,
          invoiceId: id,
          createdBy: user.id,
        });
      }
      await logActivity(
        {
          entityType: "invoice",
          entityId: id!,
          action: "generated",
          description: `${invoiceTypeLabels[data.invoiceType]} ${numbering.invoiceNumber} generated for ${data.billName}`,
          userId: user.id,
        },
        tx,
      );
    } else if (!invoiceId) {
      await logActivity(
        { entityType: "invoice", entityId: id!, action: "draft", description: `Draft ${invoiceTypeLabels[data.invoiceType].toLowerCase()} created for ${data.billName}`, userId: user.id },
        tx,
      );
    }

    return { id: id!, invoiceNumber: numbering.invoiceNumber };
  });
}

export async function cancelInvoice(id: string, reason: string, user: SessionUser) {
  return db.transaction(async (tx) => {
    const [invoice] = await tx.select().from(invoices).where(eq(invoices.id, id));
    if (!invoice) throw new AppError("Invoice not found.");
    if (invoice.status !== "generated") throw new AppError("Only generated invoices can be cancelled.");
    const [paid] = await tx.select({ n: sql<number>`count(*)` }).from(payments).where(eq(payments.invoiceId, id));
    if (paid.n > 0) {
      throw new AppError("This invoice has recorded payments. Remove or refund them before cancelling (or issue a credit note).");
    }

    await tx
      .update(invoices)
      .set({ status: "cancelled", cancelledAt: new Date().toISOString(), cancelReason: reason, cancelledBy: user.id })
      .where(eq(invoices.id, id));

    // Return stock.
    const items = await tx.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));
    for (const item of items) {
      if (!item.productId || isServiceCode(item.hsnCode)) continue;
      const [p] = await tx.select({ availableQty: products.availableQty }).from(products).where(eq(products.id, item.productId));
      if (!p) continue;
      await tx
        .update(products)
        .set({ availableQty: new Decimal(p.availableQty).plus(item.quantity).toString() })
        .where(eq(products.id, item.productId));
      await tx.insert(stockMovements).values({
        productId: item.productId,
        change: item.quantity,
        reason: "invoice_cancel",
        note: `Returned on cancelling ${invoice.invoiceNumber}`,
        invoiceId: id,
        createdBy: user.id,
      });
    }
    await logActivity(
      { entityType: "invoice", entityId: id, action: "cancelled", description: `Invoice ${invoice.invoiceNumber} cancelled — ${reason}`, userId: user.id },
      tx,
    );
    return invoice;
  });
}

/** Copies an invoice into a new draft. Copies of cancelled invoices are linked as corrections. */
export async function duplicateInvoice(id: string, user: SessionUser): Promise<string> {
  return db.transaction(async (tx) => {
    const [source] = await tx.select().from(invoices).where(eq(invoices.id, id));
    if (!source) throw new AppError("Invoice not found.");
    const items = await tx.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)).orderBy(invoiceItems.position);

    const today = todayISO();
    const dueOffset = source.dueDate ? Math.max(0, daysBetween(source.invoiceDate, source.dueDate)) : null;
    const copy: typeof invoices.$inferInsert = {
      ...copyableFields(source),
      invoiceDate: today,
      dueDate: dueOffset === null ? null : addDaysISO(today, dueOffset),
      financialYear: financialYearOf(today),
      status: "draft",
      replacesInvoiceId: source.status === "cancelled" ? source.id : null,
      createdBy: user.id,
    };
    const [row] = await tx.insert(invoices).values(copy).returning({ id: invoices.id });
    if (items.length) {
      await tx.insert(invoiceItems).values(
        items.map((item) => ({
          invoiceId: row.id,
          position: item.position,
          productId: item.productId,
          description: item.description,
          hsnCode: item.hsnCode,
          unit: item.unit,
          quantity: item.quantity,
          rate: item.rate,
          gstRate: item.gstRate,
          amount: item.amount,
          taxAmount: item.taxAmount,
          costPrice: item.costPrice,
        })),
      );
    }
    await logActivity(
      {
        entityType: "invoice",
        entityId: row.id,
        action: "duplicated",
        description: `Draft created from ${source.invoiceNumber ?? "a draft"}${source.status === "cancelled" ? " (correction)" : ""}`,
        userId: user.id,
      },
      tx,
    );
    return row.id;
  });
}

/** The commercial content of an invoice (parties, transport, totals, terms) — no number, status or audit fields. */
function copyableFields(source: Invoice) {
  return {
    invoiceType: source.invoiceType,
    customerId: source.customerId,
    billName: source.billName,
    billAddress: source.billAddress,
    billGstin: source.billGstin,
    billState: source.billState,
    billStateCode: source.billStateCode,
    billPhone: source.billPhone,
    billEmail: source.billEmail,
    shipSameAsBilling: source.shipSameAsBilling,
    shipName: source.shipName,
    shipAddress: source.shipAddress,
    shipGstin: source.shipGstin,
    shipState: source.shipState,
    shipStateCode: source.shipStateCode,
    placeOfSupply: source.placeOfSupply,
    taxType: source.taxType,
    vehicleNumber: source.vehicleNumber,
    transporterName: source.transporterName,
    lrNumber: source.lrNumber,
    ewayBillNumber: source.ewayBillNumber,
    subtotal: source.subtotal,
    taxableAmount: source.taxableAmount,
    cgstAmount: source.cgstAmount,
    sgstAmount: source.sgstAmount,
    igstAmount: source.igstAmount,
    roundOff: source.roundOff,
    total: source.total,
    terms: source.terms,
    notes: source.notes,
  };
}

export async function deleteDraft(id: string, user: SessionUser) {
  const [invoice] = await db.select({ status: invoices.status, billName: invoices.billName }).from(invoices).where(eq(invoices.id, id));
  if (!invoice) throw new AppError("Invoice not found.");
  if (invoice.status !== "draft") throw new AppError("Only drafts can be deleted. Generated invoices must be cancelled instead.");
  await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.status, "draft")));
  await logActivity({ entityType: "invoice", entityId: id, action: "deleted", description: `Draft for ${invoice.billName} deleted`, userId: user.id });
}
