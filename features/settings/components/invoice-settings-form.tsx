"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Landmark, Lock, PenLine, Save, Settings2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SelectField, SwitchField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { ImageUpload, type ImageChange } from "@/components/billing/image-upload";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Spinner } from "@/components/billing/ui/spinner";
import { GST_RATES, INVOICE_TYPES, invoiceTypeLabels, type InvoiceType } from "@/lib/billing/constants";
import { formatInvoiceNumber } from "@/lib/billing/invoice-calc";
import { setNextInvoiceNumber, updateInvoiceSettings } from "../actions";
import { invoiceSettingsSchema, numberingSchema, type InvoiceSettingsInput, type NumberingInput } from "../schemas";

export function InvoiceSettingsForm({ values, signatureUrl, canEdit }: { values: InvoiceSettingsInput; signatureUrl: string | null; canEdit: boolean }) {
  const [pending, startTransition] = useTransition();
  const [signature, setSignature] = useState<ImageChange>({ file: null, remove: false });
  const form = useForm<InvoiceSettingsInput>({ resolver: zodResolver(invoiceSettingsSchema), defaultValues: values });
  const prefix = form.watch("invoicePrefix");
  const bosPrefix = form.watch("billOfSupplyPrefix");
  const padding = Number(form.watch("numberPadding"));

  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const fd = new FormData();
      fd.set("values", JSON.stringify(v));
      if (signature.file) fd.set("signature", signature.file);
      if (signature.remove) fd.set("remove_signature", "1");
      const result = await updateInvoiceSettings(fd);
      handleActionResult(result, form);
      if (result.ok) form.reset(v);
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <fieldset disabled={!canEdit || pending} className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4 text-primary" /> Invoice defaults
            </CardTitle>
            <CardDescription>
              Numbers are prefix / financial year / sequence — tax invoices like{" "}
              <span className="tabular font-medium text-foreground">{formatInvoiceNumber(prefix || "UGE", "2026-27", 21, padding || 3)}</span>, bills of supply like{" "}
              <span className="tabular font-medium text-foreground">{formatInvoiceNumber(bosPrefix || "BOS", "2026-27", 1, padding || 3)}</span>. Each prefix has its own
              sequence.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <TextField control={form.control} name="invoicePrefix" label="Tax invoice prefix" required className="[&_input]:uppercase" />
            <TextField control={form.control} name="billOfSupplyPrefix" label="Bill of supply prefix" required className="[&_input]:uppercase" />
            <SelectField
              control={form.control}
              name="numberPadding"
              label="Sequence digits"
              options={["1", "2", "3", "4", "5"].map((n) => ({ value: n, label: `${n} (e.g. ${"1".padStart(Number(n), "0")})` }))}
            />
            <SelectField control={form.control} name="defaultGstRate" label="Default GST rate" options={GST_RATES.map((r) => ({ value: r, label: `${r}%` }))} />
            <TextField
              control={form.control}
              name="defaultDueDays"
              label="Payment due in (days)"
              inputMode="numeric"
              description="0 = due on invoice date"
              className="md:col-span-2 xl:col-span-1"
            />
            <SwitchField
              control={form.control}
              name="autoNumbering"
              label="Automatic invoice numbering"
              description="Assign the next sequential number when an invoice is generated."
              className="md:col-span-2"
            />
            <SwitchField
              control={form.control}
              name="roundOffTotal"
              label="Round off totals"
              description="Round the payable amount to the nearest rupee."
              className="md:col-span-2 xl:col-span-3"
            />
            <TextareaField
              control={form.control}
              name="defaultTerms"
              label="Default terms & conditions"
              rows={4}
              description="One term per line; editable on each invoice."
              className="md:col-span-2 xl:col-span-3"
            />
            <TextareaField control={form.control} name="defaultFooter" label="Invoice footer" rows={4} className="md:col-span-2" />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="size-4 text-primary" /> Bank details
              </CardTitle>
              <CardDescription>Shown in the ‘Bank & Payment Details’ section of invoices.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField control={form.control} name="bankName" label="Bank" />
              <TextField control={form.control} name="bankAccountName" label="Account name" />
              <TextField control={form.control} name="bankAccountNumber" label="Account number" inputMode="numeric" />
              <TextField control={form.control} name="bankIfsc" label="IFSC code" className="[&_input]:uppercase" maxLength={11} />
              <TextField control={form.control} name="bankBranch" label="Branch" className="sm:col-span-2" />
              <TextField control={form.control} name="upiId" label="UPI ID (optional)" placeholder="business@bank" className="sm:col-span-2" />
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="size-4 text-primary" /> Authorized signatory
              </CardTitle>
              <CardDescription>Printed beneath ‘For [company name]’ at the bottom of every invoice.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField control={form.control} name="signatoryName" label="Signatory name" placeholder="Optional" />
              <TextField control={form.control} name="signatoryDesignation" label="Designation" placeholder="Authorized Signatory" />
              <div className="sm:col-span-2">
                <ImageUpload label="Signature / stamp image" hint="PNG with a transparent background works best. Up to 2 MB." currentUrl={signatureUrl} onChange={setSignature} />
              </div>
            </CardContent>
          </Card>
        </div>
      </fieldset>
      <div className="flex justify-end">
        {canEdit ? (
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : <Save />} Save invoice settings
          </Button>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" /> Only administrators can change invoice settings.
          </p>
        )}
      </div>
    </form>
  );
}

export function NumberingCard({
  financialYears,
  sequences,
  prefixes,
  padding,
  canEdit,
}: {
  financialYears: string[];
  /** Last used number per series and financial year. */
  sequences: Record<InvoiceType, Record<string, number>>;
  prefixes: Record<InvoiceType, string>;
  padding: number;
  canEdit: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<NumberingInput>({
    resolver: zodResolver(numberingSchema),
    defaultValues: { series: "tax_invoice", financialYear: financialYears[0], nextNumber: String((sequences.tax_invoice[financialYears[0]] ?? 0) + 1) },
  });
  const series = form.watch("series");
  const fy = form.watch("financialYear");
  const next = form.watch("nextNumber");
  const lastUsed = sequences[series];

  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const result = await setNextInvoiceNumber(v);
      handleActionResult(result, form);
    }),
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="size-4 text-primary" /> Financial year & numbering
        </CardTitle>
        <CardDescription>Numbering restarts each financial year (April–March). Set where a year continues from — for example after moving from another billing tool.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <fieldset disabled={!canEdit || pending} className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
            <SelectField
              control={form.control}
              name="series"
              label="Series"
              options={INVOICE_TYPES.map((t) => ({ value: t, label: `${invoiceTypeLabels[t]} (${prefixes[t]})` }))}
              onValueChange={(t) => form.setValue("nextNumber", String((sequences[t as InvoiceType][fy] ?? 0) + 1))}
            />
            <SelectField
              control={form.control}
              name="financialYear"
              label="Financial year"
              options={financialYears.map((y) => ({ value: y, label: `FY ${y}${lastUsed[y] ? ` · last used ${lastUsed[y]}` : ""}` }))}
              onValueChange={(y) => form.setValue("nextNumber", String((lastUsed[y] ?? 0) + 1))}
            />
            <TextField control={form.control} name="nextNumber" label="Next number" inputMode="numeric" />
            <div className="space-y-1.5">
              <p className="text-[13px] font-medium">Next {series === "bill_of_supply" ? "bill" : "invoice"}</p>
              <p className="tabular flex h-9 items-center rounded-md bg-muted px-3 text-sm font-semibold">
                {/^\d+$/.test(next) ? formatInvoiceNumber(prefixes[series], fy, Number(next), padding) : "—"}
              </p>
            </div>
          </fieldset>
        </CardContent>
        {canEdit && (
          <CardFooter className="justify-end border-t">
            <Button type="submit" variant="secondary" disabled={pending}>
              {pending && <Spinner />} Update numbering
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
