"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Eye, FilePlus2, IndianRupee, MoreHorizontal, Pencil, Plus, Trash2, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { CUSTOMER_TYPES, customerTypeLabels } from "@/lib/billing/constants";
import { todayISO } from "@/lib/billing/dates";
import { formatINR, formatINRCompact } from "@/lib/billing/money";
import type { Customer } from "@/server/db/schema";
import { deleteCustomer } from "../actions";
import { CustomerFormDialog } from "./customer-form-dialog";

export type CustomerListItem = Customer & {
  invoiceCount: number;
  billed: number;
  received: number;
  outstanding: number;
  lastInvoiceDate: string | null;
};

export function CustomersView({ customers }: { customers: CustomerListItem[] }) {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [state, setState] = useState("all");
  const [balance, setBalance] = useState("all");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<CustomerListItem | null>(null);

  const stateOptions = useMemo(
    () =>
      [...new Set(customers.map((c) => c.state).filter(Boolean))]
        .sort()
        .map((s) => ({ value: s, label: s })),
    [customers],
  );

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (type === "all" || c.customerType === type) &&
          (state === "all" || c.state === state) &&
          (balance === "all" || (balance === "due" ? c.outstanding > 0 : c.outstanding === 0)),
      ),
    [customers, type, state, balance],
  );

  const stats = useMemo(() => {
    const monthPrefix = todayISO().slice(0, 7);
    return {
      total: customers.length,
      b2b: customers.filter((c) => c.gstin).length,
      outstanding: customers.reduce((s, c) => s + c.outstanding, 0),
      withDues: customers.filter((c) => c.outstanding > 0).length,
      newThisMonth: customers.filter((c) => c.createdAt.startsWith(monthPrefix)).length,
    };
  }, [customers]);

  const columns = useMemo<ColumnDef<CustomerListItem, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} title="Customer" />,
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <Link href={`/dashboard/customers/${row.original.id}`} className="font-medium text-foreground hover:text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
              {row.original.name}
            </Link>
            <p className="text-xs text-muted-foreground">{row.original.contactPerson || customerTypeLabels[row.original.customerType]}</p>
          </div>
        ),
      },
      {
        id: "contact",
        accessorFn: (c) => `${c.mobile} ${c.email}`,
        header: "Contact",
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{row.original.mobile || "—"}</p>
            {row.original.email && <p className="max-w-[200px] truncate text-xs text-muted-foreground">{row.original.email}</p>}
          </div>
        ),
      },
      { accessorKey: "gstin", header: "GSTIN", cell: ({ getValue }) => <span className="font-mono text-xs">{(getValue() as string) || "—"}</span> },
      { accessorKey: "state", header: "State", cell: ({ getValue }) => (getValue() as string) || "—" },
      {
        accessorKey: "invoiceCount",
        header: ({ column }) => <SortableHeader column={column} title="Invoices" />,
        meta: { align: "center" },
      },
      {
        accessorKey: "billed",
        header: ({ column }) => <SortableHeader column={column} title="Total billed" align="right" />,
        meta: { align: "right" },
        cell: ({ getValue }) => formatINR(getValue() as number),
      },
      {
        accessorKey: "outstanding",
        header: ({ column }) => <SortableHeader column={column} title="Outstanding" align="right" />,
        meta: { align: "right" },
        cell: ({ getValue }) => {
          const v = getValue() as number;
          return v > 0 ? <span className="font-semibold text-amber-700">{formatINR(v)}</span> : <span className="text-muted-foreground">{formatINR(0)}</span>;
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        meta: { align: "right" },
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/customers/${row.original.id}`}>
                    <Eye /> View profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/invoices/new?customer=${row.original.id}`}>
                    <FilePlus2 /> New invoice
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setEditing(row.original)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(row.original)}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );

  const addButton = (
    <CustomerFormDialog
      trigger={
        <Button>
          <Plus /> Add customer
        </Button>
      }
      onSaved={(c) => router.push(`/dashboard/customers/${c.id}`)}
    />
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everyone you bill, with their purchases and outstanding balances.</p>
        </div>
        {addButton}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total customers" value={stats.total} icon={Users} tone="green" />
        <StatCard label="GST-registered" value={stats.b2b} icon={Building2} tone="blue" hint="Customers with a GSTIN" />
        <StatCard
          label="Outstanding"
          value={formatINRCompact(stats.outstanding)}
          icon={IndianRupee}
          tone={stats.outstanding ? "amber" : "slate"}
          hint={`${stats.withDues} customer${stats.withDues === 1 ? "" : "s"} with dues`}
        />
        <StatCard label="New this month" value={stats.newThisMonth} icon={UserPlus} tone="violet" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search name, GSTIN, phone, email…"
        onRowClick={(c) => router.push(`/dashboard/customers/${c.id}`)}
        toolbar={
          <>
            <FilterSelect
              value={type}
              onChange={setType}
              placeholder="Type"
              allLabel="All types"
              options={CUSTOMER_TYPES.map((t) => ({ value: t, label: customerTypeLabels[t] }))}
            />
            <FilterSelect value={state} onChange={setState} placeholder="State" allLabel="All states" options={stateOptions} />
            <FilterSelect
              value={balance}
              onChange={setBalance}
              placeholder="Balance"
              allLabel="Any balance"
              options={[
                { value: "due", label: "Has outstanding" },
                { value: "clear", label: "No dues" },
              ]}
            />
          </>
        }
        empty={<EmptyState icon={Users} title="No customers yet" description="Add your first customer, or convert a qualified lead." action={addButton} />}
      />

      <CustomerFormDialog customer={editing ?? undefined} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name}”?`}
        description={
          deleting?.invoiceCount ? (
            <span>
              This customer has invoices and can&rsquo;t be deleted. <ToneBadge tone="amber">{deleting.invoiceCount} invoices</ToneBadge>
            </span>
          ) : (
            "This permanently removes the customer record."
          )
        }
        confirmLabel="Delete customer"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deleteCustomer(deleting.id);
          handleActionResult(result);
          return result.ok;
        }}
      />
    </>
  );
}
