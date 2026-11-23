"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { StateSelectField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { ImageUpload, type ImageChange } from "@/components/billing/image-upload";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Spinner } from "@/components/billing/ui/spinner";
import { DEFAULT_LOGO_PATH } from "@/features/invoices/document";
import { stateCodeFromGstin, stateNameFromCode } from "@/lib/billing/states";
import { updateCompanyProfile } from "../actions";
import { companyProfileSchema, type CompanyProfileInput } from "../schemas";

export function CompanyProfileForm({ values, logoUrl, canEdit }: { values: CompanyProfileInput; logoUrl: string | null; canEdit: boolean }) {
  const [pending, startTransition] = useTransition();
  const [logo, setLogo] = useState<ImageChange>({ file: null, remove: false });
  const form = useForm<CompanyProfileInput>({ resolver: zodResolver(companyProfileSchema), defaultValues: values });

  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const fd = new FormData();
      fd.set("values", JSON.stringify(v));
      if (logo.file) fd.set("logo", logo.file);
      if (logo.remove) fd.set("remove_logo", "1");
      const result = await updateCompanyProfile(fd);
      handleActionResult(result, form);
      if (result.ok) form.reset(v);
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Company profile</CardTitle>
          <CardDescription>Printed as the seller on every invoice. Generated invoices keep the details they were issued with.</CardDescription>
        </CardHeader>
        <CardContent>
          <fieldset disabled={!canEdit || pending} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <ImageUpload
                label="Logo"
                hint="PNG or JPG, up to 2 MB. Shown at the top of invoices. Leave empty to use the standard UNNATI logo."
                currentUrl={logoUrl}
                fallbackUrl={DEFAULT_LOGO_PATH}
                onChange={setLogo}
              />
            </div>
            <TextField control={form.control} name="name" label="Company name" required className="md:col-span-2" />
            <TextareaField control={form.control} name="address" label="Address" required rows={3} className="md:col-span-2" />
            <div
              onBlur={() => {
                const code = stateCodeFromGstin(form.getValues("gstin").toUpperCase());
                if (code && !form.getValues("stateCode")) {
                  form.setValue("stateCode", code, { shouldValidate: true, shouldDirty: true });
                  form.setValue("state", stateNameFromCode(code));
                }
              }}
            >
              <TextField control={form.control} name="gstin" label="GSTIN" className="[&_input]:uppercase" maxLength={15} />
            </div>
            <TextField control={form.control} name="pan" label="PAN" className="[&_input]:uppercase" maxLength={10} />
            <TextField control={form.control} name="phone" label="Phone" type="tel" />
            <TextField control={form.control} name="email" label="Email" type="email" />
            <TextField control={form.control} name="website" label="Website" placeholder="www.unnatigreenenergy.com" />
            <StateSelectField form={form} codeField="stateCode" nameField="state" label="State (used to decide CGST/SGST vs IGST)" required />
          </fieldset>
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          {canEdit ? (
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner /> : <Save />} Save company profile
            </Button>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" /> Only administrators can change the company profile.
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
