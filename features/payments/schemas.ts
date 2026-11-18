import { z } from "zod";
import { PAYMENT_MODES } from "@/lib/billing/constants";
import { dateString, positiveMoney, text } from "@/lib/billing/validation";

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Select an invoice"),
  paymentDate: dateString("Payment date"),
  amount: positiveMoney("amount received"),
  mode: z.enum(PAYMENT_MODES, "Select a payment mode"),
  reference: text(120),
  notes: text(500),
});
export type PaymentInput = z.input<typeof paymentSchema>;
