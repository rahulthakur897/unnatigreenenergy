"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatINR, toPaise } from "@/lib/billing/money";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import { requireAdmin, requireUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { invoices, payments } from "@/server/db/schema";
import { paymentSchema, type PaymentInput } from "./schemas";

export async function recordPayment(input: PaymentInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(paymentSchema, input);
    const amount = toPaise(data.amount);

    const id = await db.transaction(async (tx) => {
      const [invoice] = await tx
        .select({ status: invoices.status, total: invoices.total, invoiceNumber: invoices.invoiceNumber, billName: invoices.billName, invoiceDate: invoices.invoiceDate })
        .from(invoices)
        .where(eq(invoices.id, data.invoiceId));
      if (!invoice) throw new AppError("Invoice not found.");
      if (invoice.status !== "generated") throw new AppError("Payments can only be recorded against generated invoices.");
      if (data.paymentDate < invoice.invoiceDate) {
        throw new AppError("Payment date can't be before the invoice date.", { paymentDate: "Before the invoice date" });
      }
      const [{ paid }] = await tx.select({ paid: sql<number>`coalesce(sum(${payments.amount}), 0)` }).from(payments).where(eq(payments.invoiceId, data.invoiceId));
      const outstanding = invoice.total - paid;
      if (outstanding <= 0) throw new AppError("This invoice is already fully paid.");
      if (amount > outstanding) {
        throw new AppError(`Amount exceeds the outstanding balance of ${formatINR(outstanding)}.`, { amount: `Max ${formatINR(outstanding)}` });
      }
      const [row] = await tx
        .insert(payments)
        .values({ invoiceId: data.invoiceId, paymentDate: data.paymentDate, amount, mode: data.mode, reference: data.reference, notes: data.notes, createdBy: user.id })
        .returning({ id: payments.id });
      await logActivity(
        {
          entityType: "payment",
          entityId: data.invoiceId,
          action: amount === outstanding ? "paid" : "part_paid",
          description: `${formatINR(amount)} received from ${invoice.billName} against ${invoice.invoiceNumber}${amount === outstanding ? " — fully paid" : ""}`,
          userId: user.id,
        },
        tx,
      );
      return row.id;
    });

    revalidatePath("/dashboard", "layout");
    return ok({ id }, "Payment recorded");
  });
}

export async function deletePayment(id: string): Promise<ActionResult> {
  return action(async () => {
    const user = await requireAdmin();
    const [payment] = await db
      .select({ amount: payments.amount, invoiceId: payments.invoiceId, invoiceNumber: invoices.invoiceNumber })
      .from(payments)
      .innerJoin(invoices, eq(invoices.id, payments.invoiceId))
      .where(eq(payments.id, id));
    if (!payment) throw new AppError("Payment not found.");
    await db.delete(payments).where(eq(payments.id, id));
    await logActivity({
      entityType: "payment",
      entityId: payment.invoiceId,
      action: "deleted",
      description: `Payment of ${formatINR(payment.amount)} on ${payment.invoiceNumber} removed`,
      userId: user.id,
    });
    revalidatePath("/dashboard", "layout");
    return ok(null, "Payment removed");
  });
}
