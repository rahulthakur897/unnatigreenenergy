import { AlertTriangle, ArrowLeft, FileText, IndianRupee, ReceiptIndianRupee, ShoppingBag, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailRow, EmptyState, InvoiceStatusBadge, StatCard, ToneBadge } from "@/components/billing/common";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/billing/ui/table";
import { CustomerProfileActions } from "@/features/customers/components/customer-profile-actions";
import { getCustomerDetail } from "@/features/customers/queries";
import { customerTypeLabels, paymentModeLabels } from "@/lib/billing/constants";
import { formatDate, formatDateTime } from "@/lib/billing/dates";
import { formatINR } from "@/lib/billing/money";
import { formatStateCode } from "@/lib/billing/states";
import { requireUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Customer profile" };

export default async function CustomerProfilePage({ params }: PageProps<"/dashboard/customers/[id]">) {
  await requireUser();
  const { id } = await params;
  const detail = await getCustomerDetail(id);
  if (!detail) notFound();
  const { customer, invoices, payments, stats } = detail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link href="/dashboard/customers" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Customers
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight">{customer.name}</h1>
            <ToneBadge tone="blue">{customerTypeLabels[customer.customerType]}</ToneBadge>
            {stats.overdueCount > 0 && (
              <ToneBadge tone="red">
                {stats.overdueCount} overdue
              </ToneBadge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Customer since {formatDateTime(customer.createdAt).split(",")[0]}</p>
        </div>
        <div className="flex gap-2">
          <CustomerProfileActions customer={customer} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total invoices" value={stats.totalInvoices} icon={FileText} tone="blue" hint={stats.draftInvoices ? `${stats.draftInvoices} draft(s) not counted` : "Generated invoices"} />
        <StatCard label="Total purchases" value={formatINR(stats.totalPurchases)} icon={ShoppingBag} tone="green" />
        <StatCard label="Paid amount" value={formatINR(stats.paidAmount)} icon={Wallet} tone="violet" />
        <StatCard label="Outstanding" value={formatINR(stats.outstanding)} icon={IndianRupee} tone={stats.outstanding ? "amber" : "slate"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Customer information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <DetailRow label="Contact person">{customer.contactPerson}</DetailRow>
              <DetailRow label="Mobile">{customer.mobile}</DetailRow>
              <DetailRow label="Email">{customer.email}</DetailRow>
              <DetailRow label="GSTIN">{customer.gstin && <span className="font-mono">{customer.gstin}</span>}</DetailRow>
              <DetailRow label="PAN">{customer.pan && <span className="font-mono">{customer.pan}</span>}</DetailRow>
              <DetailRow label="State">{formatStateCode(customer.stateCode) || customer.state}</DetailRow>
              <DetailRow label="Billing address">
                <span className="whitespace-pre-line">{customer.billingAddress}</span>
              </DetailRow>
              <DetailRow label="Shipping address">
                <span className="whitespace-pre-line">{customer.shippingAddress || (customer.billingAddress && "Same as billing")}</span>
              </DetailRow>
              {customer.notes && (
                <DetailRow label="Notes">
                  <span className="whitespace-pre-line font-normal">{customer.notes}</span>
                </DetailRow>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card className="gap-0 py-0 shadow-card">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-base">Invoice history</CardTitle>
            </CardHeader>
            {invoices.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={FileText}
                  title="No invoices yet"
                  description="Invoices for this customer will appear here."
                  action={
                    <Button asChild size="sm">
                      <Link href={`/dashboard/invoices/new?customer=${customer.id}`}>Create invoice</Link>
                    </Button>
                  }
                  className="border-0"
                />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Link href={`/dashboard/invoices/${inv.id}`} className="font-medium text-primary hover:underline">
                          {inv.invoiceNumber ?? "Draft"}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(inv.invoiceDate)}</TableCell>
                      <TableCell>{formatDate(inv.dueDate) || "—"}</TableCell>
                      <TableCell>
                        <InvoiceStatusBadge status={inv.status} paymentStatus={inv.paymentStatus} />
                      </TableCell>
                      <TableCell className="tabular text-right">{formatINR(inv.total)}</TableCell>
                      <TableCell className="tabular text-right font-medium">
                        {inv.balance > 0 ? <span className="text-amber-700">{formatINR(inv.balance)}</span> : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card className="gap-0 py-0 shadow-card">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-base">Recent transactions</CardTitle>
            </CardHeader>
            {payments.length === 0 ? (
              <p className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <ReceiptIndianRupee className="size-4" /> No payments recorded yet.
              </p>
            ) : (
              <ul className="divide-y">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">
                        Payment received · {paymentModeLabels[p.mode]}
                        {p.reference && <span className="font-normal text-muted-foreground"> · Ref {p.reference}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(p.paymentDate)} · against{" "}
                        <Link href={`/dashboard/invoices/${p.invoiceId}`} className="text-primary hover:underline">
                          {p.invoiceNumber}
                        </Link>
                      </p>
                    </div>
                    <span className="tabular shrink-0 font-semibold text-emerald-700">+{formatINR(p.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {stats.overdueCount > 0 && (
            <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertTriangle className="size-4" /> {stats.overdueCount} invoice(s) are past their due date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
