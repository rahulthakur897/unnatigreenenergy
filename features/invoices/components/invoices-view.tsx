"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Copy, Download, Eye, FilePlus2, FileText, IndianRupee, MoreHorizontal, Pencil, Printer, Trash2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState, InvoiceStatusBadge, StatCard } from "@/components/billing/common";
import { ConfirmDialog } from "@/components/billing/confirm-dialog";
import { DataTable, FilterSelect, SortableHeader } from "@/components/billing/data-table";
import { ExportMenu } from "@/components/billing/export-menu";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/billing/ui/dropdown-menu";
import { Input } from "@/components/billing/ui/input";
import {
  INVOICE_STATUSES,
  INVOICE_TYPES,
  invoiceStatusLabels,
  invoiceTypeLabels,
  PAYMENT_STATUSES,
  paymentStatusLabels,
  type InvoiceStatus,
  type InvoiceType,
  type PaymentStatus,
} from "@/lib/billing/constants";
import { formatDate, formatDateTime } from "@/lib/billing/dates";
import { formatINR, formatINRCompact } from "@/lib/billing/money";
import { deleteDraftAction, duplicateInvoiceAction } from "../actions";

export type InvoiceRow = {
  id: string;
  invoiceType: InvoiceType;
  invoiceNumber: string | null;
  invoiceDate: string;
  dueDate: string | null;
  customerId: string | null;
  billName: string;
  billGstin: string;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
  paid: number;
  balance: number;
  paymentStatus: PaymentStatus | null;
};

export function InvoicesView({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [deleting, setDeleting] = useState<InvoiceRow | null>(null);

  const customerOptions = useMemo(
    () =>
      [...new Map(invoices.map((i) => [i.customerId ?? `name:${i.billName}`, i.billName])).entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label })),
    [invoices],
  );

  const filtered = useMemo(
    () =>
      invoices.filter(
        (i) =>
          (type === "all" || i.invoiceType === type) &&
          (status === "all" || i.status === status) &&
          (payment === "all" || i.paymentStatus === payment) &&
          (customer === "all" || (i.customerId ?? `name:${i.billName}`) === customer) &&
          (!from || i.invoiceDate >= from) &&
          (!to || i.invoiceDate <= to),
      ),
    [invoices, type, status, payment, customer, from, to],
  );

  const stats = useMemo(() => {
    const generated = filtered.filter((i) => i.status === "generated");
    return {
      invoiced: generated.reduce((s, i) => s + i.total, 0),
      collected: generated.reduce((s, i) => s + Math.min(i.paid, i.total), 0),
      outstanding: generated.reduce((s, i) => s + i.balance, 0),
      overdue: generated.filter((i) => i.paymentStatus === "overdue"),
      count: generated.length,
      drafts: filtered.filter((i) => i.status === "draft").length,
    };
  }, [filtered]);

  async function duplicate(id: string) {
    const data = handleActionResult(await duplicateInvoiceAction(id));
    if (data) router.push(`/dashboard/invoices/${data.id}/edit`);
  }

  const columns = useMemo<ColumnDef<InvoiceRow, unknown>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: ({ column }) => <SortableHeader column={column} title="Invoice No." />,
        cell: ({ row }) => (
          <Link href={`/dashboard/invoices/${row.original.id}`} className="tabular whitespace-nowrap font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
            {row.original.invoiceNumber ?? <span className="italic text-muted-foreground">Draft</span>}
          </Link>
        ),
        sortingFn: (a, b) => (a.original.invoiceNumber ?? "").localeCompare(b.original.invoiceNumber ?? "", undefined, { numeric: true }),
      },
      {
        accessorKey: "invoiceType",
        header: "Type",
        cell: ({ row }) => <span className="whitespace-nowrap text-xs text-muted-foreground">{invoiceTypeLabels[row.original.invoiceType]}</span>,
      },
      {
        accessorKey: "invoiceDate",
        header: ({ column }) => <SortableHeader column={column} title="Invoice date" />,
        cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.invoiceDate)}</span>,
      },
      {
        accessorKey: "billName",
        header: ({ column }) => <SortableHeader column={column} title="Customer" />,
        cell: ({ row }) => <span className="block max-w-[220px] truncate font-medium">{row.original.billName}</span>,
      },
      { accessorKey: "billGstin", header: "GSTIN", cell: ({ getValue }) => <span className="font-mono text-xs">{(getValue() as string) || "—"}</span> },
      {
        accessorKey: "total",
        header: ({ column }) => <SortableHeader column={column} title="Total" align="right" />,
        meta: { align: "right" },
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{formatINR(row.original.total)}</p>
            {row.original.balance > 0 && row.original.balance < row.original.total && (
              <p className="text-xs text-amber-700">{formatINR(row.original.balance)} due</p>
            )}
          </div>
        ),
      },
      {
        id: "status",
        accessorFn: (i) => (i.paymentStatus ? paymentStatusLabels[i.paymentStatus] : invoiceStatusLabels[i.status]),
        header: "Status",
        cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} paymentStatus={row.original.paymentStatus} />,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column} title="Created" />,
        cell: ({ getValue }) => <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(getValue() as string)}</span>,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        meta: { align: "right" },
        cell: ({ row }) => {
          const inv = row.original;
          const pdf = `/api/billing/invoices/${inv.id}/pdf/`;
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${inv.invoiceNumber ?? "draft"}`}>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${inv.id}`}>
                      <Eye /> View invoice
                    </Link>
                  </DropdownMenuItem>
                  {inv.status === "draft" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/invoices/${inv.id}/edit`}>
                        <Pencil /> Edit draft
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <a href={`${pdf}?download=1`}>
                      <Download /> Download PDF
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${inv.id}?print=1`}>
                      <Printer /> Print
                    </Link>
                  </DropdownMenuItem>
                  {inv.status === "generated" && inv.balance > 0 && (
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/invoices/${inv.id}`}>
                        <Wallet /> Record payment
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => duplicate(inv.id)}>
                    <Copy /> Duplicate
                  </DropdownMenuItem>
                  {inv.status === "draft" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(inv)}>
                        <Trash2 /> Delete draft
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hasFilters = type !== "all" || status !== "all" || payment !== "all" || customer !== "all" || from || to;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">All Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every tax invoice and bill of supply — drafts, generated and cancelled — with payment status.</p>
        </div>
        <div className="flex gap-2">
          <ExportMenu entity="invoices" />
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <FilePlus2 /> Create invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Invoiced" value={formatINRCompact(stats.invoiced)} icon={FileText} tone="green" hint={`${stats.count} generated${stats.drafts ? ` · ${stats.drafts} drafts` : ""}`} />
        <StatCard label="Collected" value={formatINRCompact(stats.collected)} icon={Wallet} tone="blue" hint={formatINR(stats.collected)} />
        <StatCard label="Outstanding" value={formatINRCompact(stats.outstanding)} icon={IndianRupee} tone="amber" hint={formatINR(stats.outstanding)} />
        <StatCard
          label="Overdue"
          value={stats.overdue.length}
          icon={AlertTriangle}
          tone={stats.overdue.length ? "red" : "slate"}
          hint={formatINR(stats.overdue.reduce((s, i) => s + i.balance, 0))}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search invoice no., customer, GSTIN…"
        onRowClick={(i) => router.push(`/dashboard/invoices/${i.id}`)}
        initialSorting={[{ id: "invoiceDate", desc: true }]}
        toolbar={
          <>
            <FilterSelect value={customer} onChange={setCustomer} placeholder="Customer" allLabel="All customers" options={customerOptions} />
            <FilterSelect
              value={type}
              onChange={setType}
              placeholder="Type"
              allLabel="All types"
              options={INVOICE_TYPES.map((t) => ({ value: t, label: invoiceTypeLabels[t] }))}
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Invoice status"
              allLabel="Any invoice status"
              options={INVOICE_STATUSES.map((s) => ({ value: s, label: invoiceStatusLabels[s] }))}
            />
            <FilterSelect
              value={payment}
              onChange={setPayment}
              placeholder="Payment status"
              allLabel="Any payment status"
              options={PAYMENT_STATUSES.map((s) => ({ value: s, label: paymentStatusLabels[s] }))}
            />
            <div className="flex items-center gap-1.5">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-[150px] bg-white" aria-label="From date" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-[150px] bg-white" aria-label="To date" />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setType("all");
                  setStatus("all");
                  setPayment("all");
                  setCustomer("all");
                  setFrom("");
                  setTo("");
                }}
              >
                Reset
              </Button>
            )}
          </>
        }
        empty={
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first tax invoice or bill of supply — it takes about a minute."
            action={
              <Button asChild>
                <Link href="/dashboard/invoices/new">
                  <FilePlus2 /> Create invoice
                </Link>
              </Button>
            }
          />
        }
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this draft?"
        description={`The draft for ${deleting?.billName ?? ""} will be permanently removed. Generated invoices can't be deleted.`}
        confirmLabel="Delete draft"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deleteDraftAction(deleting.id);
          handleActionResult(result);
          return result.ok;
        }}
      />
    </>
  );
}
