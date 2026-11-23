import type { Metadata } from "next";
import { InvoicesView } from "@/features/invoices/components/invoices-view";
import { listInvoices } from "@/features/invoices/queries";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "All Invoices" };

export default async function InvoicesPage() {
  await requireUser();
  return <InvoicesView invoices={await listInvoices()} />;
}
