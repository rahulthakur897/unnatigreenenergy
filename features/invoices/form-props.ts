import "server-only";
import { eq } from "drizzle-orm";
import { GST_RATES, type InvoiceType } from "@/lib/billing/constants";
import { addDaysISO, todayISO } from "@/lib/billing/dates";
import { listCustomerOptions } from "@/features/customers/queries";
import { listCatalog } from "@/features/products/queries";
import { db } from "@/server/db";
import { customers, invoices } from "@/server/db/schema";
import { fileUrl } from "@/server/files";
import { getCompanySettings } from "@/server/settings";
import type { InvoiceFormProps } from "./components/invoice-form";
import { formValuesFromInvoice, getInvoiceWithItems } from "./queries";
import type { InvoiceFormValues } from "./schemas";
import { previewNextNumber, sellerSnapshotFrom } from "./service";

type GstRate = InvoiceFormValues["items"][number]["gstRate"];

/** Everything the invoice form needs, for a new invoice or for editing a draft. */
export async function getInvoiceFormProps(opts: {
  invoiceId?: string;
  customerId?: string;
  invoiceType?: InvoiceType;
}): Promise<InvoiceFormProps | "not-found" | "locked"> {
  const settings = await getCompanySettings();
  const [customerOptions, catalog] = await Promise.all([listCustomerOptions(), listCatalog()]);
  const defaultGstRate = ((GST_RATES as readonly string[]).includes(settings.defaultGstRate) ? settings.defaultGstRate : "18") as GstRate;

  let initialValues: InvoiceFormValues;
  let replacesNumber: string | null = null;

  if (opts.invoiceId) {
    const found = await getInvoiceWithItems(opts.invoiceId);
    if (!found) return "not-found";
    if (found.invoice.status !== "draft") return "locked";
    initialValues = formValuesFromInvoice(found.invoice, found.items);
    if (found.invoice.replacesInvoiceId) {
      const [orig] = await db.select({ n: invoices.invoiceNumber }).from(invoices).where(eq(invoices.id, found.invoice.replacesInvoiceId));
      replacesNumber = orig?.n ?? null;
    }
  } else {
    const today = todayISO();
    initialValues = {
      invoiceType: opts.invoiceType ?? "tax_invoice",
      invoiceNumber: "",
      invoiceDate: today,
      dueDate: addDaysISO(today, settings.defaultDueDays),
      customerId: "",
      billName: "",
      billAddress: "",
      billGstin: "",
      billState: "",
      billStateCode: "",
      billPhone: "",
      billEmail: "",
      shipSameAsBilling: true,
      shipName: "",
      shipAddress: "",
      shipGstin: "",
      shipState: "",
      shipStateCode: "",
      placeOfSupply: settings.stateCode,
      vehicleNumber: "",
      transporterName: "",
      lrNumber: "",
      ewayBillNumber: "",
      items: [{ productId: "", description: "", hsnCode: "", unit: "PCS", quantity: "1", rate: "", gstRate: defaultGstRate }],
      terms: settings.defaultTerms,
      notes: "",
    };

    if (opts.customerId) {
      const [c] = await db.select().from(customers).where(eq(customers.id, opts.customerId));
      if (c) {
        const separate = !!c.shippingAddress && c.shippingAddress.trim() !== c.billingAddress.trim();
        Object.assign(initialValues, {
          customerId: c.id,
          billName: c.name,
          billAddress: c.billingAddress,
          billGstin: c.gstin,
          billState: c.state,
          billStateCode: c.stateCode,
          billPhone: c.mobile,
          billEmail: c.email,
          placeOfSupply: c.stateCode || settings.stateCode,
          shipSameAsBilling: !separate,
          ...(separate ? { shipName: c.name, shipAddress: c.shippingAddress, shipGstin: c.gstin, shipState: c.state, shipStateCode: c.stateCode } : {}),
        });
      }
    }
  }

  return {
    invoiceId: opts.invoiceId,
    initialValues,
    customers: customerOptions,
    products: catalog,
    seller: sellerSnapshotFrom(settings),
    logoUrl: fileUrl(settings.logoFileId),
    signatureUrl: fileUrl(settings.signatureFileId),
    autoNumbering: settings.autoNumbering,
    roundOff: settings.roundOffTotal,
    defaultDueDays: settings.defaultDueDays,
    defaultGstRate,
    nextNumbers: {
      tax_invoice: await previewNextNumber(settings, "tax_invoice", initialValues.invoiceDate),
      bill_of_supply: await previewNextNumber(settings, "bill_of_supply", initialValues.invoiceDate),
    },
    replacesNumber,
  };
}
