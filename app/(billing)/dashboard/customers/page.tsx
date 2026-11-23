import type { Metadata } from "next";
import { CustomersView } from "@/features/customers/components/customers-view";
import { listCustomers } from "@/features/customers/queries";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  await requireUser();
  return <CustomersView customers={await listCustomers()} />;
}
