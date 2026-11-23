import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  FileText,
  Hourglass,
  IndianRupee,
  Package,
  Target,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, InvoiceStatusBadge, LeadStatusBadge, StatCard } from "@/components/billing/common";
import { Button } from "@/components/billing/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/billing/ui/table";
import { InvoiceStatusChart, MonthlyRevenueChart } from "@/features/dashboard/components/overview-charts";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { getDashboardData } from "@/features/dashboard/queries";
import { listCategories } from "@/features/products/queries";
import { formatDate, timeAgo } from "@/lib/billing/dates";
import { formatINR, formatINRCompact } from "@/lib/billing/money";
import { requireUser } from "@/server/auth/dal";
import { getCompanySettings } from "@/server/settings";

export const metadata: Metadata = { title: "Overview" };

const activityIcons: Record<string, LucideIcon> = {
  invoice: FileText,
  payment: Wallet,
  customer: Users,
  lead: Target,
  product: Package,
};

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function OverviewPage() {
  const user = await requireUser();
  const [data, categories, settings] = await Promise.all([getDashboardData(), listCategories(), getCompanySettings()]);
  const { stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {greeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&rsquo;s how {settings.name} is doing — financial year {data.fy}.</p>
        </div>
        <QuickActions categories={categories} defaultGstRate={settings.defaultGstRate} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatINRCompact(stats.totalRevenue)} icon={IndianRupee} tone="green" hint={`${formatINR(stats.totalRevenue)} invoiced (incl. GST)`} />
        <StatCard label="Collected" value={formatINRCompact(stats.collected)} icon={Wallet} tone="blue" hint={formatINR(stats.collected)} />
        <StatCard label="Pending payments" value={formatINRCompact(stats.pendingAmount)} icon={Hourglass} tone="amber" hint={`${stats.pendingCount} invoice${stats.pendingCount === 1 ? "" : "s"} unpaid`} />
        <StatCard
          label="Overdue invoices"
          value={stats.overdueCount}
          icon={AlertTriangle}
          tone={stats.overdueCount ? "red" : "slate"}
          hint={stats.overdueCount ? `${formatINR(stats.overdueAmount)} past due` : "Nothing overdue"}
        />
        <StatCard label="Total invoices" value={stats.totalInvoices} icon={FileText} tone="violet" hint={stats.draftInvoices ? `+ ${stats.draftInvoices} draft(s)` : "Generated invoices"} />
        <StatCard label="Paid invoices" value={stats.paidInvoices} icon={BadgeCheck} tone="green" hint={stats.totalInvoices ? `${Math.round((stats.paidInvoices / stats.totalInvoices) * 100)}% of invoices` : "—"} />
        <StatCard label="Total customers" value={stats.customers} icon={Users} tone="blue" />
        <StatCard label="Total leads" value={stats.leads} icon={Target} tone="amber" hint={`${stats.openLeads} open · ${stats.leadsThisMonth} new this month`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="shadow-card xl:col-span-2">
          <CardHeader>
            <CardTitle>Monthly revenue</CardTitle>
            <CardDescription>Invoiced vs collected, FY {data.fy} (April – March)</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart data={data.monthly} />
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Invoice status</CardTitle>
            <CardDescription>All invoices by current state</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceStatusChart data={data.statusBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="gap-0 py-0 shadow-card xl:col-span-2">
          <CardHeader className="border-b py-4">
            <CardTitle>Recent invoices</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/invoices">
                  View all <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          {data.recentInvoices.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={FileText}
                title="No invoices yet"
                description="Your latest invoices will show up here."
                className="border-0"
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/invoices/new">Create invoice</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Link href={`/dashboard/invoices/${inv.id}`} className="tabular font-medium text-primary hover:underline">
                        {inv.invoiceNumber ?? "Draft"}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{inv.billName}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(inv.invoiceDate)}</TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} paymentStatus={inv.paymentStatus} />
                    </TableCell>
                    <TableCell className="tabular text-right font-medium">{formatINR(inv.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="gap-0 py-0 shadow-card">
          <CardHeader className="border-b py-4">
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentActivity.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Activity from invoices, payments, customers and leads appears here.</p>
            ) : (
              <ul className="divide-y">
                {data.recentActivity.map((a) => {
                  const Icon = activityIcons[a.entityType] ?? UserRound;
                  return (
                    <li key={a.id} className="flex gap-3 px-6 py-3">
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 text-sm">
                        <p className="leading-snug">{a.description}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {timeAgo(a.createdAt)}
                          {a.userName && ` · ${a.userName}`}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 py-0 shadow-card">
        <CardHeader className="border-b py-4">
          <CardTitle>Latest leads</CardTitle>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/leads">
                All leads <ArrowRight />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        {data.latestLeads.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">No leads yet — add enquiries to start tracking follow-ups.</p>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead className="hidden md:table-cell">Interested in</TableHead>
                <TableHead className="hidden sm:table-cell">Follow-up</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Deal value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.latestLeads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Link href={`/dashboard/leads/${l.id}`} className="font-medium hover:text-primary hover:underline">
                      {l.leadName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{l.companyName || l.contactPerson}</p>
                  </TableCell>
                  <TableCell className="hidden max-w-[220px] truncate md:table-cell">{l.productInterest || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{formatDate(l.followUpDate) || "—"}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={l.status} />
                  </TableCell>
                  <TableCell className="tabular text-right">{l.expectedValue ? formatINR(l.expectedValue) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
