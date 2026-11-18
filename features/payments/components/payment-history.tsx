"use client";

import { ReceiptIndianRupee, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/billing/confirm-dialog";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { paymentModeLabels, type PaymentMode } from "@/lib/billing/constants";
import { formatDate } from "@/lib/billing/dates";
import { formatINR } from "@/lib/billing/money";
import { deletePayment } from "../actions";

type Row = {
  id: string;
  paymentDate: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  notes: string;
  recordedBy: string | null;
};

export function PaymentHistory({ payments, isAdmin }: { payments: Row[]; isAdmin: boolean }) {
  const [deleting, setDeleting] = useState<Row | null>(null);
  return (
    <Card className="gap-0 py-0 shadow-card">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-base">Payment history</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {payments.length === 0 ? (
          <p className="flex items-center gap-2 px-6 py-6 text-sm text-muted-foreground">
            <ReceiptIndianRupee className="size-4" /> No payments recorded.
          </p>
        ) : (
          <ul className="divide-y">
            {payments.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 px-6 py-3 text-sm">
                <div className="min-w-0">
                  <p className="tabular font-semibold text-emerald-700">{formatINR(p.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.paymentDate)} · {paymentModeLabels[p.mode]}
                    {p.reference && ` · ${p.reference}`}
                  </p>
                  {p.notes && <p className="mt-0.5 text-xs text-muted-foreground">{p.notes}</p>}
                  {p.recordedBy && <p className="mt-0.5 text-[11px] text-muted-foreground/80">Recorded by {p.recordedBy}</p>}
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(p)} aria-label="Remove payment" className="text-muted-foreground">
                    <Trash2 />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove this payment?"
        description={`The payment of ${deleting ? formatINR(deleting.amount) : ""} will be removed and the invoice balance recalculated.`}
        confirmLabel="Remove payment"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deletePayment(deleting.id);
          handleActionResult(result);
          return result.ok;
        }}
      />
    </Card>
  );
}
