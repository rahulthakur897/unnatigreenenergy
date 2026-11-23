import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { getInvoiceFormProps } from "@/features/invoices/form-props";
import { INVOICE_TYPES, type InvoiceType } from "@/lib/billing/constants";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Create Invoice" };

export default async function NewInvoicePage({ searchParams }: PageProps<"/dashboard/invoices/new">) {
  await requireUser();
  const { customer, type } = await searchParams;
  const invoiceType = (INVOICE_TYPES as readonly string[]).includes(String(type)) ? (type as InvoiceType) : undefined;
  const props = await getInvoiceFormProps({ customerId: typeof customer === "string" ? customer : undefined, invoiceType });
  if (typeof props === "string") notFound();
  return <InvoiceForm {...props} />;
}
