"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { leadActivityLabels, leadStatusLabels, LEAD_STATUSES, type LeadStatus } from "@/lib/billing/constants";
import { formatDateLong } from "@/lib/billing/dates";
import { toPaise } from "@/lib/billing/money";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import { requireUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { leadActivities, leads } from "@/server/db/schema";
import { leadActivitySchema, leadSchema, type LeadActivityInput, type LeadInput } from "./schemas";

function toRow(data: ReturnType<typeof leadSchema.parse>) {
  return { ...data, expectedValue: toPaise(data.expectedValue || "0"), followUpDate: data.followUpDate || null };
}

function revalidateLeads(id?: string) {
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/dashboard/leads/${id}`);
}

export async function createLead(input: LeadInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(leadSchema, input);
    const id = await db.transaction(async (tx) => {
      const [row] = await tx.insert(leads).values(toRow(data)).returning({ id: leads.id });
      await tx.insert(leadActivities).values({
        leadId: row.id,
        type: "created",
        content: `Lead created from ${data.source.replace("_", " ")}${data.productInterest ? ` — interested in ${data.productInterest}` : ""}`,
        createdBy: user.id,
      });
      await logActivity({ entityType: "lead", entityId: row.id, action: "created", description: `New lead “${data.leadName}” added`, userId: user.id }, tx);
      return row.id;
    });
    revalidateLeads();
    return ok({ id }, "Lead added");
  });
}

export async function updateLead(id: string, input: LeadInput): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(leadSchema, input);
    await db.transaction(async (tx) => {
      const [existing] = await tx.select({ status: leads.status, followUpDate: leads.followUpDate }).from(leads).where(eq(leads.id, id));
      if (!existing) throw new AppError("Lead not found.");
      await tx.update(leads).set(toRow(data)).where(eq(leads.id, id));
      if (existing.status !== data.status) {
        await tx.insert(leadActivities).values({
          leadId: id,
          type: "status_change",
          content: `Status changed from ${leadStatusLabels[existing.status]} to ${leadStatusLabels[data.status]}`,
          createdBy: user.id,
        });
      }
      if (data.followUpDate && existing.followUpDate !== data.followUpDate) {
        await tx.insert(leadActivities).values({ leadId: id, type: "follow_up", content: `Follow-up scheduled for ${formatDateLong(data.followUpDate)}`, createdBy: user.id });
      }
    });
    revalidateLeads(id);
    return ok(null, "Lead updated");
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    if (!(LEAD_STATUSES as readonly string[]).includes(status)) throw new AppError("Invalid status.");
    await db.transaction(async (tx) => {
      const [existing] = await tx.select({ status: leads.status }).from(leads).where(eq(leads.id, id));
      if (!existing) throw new AppError("Lead not found.");
      if (existing.status === status) return;
      await tx.update(leads).set({ status }).where(eq(leads.id, id));
      await tx.insert(leadActivities).values({
        leadId: id,
        type: "status_change",
        content: `Status changed from ${leadStatusLabels[existing.status]} to ${leadStatusLabels[status]}`,
        createdBy: user.id,
      });
    });
    revalidateLeads(id);
    return ok(null, `Marked as ${leadStatusLabels[status]}`);
  });
}

export async function addLeadActivity(id: string, input: LeadActivityInput): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(leadActivitySchema, input);
    await db.transaction(async (tx) => {
      await tx.insert(leadActivities).values({ leadId: id, type: data.type, content: data.content, createdBy: user.id });
      if (data.nextFollowUp) {
        await tx.update(leads).set({ followUpDate: data.nextFollowUp }).where(eq(leads.id, id));
        await tx.insert(leadActivities).values({ leadId: id, type: "follow_up", content: `Next follow-up set for ${formatDateLong(data.nextFollowUp)}`, createdBy: user.id });
      }
      // Logging contact with a brand-new lead moves it to "Contacted".
      const [lead] = await tx.select({ status: leads.status }).from(leads).where(eq(leads.id, id));
      if (lead?.status === "new" && data.type !== "note") {
        await tx.update(leads).set({ status: "contacted" }).where(eq(leads.id, id));
      }
    });
    revalidateLeads(id);
    return ok(null, `${leadActivityLabels[data.type]} added`);
  });
}

export async function deleteLead(id: string): Promise<ActionResult> {
  return action(async () => {
    await requireUser();
    await db.delete(leads).where(eq(leads.id, id));
    revalidateLeads();
    return ok(null, "Lead deleted");
  });
}
