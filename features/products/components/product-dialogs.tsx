"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { MoneyField, SelectField, TextareaField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/billing/ui/dialog";
import { Input } from "@/components/billing/ui/input";
import { Spinner } from "@/components/billing/ui/spinner";
import { GST_RATES, productStatusLabels, PRODUCT_STATUSES, UNITS } from "@/lib/billing/constants";
import { formatQty, paiseToRupeeString } from "@/lib/billing/money";
import { cn } from "@/lib/ui-utils";
import { adjustStock, createCategory, createProduct, deleteCategory, updateProduct } from "../actions";
import { categorySchema, productSchema, stockAdjustmentSchema, type CategoryInput, type ProductInput, type StockAdjustmentInput } from "../schemas";

export type EditableProduct = {
  id: string;
  name: string;
  description: string;
  hsnCode: string;
  unit: string;
  categoryId: string | null;
  availableQty: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: string;
  status: "active" | "inactive";
};

type Category = { id: string; name: string; productCount: number };

const gstOptions = GST_RATES.map((r) => ({ value: r, label: `${r}%` }));
const unitOptions = UNITS.map((u) => ({ value: u, label: u }));
const statusOptions = PRODUCT_STATUSES.map((s) => ({ value: s, label: productStatusLabels[s] }));

export function ProductFormDialog({
  product,
  categories,
  trigger,
  open,
  onOpenChange,
  defaultGstRate = "18",
}: {
  product?: EditableProduct;
  categories: Category[];
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultGstRate?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [pending, startTransition] = useTransition();
  const editing = !!product;

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    values: product
      ? {
          name: product.name,
          description: product.description,
          hsnCode: product.hsnCode,
          unit: product.unit,
          categoryId: product.categoryId ?? "none",
          availableQty: formatQty(product.availableQty),
          purchasePrice: paiseToRupeeString(product.purchasePrice),
          sellingPrice: paiseToRupeeString(product.sellingPrice),
          gstRate: (GST_RATES as readonly string[]).includes(product.gstRate) ? (product.gstRate as ProductInput["gstRate"]) : "18",
          status: product.status,
        }
      : {
          name: "",
          description: "",
          hsnCode: "",
          unit: "PCS",
          categoryId: "none",
          availableQty: "0",
          purchasePrice: "",
          sellingPrice: "",
          gstRate: ((GST_RATES as readonly string[]).includes(defaultGstRate) ? defaultGstRate : "18") as ProductInput["gstRate"],
          status: "active",
        },
  });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = editing ? await updateProduct(product.id, values) : await createProduct(values);
      handleActionResult(result, form);
      if (result.ok) {
        setOpen(false);
        if (!editing) form.reset();
      }
    }),
  );

  const categoryOptions = [{ value: "none", label: "Uncategorised" }, ...categories.map((c) => ({ value: c.id, label: c.name }))];

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit product" : "Add product or service"}</DialogTitle>
          <DialogDescription>Products appear in the invoice item picker with their HSN code, rate and GST.</DialogDescription>
        </DialogHeader>
        <form id="product-form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-6">
          <TextField control={form.control} name="name" label="Product name" required className="sm:col-span-4" placeholder="e.g. NMC Module 72V Refurbished" />
          <SelectField control={form.control} name="status" label="Status" options={statusOptions} className="sm:col-span-2" />
          <TextareaField control={form.control} name="description" label="Description" rows={2} className="sm:col-span-6" placeholder="Specifications shown on the invoice (optional)" />
          <TextField control={form.control} name="hsnCode" label="HSN/SAC code" inputMode="numeric" className="sm:col-span-2" placeholder="85076000" />
          <SelectField control={form.control} name="categoryId" label="Category" options={categoryOptions} className="sm:col-span-2" />
          <SelectField control={form.control} name="unit" label="Unit" options={unitOptions} className="sm:col-span-2" />
          <MoneyField control={form.control} name="purchasePrice" label="Purchase price" className="sm:col-span-2" description="Used for profit reports" />
          <MoneyField control={form.control} name="sellingPrice" label="Selling price" className="sm:col-span-2" description="Default invoice rate" />
          <SelectField control={form.control} name="gstRate" label="GST rate" options={gstOptions} className="sm:col-span-2" />
          {!editing && (
            <TextField
              control={form.control}
              name="availableQty"
              label="Opening stock"
              inputMode="decimal"
              className="sm:col-span-2"
              description="Change stock later with ‘Adjust stock’."
            />
          )}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={pending}>
            {pending && <Spinner />} {editing ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StockAdjustDialog({
  product,
  open,
  onOpenChange,
}: {
  product: { id: string; name: string; unit: string; availableQty: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<StockAdjustmentInput>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: { direction: "add", quantity: "", note: "" },
  });
  const direction = form.watch("direction");

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      if (!product) return;
      const result = await adjustStock(product.id, values);
      if (handleActionResult(result, form)) {
        onOpenChange(false);
        form.reset({ direction: "add", quantity: "", note: "" });
      }
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {product?.name} — currently{" "}
            <span className="font-medium text-foreground">
              {formatQty(product?.availableQty ?? "0")} {product?.unit}
            </span>
          </DialogDescription>
        </DialogHeader>
        <form id="stock-form" onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Adjustment type">
            {(["add", "remove"] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={direction === d}
                onClick={() => form.setValue("direction", d)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                  direction === d ? (d === "add" ? "border-primary bg-secondary text-primary" : "border-destructive/40 bg-danger-soft text-danger") : "hover:bg-muted",
                )}
              >
                {d === "add" ? <Plus className="size-4" /> : <Minus className="size-4" />}
                {d === "add" ? "Add stock" : "Remove stock"}
              </button>
            ))}
          </div>
          <TextField control={form.control} name="quantity" label={`Quantity (${product?.unit ?? ""})`} inputMode="decimal" required autoFocus />
          <TextField control={form.control} name="note" label="Note" placeholder="e.g. Purchase from supplier, damaged units" />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="stock-form" disabled={pending}>
            {pending && <Spinner />} Update stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesDialog({ categories, trigger }: { categories: Category[]; trigger: ReactNode }) {
  const [pending, startTransition] = useTransition();
  const [removing, setRemoving] = useState<string | null>(null);
  const form = useForm<CategoryInput>({ resolver: zodResolver(categorySchema), defaultValues: { name: "" } });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = await createCategory(values);
      if (handleActionResult(result, form)) form.reset({ name: "" });
    }),
  );

  async function remove(id: string) {
    setRemoving(id);
    handleActionResult(await deleteCategory(id));
    setRemoving(null);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product categories</DialogTitle>
          <DialogDescription>Group products for filtering and reports. Deleting a category leaves its products uncategorised.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="flex items-start gap-2">
          <div className="flex-1">
            <Input placeholder="New category name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} aria-label="New category name" />
            {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : <Plus />} Add
          </Button>
        </form>
        <ul className="max-h-72 divide-y overflow-y-auto rounded-lg border">
          {categories.length === 0 && <li className="p-4 text-center text-sm text-muted-foreground">No categories yet.</li>}
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span>
                {c.name} <span className="text-xs text-muted-foreground">· {c.productCount} products</span>
              </span>
              <Button variant="ghost" size="icon-sm" onClick={() => remove(c.id)} disabled={removing === c.id} aria-label={`Delete ${c.name}`}>
                {removing === c.id ? <Spinner /> : <Trash2 className="text-muted-foreground" />}
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
