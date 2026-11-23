import { z } from "zod";
import { GST_RATES, INVOICE_TYPES } from "@/lib/billing/constants";
import { dateString, email, gstin, money, optionalDate, phone, quantity, requiredText, stateCode, text } from "@/lib/billing/validation";

export const invoiceItemSchema = z.object({
  productId: z.string(),
  description: requiredText("Item description", 500),
  hsnCode: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}(\d{2})?(\d{2})?$/.test(v), "4, 6 or 8 digits"),
  unit: z.string().trim().min(1, "Unit").max(12),
  quantity: quantity("Qty").refine((v) => Number(v) > 0, "Qty must be more than 0"),
  rate: money("rate"),
  gstRate: z.enum(GST_RATES, "Select GST"),
});

export const invoiceFormSchema = z
  .object({
    invoiceType: z.enum(INVOICE_TYPES, "Choose the invoice type"),
    /** Only used when automatic numbering is turned off in Invoice Settings. */
    invoiceNumber: z.string().trim().max(40),
    invoiceDate: dateString("Invoice date"),
    dueDate: optionalDate(),

    customerId: z.string(),
    billName: requiredText("Customer name", 200),
    billAddress: text(500),
    billGstin: gstin(),
    billState: text(80),
    billStateCode: stateCode(),
    billPhone: phone(),
    billEmail: email(),

    shipSameAsBilling: z.boolean(),
    shipName: text(200),
    shipAddress: text(500),
    shipGstin: gstin(),
    shipState: text(80),
    shipStateCode: stateCode(),

    /** Decides CGST + SGST vs IGST; not needed on a bill of supply. */
    placeOfSupply: z.string().trim(),

    vehicleNumber: text(20).transform((v) => v.toUpperCase()),
    transporterName: text(120),
    lrNumber: text(40),
    ewayBillNumber: text(20),

    items: z.array(invoiceItemSchema).min(1, "Add at least one item").max(100, "An invoice can have at most 100 items"),
    terms: text(3000),
    notes: text(1000),
  })
  .superRefine((v, ctx) => {
    if (v.invoiceType === "tax_invoice" && v.placeOfSupply.length < 2) {
      ctx.addIssue({ code: "custom", path: ["placeOfSupply"], message: "Select the place of supply" });
    }
    if (v.dueDate && v.dueDate < v.invoiceDate) {
      ctx.addIssue({ code: "custom", path: ["dueDate"], message: "Due date can't be before the invoice date" });
    }
    if (!v.shipSameAsBilling && !v.shipName.trim()) {
      ctx.addIssue({ code: "custom", path: ["shipName"], message: "Enter the shipping party name" });
    }
  });

export type InvoiceFormValues = z.input<typeof invoiceFormSchema>;
export type InvoiceFormData = z.output<typeof invoiceFormSchema>;
export type InvoiceItemValues = z.input<typeof invoiceItemSchema>;

/** Stricter checks applied only when generating (finalising) an invoice. */
export function generationIssues(v: InvoiceFormData): Record<string, string> {
  const issues: Record<string, string> = {};
  if (!v.billAddress.trim()) issues.billAddress = "Billing address is required before generating";
  if (!v.billStateCode) issues.billStateCode = "Select the customer's state";
  v.items.forEach((item, i) => {
    if (Number(item.rate) <= 0) issues[`items.${i}.rate`] = "Rate must be more than 0";
  });
  return issues;
}

export const cancelInvoiceSchema = z.object({ reason: requiredText("Reason", 300) });
