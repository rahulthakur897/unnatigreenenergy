import { ArrowLeft, Ban, FileCheck2, History, Link2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceStatusBadge } from "@/components/billing/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Progress } from "@/components/billing/ui/progress";
import { InvoiceDetailActions } from "@/features/invoices/components/invoice-detail-actions";
import { InvoicePreviewPanel } from "@/features/invoices/components/invoice-preview-panel";
import { buildInvoiceDocument, getInvoiceDetail } from "@/features/invoices/queries";
import { PaymentHistory } from "@/features/payments/components/payment-history";
import { invoiceTypeLabels } from "@/lib/billing/constants";
import { formatDate, formatDateTime } from "@/lib/billing/dates";
import { formatINR } from "@/lib/billing/money";
import { requireUser } from "@/server/auth/dal";
import { fileUrl } from "@/server/files";
import { getCompanySettings } from "@/server/settings";

export const metadata: Metadata = { title: "Invoice" };

export default async function InvoicePage({ params, searchParams }: PageProps<"/dashboard/invoices/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const autoPrint = (await searchParams).print === "1";
  const detail = await getInvoiceDetail(id);
  if (!detail) notFound();
  const { invoice, items } = detail;
  const settings = await getCompanySettings();
  const doc = await buildInvoiceDocument(invoice, items, settings);
  const paidPct = invoice.total > 0 ? Math.min(100, Math.round((detail.paid / invoice.total) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <Link href="/dashboard/invoices" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All invoices
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{invoiceTypeLabels[invoice.invoiceType]}</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="tabular font-display text-2xl font-bold tracking-tight">{invoice.invoiceNumber ?? "Draft"}</h1>
            <InvoiceStatusBadge status={invoice.status} paymentStatus={detail.paymentStatus} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.customerId ? (
              <Link href={`/dashboard/customers/${invoice.customerId}`} className="font-medium text-foreground hover:text-primary hover:underline">
                {invoice.billName}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{invoice.billName}</span>
            )}{" "}
            · {formatDate(invoice.invoiceDate)} · {formatINR(invoice.total)}
          </p>
        </div>
        <InvoiceDetailActions
          invoiceId={invoice.id}
          status={invoice.status}
          invoiceNumber={invoice.invoiceNumber}
          isAdmin={user.role === "admin"}
          hasPayments={detail.payments.length > 0}
          payable={
            invoice.status === "generated" && detail.balance > 0
              ? {
                  id: invoice.id,
                  invoiceNumber: invoice.invoiceNumber ?? "",
                  customerName: invoice.billName,
                  invoiceDate: invoice.invoiceDate,
                  total: invoice.total,
                  paid: detail.paid,
                  balance: detail.balance,
                }
              : null
          }
          share={{
            customerName: invoice.billName,
            customerEmail: invoice.billEmail,
            customerPhone: invoice.billPhone,
            total: formatINR(invoice.total),
            companyName: doc.seller.name,
          }}
        />
      </div>

      {invoice.status === "cancelled" && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <Ban className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">
              Cancelled on {formatDateTime(invoice.cancelledAt)}
              {detail.cancelledByName && ` by ${detail.cancelledByName}`}
            </p>
            <p className="mt-0.5">Reason: {invoice.cancelReason}</p>
          </div>
        </div>
      )}
      {invoice.status === "draft" && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <FileCheck2 className="size-4" /> This is a draft. It has no invoice number yet and can still be edited or deleted.
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <InvoicePreviewPanel autoPrint={autoPrint} doc={doc} logoUrl={fileUrl(doc.seller.logoFileId)} signatureUrl={fileUrl(doc.seller.signatureFileId)} />

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Payment summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Invoice total</dt>
                  <dd className="tabular font-semibold">{formatINR(invoice.total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Received</dt>
                  <dd className="tabular font-semibold text-emerald-700">{formatINR(detail.paid)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <dt className="font-medium">Outstanding</dt>
                  <dd className="tabular font-bold text-amber-700">{formatINR(detail.balance)}</dd>
                </div>
              </dl>
              {invoice.status === "generated" && (
                <div className="space-y-1.5">
                  <Progress value={paidPct} className="h-2" aria-label="Paid percentage" />
                  <p className="text-xs text-muted-foreground">
                    {paidPct}% paid{invoice.dueDate && ` · due ${formatDate(invoice.dueDate)}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <PaymentHistory payments={detail.payments} isAdmin={user.role === "admin"} />

          {(detail.replaces || detail.replacedBy.length > 0) && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="size-4" /> Corrections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {detail.replaces && (
                  <p>
                    Replaces cancelled invoice{" "}
                    <Link href={`/dashboard/invoices/${detail.replaces.id}`} className="font-medium text-primary hover:underline">
                      {detail.replaces.invoiceNumber}
                    </Link>
                  </p>
                )}
                {detail.replacedBy.map((r) => (
                  <p key={r.id}>
                    Corrected by{" "}
                    <Link href={`/dashboard/invoices/${r.id}`} className="font-medium text-primary hover:underline">
                      {r.invoiceNumber ?? "a draft"}
                    </Link>
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" /> History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 border-l pl-4 text-sm">
                <li>
                  <p className="font-medium">Created{detail.createdByName && ` by ${detail.createdByName}`}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(invoice.createdAt)}</p>
                </li>
                {invoice.generatedAt && (
                  <li>
                    <p className="font-medium">Generated as {invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(invoice.generatedAt)}</p>
                  </li>
                )}
                {invoice.cancelledAt && (
                  <li>
                    <p className="font-medium text-red-700">Cancelled</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(invoice.cancelledAt)}</p>
                  </li>
                )}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
