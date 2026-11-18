"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Eye, IndianRupee, MoreHorizontal, Pencil, Plus, Target, Trash2, TrendingUp, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState, LeadStatusBadge, StatCard } from "@/components/billing/common";
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
import { LEAD_SOURCES, LEAD_STATUSES, leadSourceLabels, leadStatusLabels } from "@/lib/billing/constants";
import { formatDate, todayISO } from "@/lib/billing/dates";
import { formatINR, formatINRCompact } from "@/lib/billing/money";
import { cn } from "@/lib/ui-utils";
import type { Lead } from "@/server/db/schema";
import { deleteLead } from "../actions";
import { LeadFormDialog } from "./lead-form-dialog";

export function LeadsView({ leads, productNames }: { leads: Lead[]; productNames: string[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const today = todayISO();

  const counts = useMemo(() => Object.fromEntries(LEAD_STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length])), [leads]);

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          (status === "all" || l.status === status) &&
          (source === "all" || l.source === source) &&
          (!from || l.createdAt.slice(0, 10) >= from) &&
          (!to || l.createdAt.slice(0, 10) <= to),
      ),
    [leads, status, source, from, to],
  );

  const stats = useMemo(() => {
    const open = leads.filter((l) => l.status !== "converted" && l.status !== "lost");
    const closed = leads.filter((l) => l.status === "converted" || l.status === "lost");
    return {
      open: open.length,
      pipeline: open.reduce((s, l) => s + l.expectedValue, 0),
      dueFollowUps: open.filter((l) => l.followUpDate && l.followUpDate <= today).length,
      conversion: closed.length ? Math.round((counts.converted / closed.length) * 100) : 0,
    };
  }, [leads, counts, today]);

  const columns = useMemo<ColumnDef<Lead, unknown>[]>(
    () => [
      {
        accessorKey: "leadName",
        header: ({ column }) => <SortableHeader column={column} title="Lead" />,
        cell: ({ row }) => (
          <div className="min-w-[180px] max-w-[260px]">
            <Link href={`/dashboard/leads/${row.original.id}`} className="font-medium hover:text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
              {row.original.leadName}
            </Link>
            <p className="truncate text-xs text-muted-foreground">{row.original.companyName || row.original.contactPerson || "—"}</p>
          </div>
        ),
      },
      {
        id: "contact",
        accessorFn: (l) => `${l.contactPerson} ${l.mobile} ${l.email}`,
        header: "Contact",
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{row.original.mobile || "—"}</p>
            {row.original.email && <p className="max-w-[180px] truncate text-xs text-muted-foreground">{row.original.email}</p>}
          </div>
        ),
      },
      {
        accessorKey: "productInterest",
        header: "Interested in",
        cell: ({ row }) => (
          <div className="max-w-[200px] text-sm">
            <p className="truncate">{row.original.productInterest || "—"}</p>
            {row.original.expectedQuantity && <p className="text-xs text-muted-foreground">{row.original.expectedQuantity}</p>}
          </div>
        ),
      },
      {
        accessorKey: "expectedValue",
        header: ({ column }) => <SortableHeader column={column} title="Deal value" align="right" />,
        meta: { align: "right" },
        cell: ({ getValue }) => ((getValue() as number) ? formatINR(getValue() as number) : <span className="text-muted-foreground">—</span>),
      },
      { accessorKey: "source", header: "Source", cell: ({ row }) => leadSourceLabels[row.original.source] },
      {
        accessorKey: "followUpDate",
        header: ({ column }) => <SortableHeader column={column} title="Follow-up" />,
        cell: ({ row }) => {
          const d = row.original.followUpDate;
          if (!d) return <span className="text-muted-foreground">—</span>;
          const closed = row.original.status === "converted" || row.original.status === "lost";
          return <span className={cn("whitespace-nowrap", !closed && d < today && "font-medium text-red-600", !closed && d === today && "font-medium text-amber-700")}>{formatDate(d)}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        meta: { align: "right" },
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.leadName}`}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/leads/${row.original.id}`}>
                    <Eye /> View details
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
    [today],
  );

  const addButton = (
    <LeadFormDialog
      products={productNames}
      trigger={
        <Button>
          <Plus /> Add lead
        </Button>
      }
    />
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enquiries and follow-ups — convert qualified leads into customers.</p>
        </div>
        <div className="flex gap-2">
          <ExportMenu entity="leads" />
          {addButton}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open leads" value={stats.open} icon={Target} tone="green" hint={`${leads.length} in total`} />
        <StatCard label="Pipeline value" value={formatINRCompact(stats.pipeline)} icon={IndianRupee} tone="blue" hint="Open leads' expected value" />
        <StatCard label="Follow-ups due" value={stats.dueFollowUps} icon={CalendarClock} tone={stats.dueFollowUps ? "amber" : "slate"} hint="Today or earlier" />
        <StatCard label="Conversion rate" value={`${stats.conversion}%`} icon={TrendingUp} tone="violet" hint={`${counts.converted} converted · ${counts.lost} lost`} />
      </div>

      {/* Pipeline quick filters */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {(["all", ...LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              status === s ? "border-primary bg-primary text-primary-foreground" : "bg-white text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "all" ? "All" : leadStatusLabels[s]}
            <span className={cn("rounded-full px-1.5 text-xs", status === s ? "bg-white/20" : "bg-muted")}>{s === "all" ? leads.length : counts[s]}</span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search name, company, phone, product…"
        onRowClick={(l) => router.push(`/dashboard/leads/${l.id}`)}
        toolbar={
          <>
            <FilterSelect
              value={source}
              onChange={setSource}
              placeholder="Source"
              allLabel="All sources"
              options={LEAD_SOURCES.map((s) => ({ value: s, label: leadSourceLabels[s] }))}
            />
            <div className="flex items-center gap-1.5">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-[150px] bg-white" aria-label="Created from" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-[150px] bg-white" aria-label="Created to" />
            </div>
          </>
        }
        empty={<EmptyState icon={UserPlus} title="No leads yet" description="Add enquiries from calls, WhatsApp, IndiaMART or referrals and track every follow-up." action={addButton} />}
      />

      <LeadFormDialog lead={editing ?? undefined} products={productNames} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.leadName}”?`}
        description="The lead and its activity history will be permanently removed. A customer created from it is kept."
        confirmLabel="Delete lead"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deleteLead(deleting.id);
          handleActionResult(result);
          return result.ok;
        }}
      />
    </>
  );
}
