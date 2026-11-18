import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/billing/ui/badge";
import { Card } from "@/components/billing/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/billing/ui/empty";
import {
  invoiceStatusLabels,
  leadStatusLabels,
  paymentStatusLabels,
  type InvoiceStatus,
  type LeadStatus,
  type PaymentStatus,
} from "@/lib/billing/constants";
import { cn } from "@/lib/ui-utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
} as const;

export type Tone = keyof typeof tones;

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "green",
  className,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg ring-1", tones[tone])}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="tabular mt-2 truncate font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

const badgeTone: Record<Tone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-700",
  slate: "border-slate-200 bg-slate-50 text-slate-600",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export function ToneBadge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full px-2 py-0.5 font-medium", badgeTone[tone], className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {children}
    </Badge>
  );
}

const invoiceTone: Record<InvoiceStatus, Tone> = { draft: "slate", generated: "blue", cancelled: "red" };
const paymentTone: Record<PaymentStatus, Tone> = { paid: "green", partially_paid: "violet", pending: "amber", overdue: "red" };
const leadTone: Record<LeadStatus, Tone> = {
  new: "blue",
  contacted: "violet",
  qualified: "amber",
  proposal_sent: "slate",
  converted: "green",
  lost: "red",
};

/** One badge that reads as the invoice's effective state (draft / cancelled / payment status). */
export function InvoiceStatusBadge({ status, paymentStatus }: { status: InvoiceStatus; paymentStatus?: PaymentStatus | null }) {
  if (status === "generated" && paymentStatus) {
    return <ToneBadge tone={paymentTone[paymentStatus]}>{paymentStatusLabels[paymentStatus]}</ToneBadge>;
  }
  return <ToneBadge tone={invoiceTone[status]}>{invoiceStatusLabels[status]}</ToneBadge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <ToneBadge tone={paymentTone[status]}>{paymentStatusLabels[status]}</ToneBadge>;
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <ToneBadge tone={leadTone[status]}>{leadStatusLabels[status]}</ToneBadge>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Empty className={cn("border border-dashed bg-white py-12", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-secondary text-primary">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}

/** Label / value row for detail panels. */
export function DetailRow({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,130px)_1fr] gap-3 py-2 text-sm", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-foreground">{children || <span className="text-muted-foreground/60">—</span>}</dd>
    </div>
  );
}
