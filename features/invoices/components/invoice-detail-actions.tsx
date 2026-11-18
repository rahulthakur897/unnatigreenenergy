"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Copy, Download, MoreHorizontal, Pencil, Printer, Share2, Trash2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmDialog } from "@/components/billing/confirm-dialog";
import { TextareaField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/billing/ui/dropdown-menu";
import { RecordPaymentDialog, type PayableInvoice } from "@/features/payments/components/record-payment-dialog";
import type { InvoiceStatus } from "@/lib/billing/constants";
import { cancelInvoiceAction, deleteDraftAction, duplicateInvoiceAction } from "../actions";
import { cancelInvoiceSchema } from "../schemas";
import { ShareInvoiceDialog } from "./share-dialog";

type Props = {
  invoiceId: string;
  status: InvoiceStatus;
  invoiceNumber: string | null;
  isAdmin: boolean;
  hasPayments: boolean;
  payable: PayableInvoice | null;
  share: { customerName: string; customerEmail: string; customerPhone: string; total: string; companyName: string };
};

export function InvoiceDetailActions({ invoiceId, status, invoiceNumber, isAdmin, hasPayments, payable, share }: Props) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const cancelForm = useForm<z.input<typeof cancelInvoiceSchema>>({ resolver: zodResolver(cancelInvoiceSchema), defaultValues: { reason: "" } });

  async function duplicate() {
    const result = await duplicateInvoiceAction(invoiceId);
    const data = handleActionResult(result);
    if (data) router.push(`/dashboard/invoices/${data.id}/edit`);
  }

  const pdfUrl = `/api/billing/invoices/${invoiceId}/pdf/`;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <Button asChild>
          <Link href={`/dashboard/invoices/${invoiceId}/edit`}>
            <Pencil /> Edit draft
          </Link>
        </Button>
      )}
      {payable && (
        <RecordPaymentDialog
          invoices={[payable]}
          defaultInvoiceId={invoiceId}
          trigger={
            <Button>
              <Wallet /> Record payment
            </Button>
          }
        />
      )}
      <Button variant="outline" asChild>
        <a href={`${pdfUrl}?download=1`}>
          <Download /> Download PDF
        </a>
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        <Printer /> Print
      </Button>
      {status === "generated" && (
        <Button variant="outline" onClick={() => setShareOpen(true)}>
          <Share2 /> Share
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <a href={`${pdfUrl}?download=0`} target="_blank" rel="noopener">
              <Download /> Open PDF in new tab
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={duplicate}>
            <Copy /> {status === "cancelled" ? "Create corrected invoice" : "Duplicate invoice"}
          </DropdownMenuItem>
          {status === "generated" && isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setCancelOpen(true)}>
                <Ban /> Cancel invoice
              </DropdownMenuItem>
            </>
          )}
          {status === "draft" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                <Trash2 /> Delete draft
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {status === "generated" && invoiceNumber && (
        <ShareInvoiceDialog invoiceId={invoiceId} invoiceNumber={invoiceNumber} open={shareOpen} onOpenChange={setShareOpen} {...share} />
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={`Cancel invoice ${invoiceNumber}?`}
        destructive
        confirmLabel="Cancel invoice"
        description={
          hasPayments
            ? "This invoice has recorded payments. Remove them first — a cancelled invoice can't carry payments."
            : "The invoice stays on record with its number, marked CANCELLED. Stock is returned. To correct it, create a corrected copy afterwards."
        }
        onConfirm={async () => {
          const valid = await cancelForm.trigger();
          if (!valid) return false;
          const result = await cancelInvoiceAction(invoiceId, cancelForm.getValues());
          handleActionResult(result, cancelForm);
          if (result.ok) cancelForm.reset();
          return result.ok;
        }}
      >
        <TextareaField control={cancelForm.control} name="reason" label="Reason for cancellation" required rows={2} placeholder="e.g. Wrong rate entered; re-issued as a corrected invoice" />
      </ConfirmDialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this draft?"
        destructive
        confirmLabel="Delete draft"
        description="The draft is permanently removed. No invoice number has been used."
        onConfirm={async () => {
          const result = await deleteDraftAction(invoiceId);
          handleActionResult(result);
          if (result.ok) router.push("/dashboard/invoices");
          return result.ok;
        }}
      />
    </div>
  );
}
