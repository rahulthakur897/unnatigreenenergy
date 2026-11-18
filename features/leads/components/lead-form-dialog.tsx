"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { DateField, MoneyField, SelectField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/billing/ui/dialog";
import { Spinner } from "@/components/billing/ui/spinner";
import { LEAD_SOURCES, LEAD_STATUSES, leadSourceLabels, leadStatusLabels } from "@/lib/billing/constants";
import { paiseToRupeeString } from "@/lib/billing/money";
import type { Lead } from "@/server/db/schema";
import { createLead, updateLead } from "../actions";
import { emptyLead, leadSchema, type LeadInput } from "../schemas";

const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: leadSourceLabels[s] }));
const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: leadStatusLabels[s] }));

export function LeadFormDialog({
  lead,
  trigger,
  open,
  onOpenChange,
  products = [],
}: {
  lead?: Lead;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  products?: string[];
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [pending, startTransition] = useTransition();
  const editing = !!lead;

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    values: lead
      ? {
          leadName: lead.leadName,
          companyName: lead.companyName,
          contactPerson: lead.contactPerson,
          mobile: lead.mobile,
          email: lead.email,
          gstin: lead.gstin,
          address: lead.address,
          productInterest: lead.productInterest,
          expectedQuantity: lead.expectedQuantity,
          expectedValue: lead.expectedValue ? paiseToRupeeString(lead.expectedValue) : "",
          source: lead.source,
          followUpDate: lead.followUpDate ?? "",
          status: lead.status,
          notes: lead.notes,
        }
      : emptyLead,
  });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = editing ? await updateLead(lead.id, values) : await createLead(values);
      handleActionResult(result, form);
      if (result.ok) {
        setOpen(false);
        if (!editing && result.data) router.push(`/dashboard/leads/${result.data.id}`);
      }
    }),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit lead" : "Add lead"}</DialogTitle>
          <DialogDescription>Track an enquiry from first contact to a converted customer.</DialogDescription>
        </DialogHeader>
        <form id="lead-form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="leadName" label="Lead name" required placeholder="e.g. 50 NMC modules for e-rickshaw fleet" className="sm:col-span-2" />
          <TextField control={form.control} name="companyName" label="Company name" />
          <TextField control={form.control} name="contactPerson" label="Contact person" />
          <TextField control={form.control} name="mobile" label="Mobile number" type="tel" />
          <TextField control={form.control} name="email" label="Email" type="email" />
          <TextField control={form.control} name="gstin" label="GSTIN" className="[&_input]:uppercase" maxLength={15} />
          <SelectField control={form.control} name="source" label="Lead source" options={sourceOptions} />
          <TextareaField control={form.control} name="address" label="Address" rows={2} className="sm:col-span-2" />
          <TextField control={form.control} name="productInterest" label="Product interested in" list="lead-products" />
          <TextField control={form.control} name="expectedQuantity" label="Expected quantity" placeholder="e.g. 50 PCS / 2 TON" />
          <MoneyField control={form.control} name="expectedValue" label="Expected deal value" />
          <DateField control={form.control} name="followUpDate" label="Follow-up date" />
          <SelectField control={form.control} name="status" label="Lead status" options={statusOptions} />
          <TextareaField control={form.control} name="notes" label="Notes" rows={3} className="sm:col-span-2" />
          <datalist id="lead-products">
            {products.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="lead-form" disabled={pending}>
            {pending && <Spinner />} {editing ? "Save changes" : "Add lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
