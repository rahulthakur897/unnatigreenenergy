"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { DateField, MoneyField, SelectField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/billing/ui/dialog";
import { Spinner } from "@/components/billing/ui/spinner";
import { PAYMENT_MODES, paymentModeLabels } from "@/lib/billing/constants";
import { formatDate, todayISO } from "@/lib/billing/dates";
import { formatINR, paiseToRupeeString } from "@/lib/billing/money";
import { recordPayment } from "../actions";
import { paymentSchema, type PaymentInput } from "../schemas";

export type PayableInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  total: number;
  paid: number;
  balance: number;
};

const modeOptions = PAYMENT_MODES.map((m) => ({ value: m, label: paymentModeLabels[m] }));

export function RecordPaymentDialog({ invoices, defaultInvoiceId, trigger }: { invoices: PayableInvoice[]; defaultInvoiceId?: string; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const initialId = defaultInvoiceId ?? "";
  const initialInvoice = invoices.find((i) => i.id === initialId);

  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: initialId,
      paymentDate: todayISO(),
      amount: initialInvoice ? paiseToRupeeString(initialInvoice.balance) : "",
      mode: "bank_transfer",
      reference: "",
      notes: "",
    },
  });

  // Reset when reopened so the balance shown is current.
  useEffect(() => {
    if (open) {
      const inv = invoices.find((i) => i.id === initialId);
      form.reset({ invoiceId: initialId, paymentDate: todayISO(), amount: inv ? paiseToRupeeString(inv.balance) : "", mode: "bank_transfer", reference: "", notes: "" });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedId = form.watch("invoiceId");
  const selected = invoices.find((i) => i.id === selectedId);

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = await recordPayment(values);
      if (handleActionResult(result, form)) setOpen(false);
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>Part payments are allowed — the outstanding balance updates automatically.</DialogDescription>
        </DialogHeader>
        {invoices.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">There are no unpaid generated invoices.</p>
        ) : (
          <form id="payment-form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="invoiceId"
              label="Invoice"
              required
              className="sm:col-span-2"
              disabled={!!defaultInvoiceId}
              placeholder="Select an unpaid invoice"
              options={invoices.map((i) => ({ value: i.id, label: `${i.invoiceNumber} · ${i.customerName} · due ${formatINR(i.balance)}` }))}
              onValueChange={(id) => {
                const inv = invoices.find((i) => i.id === id);
                if (inv) form.setValue("amount", paiseToRupeeString(inv.balance), { shouldValidate: true });
              }}
            />
            {selected && (
              <dl className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/40 p-3 text-center text-xs sm:col-span-2">
                <div>
                  <dt className="text-muted-foreground">Invoice total</dt>
                  <dd className="tabular mt-0.5 text-sm font-semibold">{formatINR(selected.total)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Received</dt>
                  <dd className="tabular mt-0.5 text-sm font-semibold text-emerald-700">{formatINR(selected.paid)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Outstanding</dt>
                  <dd className="tabular mt-0.5 text-sm font-semibold text-amber-700">{formatINR(selected.balance)}</dd>
                </div>
                <p className="col-span-3 text-left text-[11px] text-muted-foreground">
                  {selected.customerName} · invoiced {formatDate(selected.invoiceDate)}
                </p>
              </dl>
            )}
            <MoneyField control={form.control} name="amount" label="Amount received" required />
            <DateField control={form.control} name="paymentDate" label="Payment date" required />
            <SelectField control={form.control} name="mode" label="Payment mode" required options={modeOptions} />
            <TextField control={form.control} name="reference" label="Transaction reference" placeholder="UTR / cheque no. / UPI ref" />
            <TextareaField control={form.control} name="notes" label="Notes" rows={2} className="sm:col-span-2" />
          </form>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="payment-form" disabled={pending || invoices.length === 0}>
            {pending && <Spinner />} Record payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
