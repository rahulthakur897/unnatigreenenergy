"use client";

import { Ban, CheckCircle2, CircleDashed, Clock, FileEdit, TriangleAlert, type LucideIcon } from "lucide-react";
import { ChartLegendRow, Donut, MoneyBarChart, type SeriesDef } from "@/components/billing/charts";
import { formatMonthKey } from "@/lib/billing/dates";
import { formatINR } from "@/lib/billing/money";

const revenueSeries: SeriesDef[] = [
  { key: "invoiced", label: "Invoiced", color: "var(--chart-1)" },
  { key: "collected", label: "Collected", color: "var(--chart-2)" },
];

export function MonthlyRevenueChart({ data }: { data: { month: string; invoiced: number; collected: number }[] }) {
  return (
    <div className="space-y-3">
      <ChartLegendRow series={revenueSeries} />
      <MoneyBarChart
        data={data}
        xKey="month"
        series={revenueSeries}
        xFormatter={(m) => formatMonthKey(m, true).split(" ")[0]}
        tooltipLabelFormatter={(m) => formatMonthKey(m)}
      />
    </div>
  );
}

type StatusKey = "paid" | "partially_paid" | "pending" | "overdue" | "draft" | "cancelled";

const statusMeta: Record<StatusKey, { label: string; color: string; icon: LucideIcon }> = {
  paid: { label: "Paid", color: "var(--status-good)", icon: CheckCircle2 },
  partially_paid: { label: "Partially paid", color: "var(--chart-2)", icon: CircleDashed },
  pending: { label: "Pending", color: "var(--status-warning)", icon: Clock },
  overdue: { label: "Overdue", color: "var(--status-critical)", icon: TriangleAlert },
  draft: { label: "Draft", color: "var(--chart-4)", icon: FileEdit },
  cancelled: { label: "Cancelled", color: "var(--chart-5)", icon: Ban },
};

export function InvoiceStatusChart({ data }: { data: { key: StatusKey; count: number; amount: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
      <Donut
        height={180}
        centerValue={String(total)}
        centerLabel="invoices"
        data={data.map((d) => ({ key: d.key, label: statusMeta[d.key].label, value: d.count, color: statusMeta[d.key].color, detail: formatINR(d.amount) }))}
      />
      <ul className="space-y-2 text-sm">
        {data.map((d) => {
          const meta = statusMeta[d.key];
          return (
            <li key={d.key} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: meta.color }} aria-hidden="true" />
                <meta.icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">{meta.label}</span>
              </span>
              <span className="tabular shrink-0 text-muted-foreground">
                <span className="font-semibold text-foreground">{d.count}</span>
                {d.amount > 0 && <span className="ml-2 hidden text-xs sm:inline">{formatINR(d.amount)}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
