/**
 * The printable invoice model. The on-screen preview (HTML) and the downloadable PDF
 * both render from this one shape, so they always show the same data.
 */
import { amountInWords } from "@/lib/billing/amount-words";
import type { InvoiceStatus, InvoiceType, TaxType } from "@/lib/billing/constants";
import { formatDate } from "@/lib/billing/dates";
import { calculateInvoice, effectiveGstRate, halfRate, taxTypeFor, type InvoiceTotals } from "@/lib/billing/invoice-calc";
import { formatINR, formatQty, formatSignedAmount, tryToPaise } from "@/lib/billing/money";
import { formatStateCode, stateNameFromCode } from "@/lib/billing/states";
import type { InvoiceFormValues } from "./schemas";

export type SellerSnapshot = {
  name: string;
  address: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  state: string;
  stateCode: string;
  logoFileId: string | null;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
  upiId: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatureFileId: string | null;
  footer: string;
};

export type InvoiceParty = {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
  phone?: string;
  email?: string;
};

export type InvoiceDocItem = {
  description: string;
  hsnCode: string;
  quantity: string;
  unit: string;
  rate: number;
  gstRate: string;
  amount: number;
};

export type InvoiceDocument = {
  invoiceType: InvoiceType;
  invoiceNumber: string;
  numberIsProvisional: boolean;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string | null;
  placeOfSupply: string;
  vehicleNumber: string;
  transporterName: string;
  lrNumber: string;
  ewayBillNumber: string;
  seller: SellerSnapshot;
  billTo: InvoiceParty;
  shipTo: InvoiceParty;
  items: InvoiceDocItem[];
  taxType: TaxType;
  totals: InvoiceTotals;
  terms: string[];
  notes: string;
};

/** Printed wording that differs between a tax invoice and a bill of supply. */
export function documentWording(type: InvoiceType) {
  return type === "bill_of_supply"
    ? { title: "BILL OF SUPPLY", numberLabel: "Bill No.", dateLabel: "Bill Date:", fileStem: "Bill-of-Supply", name: "Bill of supply" }
    : { title: "TAX INVOICE", numberLabel: "Invoice No.", dateLabel: "Invoice Date:", fileStem: "Tax-Invoice", name: "Tax invoice" };
}

export function splitTerms(terms: string): string[] {
  return terms
    .split(/\r?\n/)
    .map((t) => t.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

/** Builds the printable model from live form values (client preview). */
export function documentFromForm(
  values: InvoiceFormValues,
  seller: SellerSnapshot,
  opts: { invoiceNumber: string; numberIsProvisional: boolean; status: InvoiceStatus; roundOff: boolean },
): InvoiceDocument {
  const invoiceType = values.invoiceType ?? "tax_invoice";
  const taxType = taxTypeFor(seller.stateCode, values.placeOfSupply);
  const items: InvoiceDocItem[] = (values.items ?? []).map((item) => ({
    description: item.description,
    hsnCode: item.hsnCode,
    quantity: item.quantity,
    unit: item.unit,
    rate: tryToPaise(item.rate) ?? 0,
    gstRate: effectiveGstRate(invoiceType, item.gstRate),
    amount: 0,
  }));
  const totals = calculateInvoice(
    items.map((i) => ({ quantity: /^\d+(\.\d+)?$/.test(i.quantity) ? i.quantity : "0", rate: i.rate, gstRate: i.gstRate || "0" })),
    { taxType, roundOff: opts.roundOff },
  );
  items.forEach((item, i) => (item.amount = totals.lines[i].amount));

  const billTo: InvoiceParty = {
    name: values.billName,
    address: values.billAddress,
    gstin: values.billGstin.toUpperCase(),
    state: values.billState || stateNameFromCode(values.billStateCode),
    stateCode: values.billStateCode,
    phone: values.billPhone,
    email: values.billEmail,
  };
  const shipTo: InvoiceParty = values.shipSameAsBilling
    ? billTo
    : {
        name: values.shipName,
        address: values.shipAddress,
        gstin: values.shipGstin.toUpperCase(),
        state: values.shipState || stateNameFromCode(values.shipStateCode),
        stateCode: values.shipStateCode,
      };

  return {
    invoiceType,
    invoiceNumber: opts.invoiceNumber,
    numberIsProvisional: opts.numberIsProvisional,
    status: opts.status,
    invoiceDate: values.invoiceDate,
    dueDate: values.dueDate || null,
    placeOfSupply: values.placeOfSupply,
    vehicleNumber: values.vehicleNumber,
    transporterName: values.transporterName,
    lrNumber: values.lrNumber,
    ewayBillNumber: values.ewayBillNumber,
    seller,
    billTo,
    shipTo,
    items,
    taxType,
    totals,
    terms: splitTerms(values.terms),
    notes: values.notes,
  };
}

/** Printed invoice palette: deep brand green with a thin gold accent taken from the logo's sun. */
export const INVOICE_THEME = {
  accent: "#0B5D33",
  soft: "#F2F8F3",
  softLine: "#D6E8DA",
  gold: "#E5A823",
  ink: "#111827",
  text: "#334155",
  muted: "#64748B",
  line: "#E2E8F0",
  lineStrong: "#CBD5E1",
  zebra: "#F8FAF9",
} as const;

export const DEFAULT_LOGO_PATH = "/assets/images/brand/unnati-logo-horizontal.png";

/* -------------------------------------------------------------------------- */
/* Print model — shared by the HTML sheet and the PDF so both print the same   */
/* -------------------------------------------------------------------------- */

export type LabeledValue = { label: string; value: string };
export type PrintColumnKey = "sn" | "description" | "hsn" | "qty" | "rate" | "gst" | "amount";
export type PrintColumn = { key: PrintColumnKey; label: string; width: string; align: "left" | "center" | "right" };

const present = (rows: (LabeledValue | false | "" | null | undefined)[]) => rows.filter((r): r is LabeledValue => !!r && !!r.value);

export function printModel(doc: InvoiceDocument) {
  const isBos = doc.invoiceType === "bill_of_supply";
  const words = documentWording(doc.invoiceType);
  const units = [...new Set(doc.items.map((i) => i.unit).filter(Boolean))];
  const singleUnit = units.length <= 1 ? (units[0] ?? "PCS") : null;
  const { seller } = doc;

  const meta: LabeledValue[] = [
    { label: isBos ? "Bill Date" : "Invoice Date", value: formatDate(doc.invoiceDate) },
    { label: "Due Date", value: doc.dueDate ? formatDate(doc.dueDate) : "On receipt" },
    { label: "State Code", value: formatStateCode(seller.stateCode) || "—" },
    ...(isBos ? [] : [{ label: "Place of Supply", value: formatStateCode(doc.placeOfSupply) || "—" }]),
  ];
  const transport: LabeledValue[] = [
    { label: "Vehicle No.", value: doc.vehicleNumber },
    { label: "Transporter", value: doc.transporterName },
    { label: "LR No.", value: doc.lrNumber },
    { label: "E-way Bill No.", value: doc.ewayBillNumber },
  ];
  const hasTransport = transport.some((t) => t.value.trim());

  const columns: PrintColumn[] = [
    { key: "sn", label: "#", width: "6%", align: "center" },
    { key: "description", label: "Item & Description", width: isBos ? "45%" : "38%", align: "left" },
    { key: "hsn", label: "HSN/SAC", width: "12%", align: "center" },
    { key: "qty", label: singleUnit ? `Qty (${singleUnit})` : "Qty", width: "10%", align: "right" },
    { key: "rate", label: "Rate (₹)", width: "13%", align: "right" },
    ...(isBos ? [] : [{ key: "gst", label: "GST", width: "7%", align: "center" } satisfies PrintColumn]),
    { key: "amount", label: "Amount (₹)", width: "14%", align: "right" },
  ];

  const taxRows: LabeledValue[] = isBos
    ? []
    : doc.totals.breakup.flatMap((r) =>
        doc.taxType === "intra"
          ? [
              { label: `CGST @ ${halfRate(r.rate)}%`, value: formatINR(r.cgst) },
              { label: `SGST @ ${halfRate(r.rate)}%`, value: formatINR(r.sgst) },
            ]
          : [{ label: `IGST @ ${r.rate}%`, value: formatINR(r.igst) }],
      );
  const totalRows: LabeledValue[] = [
    { label: "Sub Total", value: formatINR(doc.totals.subtotal) },
    ...(isBos ? [] : [{ label: "Taxable Amount", value: formatINR(doc.totals.taxableAmount) }]),
    ...taxRows,
    ...(doc.totals.roundOff !== 0 ? [{ label: "Round Off", value: formatSignedAmount(doc.totals.roundOff) }] : []),
  ];

  return {
    isBos,
    words,
    singleUnit,
    meta,
    transport: hasTransport ? transport.map((t) => ({ ...t, value: t.value.trim() || "—" })) : [],
    columns,
    totalRows,
    amountWords: amountInWords(doc.totals.total),
    sellerLines: [
      seller.address,
      [seller.gstin && `GSTIN: ${seller.gstin}`, seller.pan && `PAN: ${seller.pan}`].filter(Boolean).join("   |   "),
      [seller.phone && `Phone: ${seller.phone}`, seller.email && `Email: ${seller.email}`].filter(Boolean).join("   |   "),
    ].filter(Boolean),
    bank: present([
      { label: "Bank", value: seller.bankName },
      { label: "A/C Name", value: seller.bankAccountName },
      { label: "A/C No.", value: seller.bankAccountNumber },
      { label: "IFSC", value: seller.bankIfsc },
      { label: "Branch", value: seller.bankBranch },
      { label: "UPI ID", value: seller.upiId },
    ]),
  };
}

export type PrintModel = ReturnType<typeof printModel>;

/** Detail lines under a party's name (address is printed separately). */
export function partyLines(party: InvoiceParty): LabeledValue[] {
  const state = party.state || stateNameFromCode(party.stateCode);
  return present([
    { label: "GSTIN/UIN", value: party.gstin },
    { label: "State", value: state ? `${state}${party.stateCode ? ` (${party.stateCode})` : ""}` : party.stateCode },
    { label: "Phone", value: party.phone ?? "" },
  ]);
}

/** Text for a non-description cell of the items table. */
export function itemCellText(key: PrintColumnKey, item: InvoiceDocItem, index: number, singleUnit: string | null): string {
  switch (key) {
    case "sn":
      return String(index + 1);
    case "hsn":
      return item.hsnCode || "—";
    case "qty":
      return singleUnit ? formatQty(item.quantity) : `${formatQty(item.quantity)} ${item.unit}`;
    case "rate":
      return formatINR(item.rate);
    case "gst":
      return `${item.gstRate}%`;
    case "amount":
      return formatINR(item.amount);
    default:
      return item.description;
  }
}

/** Item description: first line is the product name, the rest are specifications. */
export function splitDescription(description: string): { title: string; details: string } {
  const [title = "", ...rest] = description.split(/\r?\n/);
  return { title: title.trim(), details: rest.join("\n").trim() };
}
