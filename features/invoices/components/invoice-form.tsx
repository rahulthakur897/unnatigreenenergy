"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileCheck2,
  Info,
  Landmark,
  MoreHorizontal,
  PackageSearch,
  Pencil,
  Plus,
  Printer,
  ReceiptIndianRupee,
  Save,
  ScrollText,
  Settings2,
  Share2,
  Truck,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Controller, useFieldArray, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { ToneBadge } from "@/components/billing/common";
import { ConfirmDialog } from "@/components/billing/confirm-dialog";
import { CheckboxField, SelectField, StateSelectField, stateOptions, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/billing/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/billing/ui/dropdown-menu";
import { Input } from "@/components/billing/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/billing/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/billing/ui/select";
import { Spinner } from "@/components/billing/ui/spinner";
import { Textarea } from "@/components/billing/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/billing/ui/tooltip";
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";
import { GST_RATES, INVOICE_TYPES, invoiceTypeLabels, isServiceCode, UNITS, type InvoiceType } from "@/lib/billing/constants";
import { addDaysISO, financialYearOf } from "@/lib/billing/dates";
import { halfRate } from "@/lib/billing/invoice-calc";
import { Decimal, formatINR, formatQty, formatSignedAmount, paiseToRupeeString } from "@/lib/billing/money";
import { stateNameFromCode } from "@/lib/billing/states";
import { cn } from "@/lib/ui-utils";
import { generateInvoice, saveDraftInvoice } from "../actions";
import { documentFromForm, documentWording, type SellerSnapshot } from "../document";
import { invoiceFormSchema, type InvoiceFormValues } from "../schemas";
import { InvoiceFrame } from "./invoice-frame";
import { InvoiceSheet } from "./invoice-sheet";
import { CustomerPicker, ProductPicker, type PickerCustomer, type PickerProduct } from "./pickers";
import { PrintPortal } from "./print-portal";

export type InvoiceFormProps = {
  invoiceId?: string;
  initialValues: InvoiceFormValues;
  customers: PickerCustomer[];
  products: PickerProduct[];
  seller: SellerSnapshot;
  logoUrl: string | null;
  signatureUrl: string | null;
  autoNumbering: boolean;
  roundOff: boolean;
  defaultDueDays: number;
  defaultGstRate: string;
  /** Next number in each series (provisional until the invoice is generated). */
  nextNumbers: Record<InvoiceType, string>;
  replacesNumber?: string | null;
};

type Pending = null | "draft" | "generate" | "pdf";
type GstRate = InvoiceFormValues["items"][number]["gstRate"];
type ItemField = "description" | "hsnCode" | "quantity" | "rate";

const gstOptions = GST_RATES.map((r) => ({ value: r, label: `${r}%` }));
const BILL_FIELDS = ["billName", "billAddress", "billGstin", "billStateCode", "billPhone", "billEmail"] as const;
const TRANSPORT_FIELDS = ["vehicleNumber", "transporterName", "lrNumber", "ewayBillNumber"] as const;

const TYPE_OPTIONS: Record<InvoiceType, { icon: LucideIcon; description: string }> = {
  tax_invoice: { icon: ReceiptIndianRupee, description: "Charges GST — CGST + SGST within your state, IGST for other states." },
  bill_of_supply: { icon: ScrollText, description: "No GST charged — for exempt or nil-rated goods and services." },
};

/** Item rows: stacked on narrow screens, one spreadsheet-like line from 64rem of form width. */
const ROW_GRID: Record<InvoiceType, string> = {
  tax_invoice: "@5xl/form:grid-cols-[1.5rem_minmax(0,1fr)_6rem_5rem_5.5rem_7rem_5rem_7.5rem_2rem]",
  bill_of_supply: "@5xl/form:grid-cols-[1.5rem_minmax(0,1fr)_6rem_5rem_5.5rem_7rem_7.5rem_2rem]",
};

export function InvoiceForm(props: InvoiceFormProps) {
  const { invoiceId, seller, products, autoNumbering, roundOff, defaultDueDays, defaultGstRate } = props;
  const router = useRouter();
  const [customers, setCustomers] = useState(props.customers);
  const [pending, setPending] = useState<Pending>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  /** Set once the user tries to save or generate; until then item errors show only on fields they've left. */
  const [attempted, setAttempted] = useState(false);
  const [editingBill, setEditingBill] = useState(!props.initialValues.customerId);
  const [transportOpen, setTransportOpen] = useState(() => TRANSPORT_FIELDS.some((f) => !!props.initialValues[f]));
  // Place of supply follows the customer's state until someone picks it by hand. A new invoice has no customer
  // state yet, so it must not count as "picked" just because it defaults to the company's own state.
  const posTouched = useRef(!!props.initialValues.billStateCode && props.initialValues.placeOfSupply !== props.initialValues.billStateCode);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: props.initialValues,
    mode: "onTouched",
  });
  const { control, setValue, getValues, formState } = form;
  const items = useFieldArray({ control, name: "items" });

  const values = useWatch({ control }) as InvoiceFormValues;
  const type: InvoiceType = values.invoiceType ?? "tax_invoice";
  const isBos = type === "bill_of_supply";
  const words = documentWording(type);
  const fy = financialYearOf(values.invoiceDate || props.initialValues.invoiceDate);
  const nextNumberFor = (t: InvoiceType) => props.nextNumbers[t].replace(/\/\d{4}-\d{2}\//, `/${fy}/`);
  const numberLabel = autoNumbering ? nextNumberFor(type) : values.invoiceNumber || "—";
  const liveDoc = useMemo(
    () => documentFromForm(values, seller, { invoiceNumber: numberLabel, numberIsProvisional: autoNumbering, status: "draft", roundOff }),
    [values, seller, numberLabel, autoNumbering, roundOff],
  );
  const totals = liveDoc.totals;

  const showBillFields = editingBill || !values.customerId || BILL_FIELDS.some((f) => formState.errors[f]);
  // Adding a line makes react-hook-form validate the whole item list, which would flag the new empty row at once.
  const touchedItems = formState.touchedFields.items;
  const itemError = (index: number, key: ItemField) => {
    const error = formState.errors.items?.[index]?.[key];
    return error && (attempted || touchedItems?.[index]?.[key]) ? error.message : undefined;
  };
  const showTransport = transportOpen || TRANSPORT_FIELDS.some((f) => formState.errors[f]);
  const transportFilled = TRANSPORT_FIELDS.filter((f) => !!values[f]?.trim()).length;
  const sellerState = stateNameFromCode(seller.stateCode);

  // Keep place of supply in step with a customer state typed in by hand (picked customers set it directly).
  const billStateCode = values.billStateCode;
  useEffect(() => {
    if (!posTouched.current && billStateCode && getValues("placeOfSupply") !== billStateCode) {
      setValue("placeOfSupply", billStateCode, { shouldDirty: true });
    }
  }, [billStateCode, getValues, setValue]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!formState.isDirty || pending) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formState.isDirty, pending]);

  /* ----------------------------- field helpers ----------------------------- */

  function changeType(next: InvoiceType) {
    setValue("invoiceType", next, { shouldDirty: true });
    if (next === "tax_invoice" && !getValues("placeOfSupply")) {
      setValue("placeOfSupply", getValues("billStateCode") || seller.stateCode, { shouldDirty: true });
    }
  }

  function selectCustomer(c: PickerCustomer) {
    const opts = { shouldDirty: true, shouldValidate: true };
    setValue("customerId", c.id, opts);
    setValue("billName", c.name, opts);
    setValue("billAddress", c.billingAddress, opts);
    setValue("billGstin", c.gstin, opts);
    setValue("billStateCode", c.stateCode, opts);
    setValue("billState", c.state || stateNameFromCode(c.stateCode), opts);
    setValue("billPhone", c.mobile, opts);
    setValue("billEmail", c.email, opts);
    const separateShipping = !!c.shippingAddress && c.shippingAddress.trim() !== c.billingAddress.trim();
    setValue("shipSameAsBilling", !separateShipping, opts);
    if (separateShipping) {
      setValue("shipName", c.name, opts);
      setValue("shipAddress", c.shippingAddress, opts);
      setValue("shipGstin", c.gstin, opts);
      setValue("shipStateCode", c.stateCode, opts);
      setValue("shipState", c.state, opts);
    }
    if (!posTouched.current && c.stateCode) setValue("placeOfSupply", c.stateCode, opts);
    setEditingBill(false);
  }

  function unlinkCustomer() {
    setValue("customerId", "", { shouldDirty: true });
    setEditingBill(true);
  }

  function selectProduct(index: number, p: PickerProduct) {
    const current = getValues(`items.${index}`);
    items.update(index, {
      productId: p.id,
      description: p.description && p.description !== p.name ? `${p.name}\n${p.description}` : p.name,
      hsnCode: p.hsnCode,
      unit: p.unit,
      quantity: current.quantity || "1",
      rate: paiseToRupeeString(p.sellingPrice),
      gstRate: ((GST_RATES as readonly string[]).includes(p.gstRate) ? p.gstRate : defaultGstRate) as GstRate,
    });
  }

  function addItem(product?: PickerProduct) {
    items.append({ productId: "", description: "", hsnCode: "", unit: "PCS", quantity: "1", rate: "", gstRate: defaultGstRate as GstRate });
    if (product) selectProduct(items.fields.length, product);
  }

  /* -------------------------------- actions -------------------------------- */

  const onInvalid = (errors: FieldErrors<InvoiceFormValues>) => {
    setAttempted(true);
    toast.error(errors.items?.root?.message ?? errors.items?.message ?? "Please fix the highlighted fields.");
  };

  async function saveDraft(): Promise<string | null> {
    let savedId: string | null = null;
    await form.handleSubmit(async (vals) => {
      setPending("draft");
      const result = await saveDraftInvoice(vals, invoiceId);
      setPending(null);
      const data = handleActionResult(result, form);
      if (data) {
        form.reset(vals);
        savedId = data.id;
        if (!invoiceId) router.replace(`/dashboard/invoices/${data.id}/edit`);
      }
    }, onInvalid)();
    return savedId;
  }

  async function downloadPdf() {
    const id = await saveDraft();
    if (!id) return;
    setPending("pdf");
    const link = document.createElement("a");
    link.href = `/api/billing/invoices/${id}/pdf/?download=1`;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => setPending(null), 1500);
  }

  async function requestGenerate() {
    const valid = await form.trigger();
    if (!valid) return onInvalid(form.formState.errors);
    setConfirmOpen(true);
  }

  async function confirmGenerate() {
    setPending("generate");
    const vals = getValues();
    const result = await generateInvoice(vals, invoiceId);
    const data = handleActionResult(result, form);
    if (data) {
      form.reset(vals);
      router.push(`/dashboard/invoices/${data.id}`);
      return true;
    }
    setPending(null);
    return false;
  }

  const busy = pending !== null;
  const stockWarnings = (values.items ?? []).map((item) => {
    const product = item.productId ? products.find((p) => p.id === item.productId) : undefined;
    if (!product || isServiceCode(product.hsnCode)) return null;
    try {
      return new Decimal(item.quantity || "0").gt(product.availableQty) ? product : null;
    } catch {
      return null;
    }
  });
  const shortName = isBos ? "bill" : "invoice";

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/dashboard/invoices" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All invoices
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight">{invoiceId ? "Edit draft" : "New invoice"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Totals update as you type. The number is assigned when you generate.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye /> Preview
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer /> Print
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={downloadPdf} disabled={busy}>
                <Download /> Download PDF (draft)
              </DropdownMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem disabled>
                      <Share2 /> Share
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">Generate it first to get a shareable link.</TooltipContent>
              </Tooltip>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=company">
                  <Building2 /> Company details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=invoice">
                  <Settings2 /> Invoice settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {props.replacesNumber && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <FileCheck2 className="size-4 shrink-0" /> Correction of cancelled invoice <span className="font-semibold">{props.replacesNumber}</span>. Generating this draft issues a
          new number.
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} noValidate className="@container/form space-y-5">
        {/* 1. Document type */}
        <RadioGroup value={type} onValueChange={(v) => changeType(v as InvoiceType)} aria-label="Invoice type" className="grid gap-3 @xl/form:grid-cols-2">
          {INVOICE_TYPES.map((t) => {
            const option = TYPE_OPTIONS[t];
            const selected = t === type;
            return (
              <label
                key={t}
                htmlFor={`invoice-type-${t}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 shadow-xs transition",
                  selected ? "border-primary ring-1 ring-primary" : "hover:border-primary/40",
                )}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg transition", selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                  <option.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{invoiceTypeLabels[t]}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{option.description}</span>
                  {autoNumbering && <span className="tabular mt-2 block text-xs text-muted-foreground">Next no. {nextNumberFor(t)}</span>}
                </span>
                <RadioGroupItem id={`invoice-type-${t}`} value={t} className="mt-1" />
              </label>
            );
          })}
        </RadioGroup>

        {/* 2. The document */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
          {/* Seller + numbering */}
          <section className="grid gap-6 border-b p-5 sm:p-6 @3xl/form:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
            <div className="min-w-0">
              <SectionLabel>From</SectionLabel>
              <div className="mt-3 flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <Building2 className="size-5" />
                </span>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-foreground">{seller.name}</p>
                  {seller.address && <p className="whitespace-pre-line text-muted-foreground">{seller.address}</p>}
                  <p className="text-muted-foreground">
                    {[seller.gstin && `GSTIN ${seller.gstin}`, sellerState && `${sellerState} (${seller.stateCode})`].filter(Boolean).join(" · ")}
                  </p>
                  <Link href="/dashboard/settings?tab=company" className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
                    Edit company details
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid content-start gap-4 rounded-xl border bg-slate-50/70 p-4 sm:grid-cols-2">
              {autoNumbering ? (
                <div className="space-y-1.5 sm:col-span-2">
                  <p className="text-[13px] font-medium">{isBos ? "Bill number" : "Invoice number"}</p>
                  <div className="flex h-9 items-center justify-between gap-2 rounded-md border border-dashed bg-white px-3 text-sm">
                    <span className="tabular truncate font-semibold">{numberLabel}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">assigned on generate</span>
                  </div>
                </div>
              ) : (
                <TextField
                  control={control}
                  name="invoiceNumber"
                  label={isBos ? "Bill number" : "Invoice number"}
                  placeholder={`e.g. ${props.nextNumbers[type]}`}
                  description="Automatic numbering is off"
                  className="sm:col-span-2"
                />
              )}
              <Controller
                control={control}
                name="invoiceDate"
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <label htmlFor="invoiceDate" className="text-[13px] font-medium">
                      {isBos ? "Bill date" : "Invoice date"} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      className="bg-white"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        const due = getValues("dueDate");
                        if (e.target.value && (!due || due < e.target.value)) setValue("dueDate", addDaysISO(e.target.value, defaultDueDays), { shouldDirty: true });
                      }}
                    />
                    {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <TextField control={control} name="dueDate" label="Due date" type="date" className="[&_input]:bg-white" />
              {isBos ? (
                <p className="flex items-start gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-muted-foreground ring-1 ring-border sm:col-span-2">
                  <Info className="mt-px size-3.5 shrink-0 text-primary" />
                  No GST is charged on a bill of supply, so place of supply and tax rates aren&rsquo;t needed.
                </p>
              ) : (
                <>
                  <SelectField
                    control={control}
                    name="placeOfSupply"
                    label="Place of supply"
                    required
                    options={stateOptions}
                    placeholder="Select state"
                    className="sm:col-span-2 [&_button]:bg-white"
                    onValueChange={() => (posTouched.current = true)}
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                    {liveDoc.taxType === "intra" ? (
                      <ToneBadge tone="green">Intra-state · CGST + SGST</ToneBadge>
                    ) : (
                      <ToneBadge tone="blue">Inter-state · IGST</ToneBadge>
                    )}
                    <span>Supplier in {sellerState || "—"}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Parties */}
          <section className="grid divide-y border-b @3xl/form:grid-cols-2 @3xl/form:divide-x @3xl/form:divide-y-0">
            <div className="@container/party min-w-0 space-y-4 p-5 sm:p-6">
              <SectionLabel
                action={
                  <Button type="button" variant="ghost" size="sm" className="-my-1 h-7 text-primary" onClick={() => setNewCustomerOpen(true)}>
                    <UserPlus /> New customer
                  </Button>
                }
              >
                Bill to
              </SectionLabel>
              <CustomerPicker customers={customers} value={values.customerId} onSelect={selectCustomer} />
              {showBillFields ? (
                <div className="grid gap-4 @sm/party:grid-cols-2">
                  <TextField control={control} name="billName" label="Customer name" required className="@sm/party:col-span-2" />
                  <TextField control={control} name="billGstin" label="GSTIN/UIN" className="[&_input]:uppercase" maxLength={15} />
                  <StateSelectField form={form} codeField="billStateCode" nameField="billState" label="State" required />
                  <TextField control={control} name="billPhone" label="Phone" type="tel" />
                  <TextField control={control} name="billEmail" label="Email" type="email" />
                  <TextareaField control={control} name="billAddress" label="Address" rows={2} required className="@sm/party:col-span-2" />
                  {values.customerId && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground @sm/party:col-span-2">
                      <span>Changes apply to this invoice only, not the saved customer.</span>
                      <Button type="button" variant="outline" size="sm" className="h-7" onClick={() => setEditingBill(false)}>
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <PartySummary
                  name={values.billName}
                  address={values.billAddress}
                  lines={[
                    [values.billGstin && `GSTIN ${values.billGstin}`, values.billState && `${values.billState} (${values.billStateCode})`],
                    [values.billPhone, values.billEmail],
                  ]}
                  actions={
                    <>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label="Edit billing details" onClick={() => setEditingBill(true)}>
                        <Pencil />
                      </Button>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove customer" onClick={unlinkCustomer}>
                        <X />
                      </Button>
                    </>
                  }
                />
              )}
            </div>

            <div className="@container/party min-w-0 space-y-4 p-5 sm:p-6">
              <SectionLabel>Ship to</SectionLabel>
              <CheckboxField control={control} name="shipSameAsBilling" label="Same as billing address" />
              {values.shipSameAsBilling ? (
                <p className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
                  Goods are delivered to the billing address{values.billName ? ` of ${values.billName}` : ""}.
                </p>
              ) : (
                <div className="grid gap-4 @sm/party:grid-cols-2">
                  <TextField control={control} name="shipName" label="Company name" required className="@sm/party:col-span-2" />
                  <TextField control={control} name="shipGstin" label="GSTIN" className="[&_input]:uppercase" maxLength={15} />
                  <StateSelectField form={form} codeField="shipStateCode" nameField="shipState" label="State" />
                  <TextareaField control={control} name="shipAddress" label="Shipping address" rows={2} className="@sm/party:col-span-2" />
                </div>
              )}
            </div>
          </section>

          {/* Transport (optional, collapsible) */}
          <section className="border-b">
            <button
              type="button"
              onClick={() => setTransportOpen((o) => !o)}
              aria-expanded={showTransport}
              aria-controls="transport-fields"
              className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition hover:bg-muted/40 sm:px-6"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Truck className="size-4 text-primary" /> Transport & e-way bill
                <span className="text-xs font-normal text-muted-foreground">{transportFilled ? `${transportFilled} of 4 filled` : "optional"}</span>
              </span>
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", showTransport && "rotate-180")} />
            </button>
            {showTransport && (
              <div id="transport-fields" className="grid gap-4 px-5 pb-5 sm:px-6 @lg/form:grid-cols-2 @4xl/form:grid-cols-4">
                <TextField control={control} name="vehicleNumber" label="Vehicle number" placeholder="e.g. UP14 AB 1234" className="[&_input]:uppercase" />
                <TextField control={control} name="transporterName" label="Transporter name" />
                <TextField control={control} name="lrNumber" label="LR number" />
                <TextField control={control} name="ewayBillNumber" label="E-way bill number" placeholder="12-digit EWB no." />
              </div>
            )}
          </section>

          {/* Items */}
          <section className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
              <SectionLabel>
                Items <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{items.fields.length}</span>
              </SectionLabel>
              <ProductPicker
                products={products}
                onSelect={(p) => addItem(p)}
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    <PackageSearch /> Add from catalogue
                  </Button>
                }
              />
            </div>

            <div className="mt-4">
              <div
                aria-hidden="true"
                className={cn(
                  "hidden gap-x-2 border-y bg-slate-50 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-6 @5xl/form:grid",
                  ROW_GRID[type],
                )}
              >
                <span>#</span>
                <span>Item & description</span>
                <span>HSN/SAC</span>
                <span className="text-right">Qty</span>
                <span>Unit</span>
                <span className="text-right">Rate (₹)</span>
                {!isBos && <span>GST</span>}
                <span className="text-right">Amount (₹)</span>
                <span />
              </div>

              <div className="divide-y border-t @5xl/form:border-t-0">
                {items.fields.map((field, index) => {
                  const err = {
                    description: itemError(index, "description"),
                    hsnCode: itemError(index, "hsnCode"),
                    quantity: itemError(index, "quantity"),
                    rate: itemError(index, "rate"),
                  };
                  const low = stockWarnings[index];
                  return (
                    <div
                      key={field.id}
                      className={cn(
                        "grid grid-cols-[1.5rem_minmax(0,1fr)_2rem] items-start gap-x-2 gap-y-3 px-5 py-3 transition-colors focus-within:bg-emerald-50/40 sm:px-6 @5xl/form:gap-y-1.5",
                        ROW_GRID[type],
                      )}
                    >
                      <span className="tabular pt-2 text-sm font-medium text-muted-foreground">{index + 1}</span>

                      <div className="min-w-0">
                        <div className="flex items-start gap-1">
                          <Textarea
                            rows={1}
                            placeholder="Item description & specifications"
                            className="min-h-9 resize-none py-1.5"
                            aria-label={`Item ${index + 1} description`}
                            aria-invalid={!!err.description}
                            {...form.register(`items.${index}.description`)}
                          />
                          <ProductPicker
                            products={products}
                            onSelect={(p) => selectProduct(index, p)}
                            trigger={
                              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground" aria-label={`Choose item ${index + 1} from catalogue`}>
                                <PackageSearch />
                              </Button>
                            }
                          />
                        </div>
                        {err.description && <p className="mt-1 text-[11px] text-destructive">{err.description}</p>}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="mt-0.5 text-muted-foreground hover:bg-danger-soft hover:text-danger @5xl/form:order-last"
                        onClick={() => items.remove(index)}
                        disabled={items.fields.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <X />
                      </Button>

                      <div className="col-[2/-1] grid grid-cols-2 gap-2 @md/form:grid-cols-3 @5xl/form:contents">
                        <ItemCell label="HSN/SAC" error={err.hsnCode}>
                          <Input inputMode="numeric" placeholder="85076000" aria-label={`Item ${index + 1} HSN/SAC`} {...form.register(`items.${index}.hsnCode`)} aria-invalid={!!err.hsnCode} />
                        </ItemCell>
                        <ItemCell label="Qty" error={err.quantity}>
                          <Input
                            inputMode="decimal"
                            className="tabular text-right"
                            aria-label={`Item ${index + 1} quantity`}
                            {...form.register(`items.${index}.quantity`)}
                            aria-invalid={!!err.quantity}
                          />
                        </ItemCell>
                        <ItemCell label="Unit">
                          <Controller
                            control={control}
                            name={`items.${index}.unit`}
                            render={({ field: f }) => (
                              <Select value={f.value} onValueChange={f.onChange}>
                                <SelectTrigger className="w-full" aria-label={`Item ${index + 1} unit`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[...new Set([...UNITS, f.value].filter(Boolean))].map((u) => (
                                    <SelectItem key={u} value={u}>
                                      {u}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </ItemCell>
                        <ItemCell label="Rate (₹)" error={err.rate}>
                          <Input
                            inputMode="decimal"
                            placeholder="0.00"
                            className="tabular text-right"
                            aria-label={`Item ${index + 1} rate`}
                            {...form.register(`items.${index}.rate`)}
                            aria-invalid={!!err.rate}
                          />
                        </ItemCell>
                        {!isBos && (
                          <ItemCell label="GST">
                            <Controller
                              control={control}
                              name={`items.${index}.gstRate`}
                              render={({ field: f }) => (
                                <Select value={f.value} onValueChange={f.onChange}>
                                  <SelectTrigger className="w-full" aria-label={`Item ${index + 1} GST rate`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {gstOptions.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </ItemCell>
                        )}
                        <ItemCell label="Amount (₹)">
                          <p className="tabular flex h-9 items-center justify-end rounded-md bg-muted/50 px-3 text-sm font-semibold @5xl/form:bg-transparent @5xl/form:px-0">
                            {formatINR(totals.lines[index]?.amount ?? 0)}
                          </p>
                        </ItemCell>
                      </div>

                      {low && (
                        <p className="col-[2/-1] flex items-center gap-1.5 text-xs text-amber-700 @5xl/form:order-last">
                          <AlertTriangle className="size-3.5 shrink-0" /> Only {formatQty(low.availableQty)} {low.unit} in stock — generating this takes stock below zero.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t px-5 py-3 sm:px-6">
                {formState.errors.items?.root && <p className="mb-2 text-sm text-destructive">{formState.errors.items.root.message}</p>}
                <Button type="button" variant="ghost" size="sm" className="text-primary" onClick={() => addItem()}>
                  <Plus /> Add line
                </Button>
              </div>
            </div>
          </section>

          {/* Terms, bank and totals */}
          <section className="grid gap-6 p-5 sm:p-6 @3xl/form:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0 space-y-5">
              <TextareaField control={control} name="terms" label="Terms & conditions" rows={4} description="One term per line — numbered automatically on the invoice." />
              <TextareaField control={control} name="notes" label="Note (optional)" rows={2} />
              <div className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm">
                <Landmark className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Bank details printed on the {shortName}</p>
                  <p className="text-muted-foreground">
                    {[seller.bankName, seller.bankAccountNumber && `A/C ${seller.bankAccountNumber}`, seller.bankIfsc && `IFSC ${seller.bankIfsc}`].filter(Boolean).join(" · ") ||
                      "Not set yet"}
                  </p>
                </div>
                <Link href="/dashboard/settings?tab=invoice" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  Edit
                </Link>
              </div>
            </div>

            <div className="order-first @3xl/form:order-0">
              <div className="rounded-xl border bg-slate-50/70 p-4">
                <dl className="space-y-2 text-sm">
                  <SumRow label={isBos ? "Subtotal" : "Taxable value"} value={formatINR(totals.taxableAmount)} />
                  {!isBos &&
                    totals.breakup.map((r) =>
                      liveDoc.taxType === "intra" ? (
                        <div key={r.rate} className="space-y-2">
                          <SumRow label={`CGST @ ${halfRate(r.rate)}%`} value={formatINR(r.cgst)} muted />
                          <SumRow label={`SGST @ ${halfRate(r.rate)}%`} value={formatINR(r.sgst)} muted />
                        </div>
                      ) : (
                        <SumRow key={r.rate} label={`IGST @ ${r.rate}%`} value={formatINR(r.igst)} muted />
                      ),
                    )}
                  {roundOff && <SumRow label="Round off" value={formatSignedAmount(totals.roundOff)} muted />}
                </dl>
                <div className="mt-3 flex items-baseline justify-between gap-3 border-t pt-3">
                  <span className="font-semibold">Total payable</span>
                  <span className="tabular font-display text-2xl font-bold text-primary">{formatINR(totals.total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isBos ? "No GST on a bill of supply." : `GST ${formatINR(totals.totalTax)} · ${liveDoc.taxType === "intra" ? "CGST + SGST" : "IGST"}`}
                </p>
              </div>
            </div>
          </section>
        </div>
      </form>

      {/* Sticky action bar */}
      <div className="no-print sticky bottom-0 z-20 -mx-4 -mb-6 mt-6 border-t bg-white/95 shadow-[0_-4px_16px_-8px_rgba(15,23,42,0.12)] backdrop-blur md:-mx-6 lg:-mx-8 lg:-mb-8">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {invoiceTypeLabels[type]} · {items.fields.length} item{items.fields.length === 1 ? "" : "s"}
            </p>
            <p className="tabular truncate font-display text-lg font-bold leading-tight">{formatINR(totals.total)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={busy}>
              {pending === "draft" ? <Spinner /> : <Save />} <span className="hidden sm:inline">Save as draft</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button onClick={requestGenerate} disabled={busy}>
              {pending === "generate" ? <Spinner /> : <FileCheck2 />} Generate {shortName}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[94dvh] overflow-y-auto bg-slate-100 sm:max-w-[880px]">
          <DialogHeader>
            <DialogTitle>{invoiceTypeLabels[type]} preview</DialogTitle>
            <DialogDescription>This is how it will print. {autoNumbering && "The number shown is provisional until you generate."}</DialogDescription>
          </DialogHeader>
          <InvoiceFrame>
            <InvoiceSheet doc={liveDoc} logoUrl={props.logoUrl} signatureUrl={props.signatureUrl} />
          </InvoiceFrame>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer /> Print
            </Button>
            <Button variant="outline" onClick={downloadPdf} disabled={busy}>
              {pending === "pdf" || pending === "draft" ? <Spinner /> : <Download />} Download PDF
            </Button>
            <Button
              onClick={() => {
                setPreviewOpen(false);
                requestGenerate();
              }}
              disabled={busy}
            >
              <FileCheck2 /> Generate {shortName}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Generate this ${words.name.toLowerCase()}?`}
        confirmLabel={`Generate ${shortName}`}
        onConfirm={confirmGenerate}
        description={
          <div className="space-y-3">
            <p>
              It will be numbered{" "}
              <span className="font-semibold text-foreground">{autoNumbering ? `${numberLabel} (or the next free number)` : values.invoiceNumber}</span> and locked. After this
              it can&rsquo;t be edited or deleted — only cancelled and re-issued.
            </p>
            <dl className="grid grid-cols-2 gap-1 rounded-lg border bg-muted/40 p-3 text-sm">
              <dt>Type</dt>
              <dd className="text-right font-medium text-foreground">{invoiceTypeLabels[type]}</dd>
              <dt>Customer</dt>
              <dd className="truncate text-right font-medium text-foreground">{values.billName}</dd>
              <dt>Items</dt>
              <dd className="text-right font-medium text-foreground">{values.items?.length ?? 0}</dd>
              <dt>Total payable</dt>
              <dd className="tabular text-right font-semibold text-foreground">{formatINR(totals.total)}</dd>
            </dl>
          </div>
        }
      />

      <CustomerFormDialog
        open={newCustomerOpen}
        onOpenChange={setNewCustomerOpen}
        title="New customer"
        onSaved={(c) => {
          const option: PickerCustomer = {
            id: c.id,
            name: c.name,
            contactPerson: c.contactPerson,
            mobile: c.mobile,
            email: c.email,
            gstin: c.gstin,
            billingAddress: c.billingAddress,
            shippingAddress: c.shippingAddress,
            state: c.state,
            stateCode: c.stateCode,
          };
          setCustomers((list) => [...list, option].sort((a, b) => a.name.localeCompare(b.name)));
          selectCustomer(option);
        }}
      />

      <PrintPortal>
        <InvoiceSheet doc={liveDoc} logoUrl={props.logoUrl} signatureUrl={props.signatureUrl} />
      </PrintPortal>
    </div>
  );
}

function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>
      {action}
    </div>
  );
}

function PartySummary({ name, address, lines, actions }: { name: string; address: string; lines: (string | false | undefined)[][]; actions: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border bg-slate-50/70 px-4 py-3">
      <div className="min-w-0 space-y-0.5 text-sm">
        <p className="font-semibold text-foreground">{name}</p>
        {address && <p className="whitespace-pre-line text-muted-foreground">{address}</p>}
        {lines.map((parts, i) => {
          const text = parts.filter(Boolean).join(" · ");
          return text ? (
            <p key={i} className="text-muted-foreground">
              {text}
            </p>
          ) : null;
        })}
      </div>
      <div className="-mr-2 -mt-1 flex shrink-0">{actions}</div>
    </div>
  );
}

function ItemCell({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1 @5xl/form:space-y-0">
      <p aria-hidden="true" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground @5xl/form:hidden">
        {label}
      </p>
      {children}
      {error && <p className="text-[11px] leading-tight text-destructive">{error}</p>}
    </div>
  );
}

function SumRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-4", muted && "text-muted-foreground")}>
      <dt>{label}</dt>
      <dd className="tabular">{value}</dd>
    </div>
  );
}
