"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Boxes, MoreHorizontal, Package, PackageCheck, PackageX, Pencil, Plus, Tags, Trash2, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, StatCard, ToneBadge } from "@/components/billing/common";
import { ConfirmDialog } from "@/components/billing/confirm-dialog";
import { DataTable, FilterSelect, SortableHeader } from "@/components/billing/data-table";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/billing/ui/dropdown-menu";
import { isServiceCode, productStatusLabels, PRODUCT_STATUSES } from "@/lib/billing/constants";
import { Decimal, formatINR, formatINRCompact, formatQty } from "@/lib/billing/money";
import { deleteProduct } from "../actions";
import { CategoriesDialog, ProductFormDialog, StockAdjustDialog, type EditableProduct } from "./product-dialogs";

export type ProductListItem = EditableProduct & { categoryName: string | null; invoiceCount: number };
type Category = { id: string; name: string; productCount: number };

const LOW_STOCK = 5;

function stockTone(qty: string) {
  const d = new Decimal(qty || "0");
  if (d.lte(0)) return "red" as const;
  if (d.lte(LOW_STOCK)) return "amber" as const;
  return "green" as const;
}

export function ProductsView({ products, categories, defaultGstRate }: { products: ProductListItem[]; categories: Category[]; defaultGstRate: string }) {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<ProductListItem | null>(null);
  const [adjusting, setAdjusting] = useState<ProductListItem | null>(null);
  const [deleting, setDeleting] = useState<ProductListItem | null>(null);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || (category === "none" ? !p.categoryId : p.categoryId === category)) &&
          (status === "all" || p.status === status),
      ),
    [products, category, status],
  );

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === "active");
    const lowStock = active.filter((p) => !isServiceCode(p.hsnCode) && new Decimal(p.availableQty).lte(LOW_STOCK)).length;
    const stockValue = products.reduce(
      (sum, p) => sum + new Decimal(p.availableQty).mul(p.purchasePrice).toDecimalPlaces(0).toNumber(),
      0,
    );
    return { total: products.length, active: active.length, lowStock, stockValue };
  }, [products]);

  const columns = useMemo<ColumnDef<ProductListItem, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} title="Product" />,
        cell: ({ row }) => (
          <div className="min-w-[200px] max-w-[320px]">
            <p className="font-medium text-foreground">{row.original.name}</p>
            {row.original.description && <p className="truncate text-xs text-muted-foreground">{row.original.description}</p>}
          </div>
        ),
      },
      { accessorKey: "categoryName", header: "Category", cell: ({ getValue }) => (getValue() as string) || <span className="text-muted-foreground">—</span> },
      { accessorKey: "hsnCode", header: "HSN/SAC", cell: ({ getValue }) => <span className="font-mono text-xs">{(getValue() as string) || "—"}</span> },
      {
        id: "stock",
        accessorFn: (p) => Number(p.availableQty),
        header: ({ column }) => <SortableHeader column={column} title="Stock" />,
        cell: ({ row }) =>
          isServiceCode(row.original.hsnCode) ? (
            <ToneBadge tone="blue">Service</ToneBadge>
          ) : (
            <ToneBadge tone={stockTone(row.original.availableQty)}>
              {formatQty(row.original.availableQty)} {row.original.unit}
            </ToneBadge>
          ),
      },
      {
        accessorKey: "purchasePrice",
        header: ({ column }) => <SortableHeader column={column} title="Purchase" align="right" />,
        meta: { align: "right" },
        cell: ({ getValue }) => formatINR(getValue() as number),
      },
      {
        accessorKey: "sellingPrice",
        header: ({ column }) => <SortableHeader column={column} title="Selling" align="right" />,
        meta: { align: "right" },
        cell: ({ getValue }) => <span className="font-medium">{formatINR(getValue() as number)}</span>,
      },
      { accessorKey: "gstRate", header: "GST", meta: { align: "center" }, cell: ({ getValue }) => `${getValue()}%` },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ToneBadge tone={row.original.status === "active" ? "green" : "slate"}>{productStatusLabels[row.original.status]}</ToneBadge>,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        meta: { align: "right" },
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditing(row.original)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setAdjusting(row.original)}>
                <Warehouse /> Adjust stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(row.original)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const addButton = (
    <ProductFormDialog
      categories={categories}
      defaultGstRate={defaultGstRate}
      trigger={
        <Button>
          <Plus /> Add product
        </Button>
      }
    />
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Products & Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your catalogue with HSN codes, prices, GST rates and stock.</p>
        </div>
        <div className="flex gap-2">
          <CategoriesDialog
            categories={categories}
            trigger={
              <Button variant="outline">
                <Tags /> Categories
              </Button>
            }
          />
          {addButton}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total products" value={stats.total} icon={Package} tone="green" />
        <StatCard label="Active" value={stats.active} icon={PackageCheck} tone="blue" />
        <StatCard label="Low / out of stock" value={stats.lowStock} icon={PackageX} tone={stats.lowStock ? "amber" : "slate"} hint={`${LOW_STOCK} units or fewer`} />
        <StatCard label="Stock value (cost)" value={formatINRCompact(stats.stockValue)} icon={Boxes} tone="violet" hint={formatINR(stats.stockValue)} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search name, HSN, description…"
        toolbar={
          <>
            <FilterSelect
              value={category}
              onChange={setCategory}
              placeholder="Category"
              allLabel="All categories"
              options={[{ value: "none", label: "Uncategorised" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Status"
              allLabel="All statuses"
              options={PRODUCT_STATUSES.map((s) => ({ value: s, label: productStatusLabels[s] }))}
            />
          </>
        }
        empty={
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add the items you sell — with HSN code, price and GST — to pick them quickly on invoices."
            action={addButton}
          />
        }
      />

      <ProductFormDialog
        product={editing ?? undefined}
        categories={categories}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <StockAdjustDialog product={adjusting} open={!!adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name}”?`}
        description="This permanently removes the product. Products already used on invoices can't be deleted — mark them inactive instead."
        confirmLabel="Delete product"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deleteProduct(deleting.id);
          handleActionResult(result);
          return result.ok;
        }}
      />
    </>
  );
}
