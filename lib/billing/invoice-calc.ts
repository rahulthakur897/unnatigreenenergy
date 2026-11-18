import type { InvoiceStatus, InvoiceType, PaymentStatus, TaxType } from "./constants";
import { Decimal } from "./money";

/**
 * GST invoice arithmetic, shared by the live form preview and the server.
 * Inputs: quantity as a decimal string, rate in integer paise, GST rate as a percent string.
 * Every intermediate result is rounded half-up to whole paise with decimal.js.
 */

export type CalcLine = { quantity: string; rate: number; gstRate: string };

export type TaxBreakupRow = {
  rate: string;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
};

export type InvoiceTotals = {
  lines: { amount: number; taxAmount: number }[];
  subtotal: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  roundOff: number;
  total: number;
  breakup: TaxBreakupRow[];
};

function dec(value: string | number | null | undefined): Decimal {
  try {
    const d = new Decimal(String(value ?? "0").trim() || "0");
    return d.isFinite() ? d : new Decimal(0);
  } catch {
    return new Decimal(0);
  }
}

const toPaiseInt = (d: Decimal) => d.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();

export function calculateInvoice(lines: CalcLine[], opts: { taxType: TaxType; roundOff: boolean }): InvoiceTotals {
  const computed = lines.map((line) => {
    const amount = toPaiseInt(dec(line.quantity).mul(line.rate || 0));
    const taxAmount = toPaiseInt(dec(amount).mul(dec(line.gstRate)).div(100));
    return { amount, taxAmount };
  });

  // Tax is computed on the taxable value per GST rate, then split CGST/SGST (intra-state) or IGST (inter-state).
  const groups = new Map<string, number>();
  lines.forEach((line, i) => {
    const key = dec(line.gstRate).toString();
    groups.set(key, (groups.get(key) ?? 0) + computed[i].amount);
  });

  const breakup: TaxBreakupRow[] = [...groups.entries()]
    .sort((a, b) => dec(a[0]).comparedTo(dec(b[0])))
    .map(([rate, taxable]) => {
      if (opts.taxType === "intra") {
        const half = toPaiseInt(dec(taxable).mul(dec(rate)).div(200));
        return { rate, taxable, cgst: half, sgst: half, igst: 0 };
      }
      return { rate, taxable, cgst: 0, sgst: 0, igst: toPaiseInt(dec(taxable).mul(dec(rate)).div(100)) };
    });

  const subtotal = computed.reduce((sum, l) => sum + l.amount, 0);
  const taxableAmount = subtotal;
  const cgstAmount = breakup.reduce((s, r) => s + r.cgst, 0);
  const sgstAmount = breakup.reduce((s, r) => s + r.sgst, 0);
  const igstAmount = breakup.reduce((s, r) => s + r.igst, 0);
  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const exact = taxableAmount + totalTax;
  const total = opts.roundOff ? toPaiseInt(dec(exact).div(100)) * 100 : exact;

  return {
    lines: computed,
    subtotal,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    roundOff: total - exact,
    total,
    breakup,
  };
}

/** Intra-state (CGST + SGST) when supplier and place of supply share a state; otherwise IGST. */
export function taxTypeFor(sellerStateCode: string, placeOfSupplyCode: string): TaxType {
  if (!placeOfSupplyCode || !sellerStateCode) return "intra";
  return sellerStateCode === placeOfSupplyCode ? "intra" : "inter";
}

/** "18" → "9" — half rate for CGST/SGST labels. */
export function halfRate(rate: string): string {
  return dec(rate).div(2).toString();
}

/** Each invoice type numbers from its own prefix (they share one series if both prefixes are the same). */
export function prefixForType(settings: { invoicePrefix: string; billOfSupplyPrefix: string }, type: InvoiceType): string {
  return type === "bill_of_supply" ? settings.billOfSupplyPrefix : settings.invoicePrefix;
}

/** A bill of supply carries no GST, so every line is taxed at 0%. */
export function effectiveGstRate(type: InvoiceType, rate: string): string {
  return type === "bill_of_supply" ? "0" : rate;
}

export function formatInvoiceNumber(prefix: string, financialYear: string, sequence: number, padding = 3): string {
  const parts = [prefix.trim(), financialYear, String(sequence).padStart(padding, "0")].filter(Boolean);
  return parts.join("/");
}

/** Payment status for a generated invoice; drafts and cancelled invoices have none. */
export function paymentStatusOf(
  invoice: { status: InvoiceStatus; total: number; dueDate: string | null },
  paid: number,
  today: string,
): PaymentStatus | null {
  if (invoice.status !== "generated") return null;
  if (paid >= invoice.total) return "paid";
  if (invoice.dueDate && invoice.dueDate < today) return "overdue";
  if (paid > 0) return "partially_paid";
  return "pending";
}
