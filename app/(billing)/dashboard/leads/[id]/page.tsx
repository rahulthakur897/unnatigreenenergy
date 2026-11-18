import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadDetail } from "@/features/leads/components/lead-detail";
import { getLeadDetail } from "@/features/leads/queries";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Lead details" };

export default async function LeadPage({ params }: PageProps<"/dashboard/leads/[id]">) {
  await requireUser();
  const { id } = await params;
  const detail = await getLeadDetail(id);
  if (!detail) notFound();
  return <LeadDetail {...detail} />;
}
