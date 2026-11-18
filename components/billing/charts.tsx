"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/billing/ui/chart";
import { formatINR, formatINRCompact } from "@/lib/billing/money";
import { cn } from "@/lib/ui-utils";

/**
 * Chart building blocks. Conventions (see the dataviz method):
 * single shared y-axis, hairline solid grid, thin bars with 4px rounded data ends,
 * 2px surface gap between adjacent bars, hover tooltip on every mark, legend for >= 2 series.
 */

export type SeriesDef = { key: string; label: string; color: string };

type TooltipRow = { name?: string | number; value?: number | string; color?: string; dataKey?: string | number; payload?: Record<string, unknown> };

export function MoneyTooltip({
  active,
  payload,
  label,
  labelFormatter,
  series,
}: {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  labelFormatter?: (label: string) => string;
  series: SeriesDef[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[180px] rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1.5 font-semibold text-foreground">{labelFormatter ? labelFormatter(String(label)) : label}</p>}
      <div className="space-y-1">
        {payload.map((row) => {
          const def = series.find((s) => s.key === row.dataKey);
          return (
            <div key={String(row.dataKey)} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm" style={{ background: def?.color ?? row.color }} />
                {def?.label ?? row.name}
              </span>
              <span className="tabular font-medium text-foreground">{formatINR(Number(row.value ?? 0))}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegendRow({ series, className }: { series: SeriesDef[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/** Vertical bars over categories (months), one or more money series on one axis. */
export function MoneyBarChart({
  data,
  xKey,
  series,
  xFormatter,
  tooltipLabelFormatter,
  height = 280,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: SeriesDef[];
  xFormatter?: (v: string) => string;
  tooltipLabelFormatter?: (v: string) => string;
  height?: number;
}) {
  const config = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }])) satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barGap={2} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={{ stroke: "var(--border)" }} tickMargin={8} tickFormatter={xFormatter} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={(v) => formatINRCompact(Number(v))} fontSize={11} />
        <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.6 }} content={<MoneyTooltip series={series} labelFormatter={tooltipLabelFormatter} />} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={26} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export type DonutSlice = { key: string; label: string; value: number; color: string; detail?: string };

/** Part-to-whole donut (<= 6 slices) with a 2px surface gap between segments and a centre total. */
export function Donut({ data, centerLabel, centerValue, height = 220 }: { data: DonutSlice[]; centerLabel: string; centerValue: string; height?: number }) {
  const visible = data.filter((d) => d.value > 0);
  return (
    <div className="relative" style={{ height }}>
      <ChartContainer config={Object.fromEntries(data.map((d) => [d.key, { label: d.label, color: d.color }]))} className="aspect-auto h-full w-full">
        <PieChart>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const slice = payload[0].payload as DonutSlice;
              return (
                <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <span className="size-2.5 rounded-sm" style={{ background: slice.color }} />
                    {slice.label}
                  </p>
                  <p className="tabular mt-0.5 text-muted-foreground">
                    {slice.value} invoice{slice.value === 1 ? "" : "s"}
                    {slice.detail && ` · ${slice.detail}`}
                  </p>
                </div>
              );
            }}
          />
          <Pie
            data={visible.length ? visible : [{ key: "empty", label: "No invoices", value: 1, color: "var(--muted)" }]}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="92%"
            stroke="var(--card)"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {(visible.length ? visible : [{ key: "empty", color: "var(--muted)" }]).map((d) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="tabular font-display text-2xl font-bold">{centerValue}</p>
          <p className="text-xs text-muted-foreground">{centerLabel}</p>
        </div>
      </div>
    </div>
  );
}
