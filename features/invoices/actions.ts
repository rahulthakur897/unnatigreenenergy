"use server";

import { revalidatePath } from "next/cache";
import { invoiceTypeLabels } from "@/lib/billing/constants";
import { action, ok, parseInput, type ActionResult } from "@/server/action-result";
import { requireAdmin, requireUser } from "@/server/auth/dal";
import { getCompanySettings } from "@/server/settings";
import { invoiceShareUrl } from "@/server/share";
import { cancelInvoiceSchema, invoiceFormSchema, type InvoiceFormValues } from "./schemas";
import * as service from "./service";

function revalidateInvoices(id?: string) {
  revalidatePath("/dashboard", "layout");
  if (id) revalidatePath(`/dashboard/invoices/${id}`);
}

export async function saveDraftInvoice(values: InvoiceFormValues, invoiceId?: string): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(invoiceFormSchema, values);
    const { id } = await service.saveInvoice(data, { mode: "draft", invoiceId, user, settings: await getCompanySettings() });
    revalidateInvoices(id);
    return ok({ id }, "Draft saved");
  });
}

export async function generateInvoice(values: InvoiceFormValues, invoiceId?: string): Promise<ActionResult<{ id: string; invoiceNumber: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(invoiceFormSchema, values);
    const result = await service.saveInvoice(data, { mode: "generate", invoiceId, user, settings: await getCompanySettings() });
    revalidateInvoices(result.id);
    return ok({ id: result.id, invoiceNumber: result.invoiceNumber! }, `${invoiceTypeLabels[data.invoiceType]} ${result.invoiceNumber} generated`);
  });
}

export async function cancelInvoiceAction(id: string, input: { reason: string }): Promise<ActionResult> {
  return action(async () => {
    const user = await requireAdmin();
    const { reason } = parseInput(cancelInvoiceSchema, input);
    const invoice = await service.cancelInvoice(id, reason, user);
    revalidateInvoices(id);
    return ok(null, `Invoice ${invoice.invoiceNumber} cancelled`);
  });
}

export async function duplicateInvoiceAction(id: string): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const user = await requireUser();
    const newId = await service.duplicateInvoice(id, user);
    revalidateInvoices();
    return ok({ id: newId }, "Draft copy created");
  });
}

export async function deleteDraftAction(id: string): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    await service.deleteDraft(id, user);
    revalidateInvoices();
    return ok(null, "Draft deleted");
  });
}

export async function getShareLinkAction(id: string): Promise<ActionResult<{ url: string }>> {
  return action(async () => {
    await requireUser();
    return ok({ url: invoiceShareUrl(id) });
  });
}
