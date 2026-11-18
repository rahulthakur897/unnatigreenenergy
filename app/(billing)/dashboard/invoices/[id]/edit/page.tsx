import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { getInvoiceFormProps } from "@/features/invoices/form-props";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Edit draft invoice" };

export default async function EditInvoicePage({ params }: PageProps<"/dashboard/invoices/[id]/edit">) {
  await requireUser();
  const { id } = await params;
  const props = await getInvoiceFormProps({ invoiceId: id });
  if (props === "not-found") notFound();
  // Generated invoices are immutable — show the invoice instead.
  if (props === "locked") redirect(`/dashboard/invoices/${id}`);
  return <InvoiceForm key={id} {...props} />;
}
