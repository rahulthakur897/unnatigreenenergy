"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { SelectField, StateSelectField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/billing/ui/dialog";
import { Spinner } from "@/components/billing/ui/spinner";
import { CUSTOMER_TYPES, customerTypeLabels } from "@/lib/billing/constants";
import { stateCodeFromGstin, stateNameFromCode } from "@/lib/billing/states";
import type { Customer } from "@/server/db/schema";
import { createCustomer, updateCustomer } from "../actions";
import { customerSchema, emptyCustomer, type CustomerInput } from "../schemas";

const typeOptions = CUSTOMER_TYPES.map((t) => ({ value: t, label: customerTypeLabels[t] }));

export function CustomerFormDialog({
  customer,
  initialValues,
  leadId,
  trigger,
  open,
  onOpenChange,
  onSaved,
  title,
}: {
  customer?: Customer;
  /** Prefill for a new customer (e.g. converting a lead). */
  initialValues?: Partial<CustomerInput>;
  leadId?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: (customer: Customer) => void;
  title?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [pending, startTransition] = useTransition();
  const editing = !!customer;

  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    values: customer
      ? {
          name: customer.name,
          contactPerson: customer.contactPerson,
          mobile: customer.mobile,
          email: customer.email,
          gstin: customer.gstin,
          pan: customer.pan,
          billingAddress: customer.billingAddress,
          shippingAddress: customer.shippingAddress,
          state: customer.state,
          stateCode: customer.stateCode,
          customerType: customer.customerType,
          notes: customer.notes,
        }
      : { ...emptyCustomer, ...initialValues },
  });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = editing ? await updateCustomer(customer.id, values) : await createCustomer(values, leadId);
      const saved = handleActionResult(result, form);
      if (saved) {
        setOpen(false);
        onSaved?.(saved);
        if (!editing) form.reset({ ...emptyCustomer });
      }
    }),
  );

  /** Fill the state (and PAN) from a valid GSTIN. */
  function onGstinBlur() {
    const gstin = form.getValues("gstin").trim().toUpperCase();
    const code = stateCodeFromGstin(gstin);
    if (code && !form.getValues("stateCode")) {
      form.setValue("stateCode", code, { shouldValidate: true });
      form.setValue("state", stateNameFromCode(code));
    }
    if (gstin.length === 15 && !form.getValues("pan")) form.setValue("pan", gstin.slice(2, 12));
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title ?? (editing ? "Edit customer" : "Add customer")}</DialogTitle>
          <DialogDescription>Customer details are copied onto invoices as the ‘Billed To’ party.</DialogDescription>
        </DialogHeader>
        <form id="customer-form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="name" label="Customer / company name" required placeholder="e.g. HIMA ELECTRICALS" />
          <SelectField control={form.control} name="customerType" label="Customer type" options={typeOptions} />
          <TextField control={form.control} name="contactPerson" label="Contact person" autoComplete="off" />
          <TextField control={form.control} name="mobile" label="Mobile number" type="tel" inputMode="tel" placeholder="+91 98765 43210" />
          <TextField control={form.control} name="email" label="Email" type="email" />
          <div onBlur={onGstinBlur}>
            <TextField control={form.control} name="gstin" label="GSTIN" placeholder="09ABCDE1234F1Z5" className="[&_input]:uppercase" maxLength={15} />
          </div>
          <TextField control={form.control} name="pan" label="PAN" placeholder="ABCDE1234F" className="[&_input]:uppercase" maxLength={10} />
          <StateSelectField form={form} codeField="stateCode" nameField="state" />
          <TextareaField control={form.control} name="billingAddress" label="Billing address" rows={3} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <TextareaField control={form.control} name="shippingAddress" label="Shipping address" rows={3} description="Leave blank if the same as billing." />
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 text-xs"
              onClick={() => form.setValue("shippingAddress", form.getValues("billingAddress"), { shouldDirty: true })}
            >
              <Copy className="size-3" /> Copy billing address
            </Button>
          </div>
          <TextareaField control={form.control} name="notes" label="Notes" rows={2} className="sm:col-span-2" />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="customer-form" disabled={pending}>
            {pending && <Spinner />} {editing ? "Save changes" : "Add customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
