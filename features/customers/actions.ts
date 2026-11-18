"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stateNameFromCode } from "@/lib/billing/states";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import { requireUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { customers, invoices, leadActivities, leads, type Customer } from "@/server/db/schema";
import { customerSchema, type CustomerInput } from "./schemas";

function normalise(data: ReturnType<typeof customerSchema.parse>) {
  return { ...data, state: data.stateCode ? stateNameFromCode(data.stateCode) || data.state : data.state };
}

export async function createCustomer(input: CustomerInput, leadId?: string): Promise<ActionResult<Customer>> {
  return action(async () => {
    const user = await requireUser();
    const data = normalise(parseInput(customerSchema, input));
    const row = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(customers)
        .values({ ...data, leadId: leadId ?? null })
        .returning();
      if (leadId) {
        // Converting a lead: link it to the new customer and mark it converted.
        const [lead] = await tx.select({ id: leads.id }).from(leads).where(eq(leads.id, leadId));
        if (!lead) throw new AppError("Lead not found.");
        await tx.update(leads).set({ status: "converted", customerId: created.id }).where(eq(leads.id, leadId));
        await tx.insert(leadActivities).values({ leadId, type: "converted", content: `Converted to customer “${created.name}”`, createdBy: user.id });
        await logActivity({ entityType: "lead", entityId: leadId, action: "converted", description: `Lead converted to customer “${created.name}”`, userId: user.id }, tx);
      } else {
        await logActivity({ entityType: "customer", entityId: created.id, action: "created", description: `New customer “${created.name}” added`, userId: user.id }, tx);
      }
      return created;
    });
    revalidatePath("/dashboard", "layout");
    return ok(row, leadId ? "Lead converted to customer" : "Customer added");
  });
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<ActionResult<Customer>> {
  return action(async () => {
    await requireUser();
    const data = normalise(parseInput(customerSchema, input));
    const [row] = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
    if (!row) throw new AppError("Customer not found.");
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);
    return ok(row, "Customer updated");
  });
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  return action(async () => {
    await requireUser();
    const [used] = await db.select({ n: sql<number>`count(*)` }).from(invoices).where(eq(invoices.customerId, id));
    if (used.n > 0) throw new AppError("This customer has invoices, so they can't be deleted.");
    await db.delete(customers).where(eq(customers.id, id));
    revalidatePath("/dashboard/customers");
    return ok(null, "Customer deleted");
  });
}
