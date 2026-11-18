import type { Metadata } from "next";
import { LeadsView } from "@/features/leads/components/leads-view";
import { listLeads } from "@/features/leads/queries";
import { listCatalog } from "@/features/products/queries";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage() {
  await requireUser();
  const [leads, catalog] = await Promise.all([listLeads(), listCatalog()]);
  return <LeadsView leads={leads} productNames={catalog.map((p) => p.name)} />;
}
