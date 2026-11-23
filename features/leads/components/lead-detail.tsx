"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  RefreshCcw,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { DetailRow, LeadStatusBadge } from "@/components/billing/common";
import { DateField, SelectField, TextareaField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/billing/ui/select";
import { Spinner } from "@/components/billing/ui/spinner";
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";
import { leadActivityLabels, leadSourceLabels, LEAD_STATUSES, leadStatusLabels, type LeadActivityType, type LeadStatus } from "@/lib/billing/constants";
import { formatDate, formatDateTime, todayISO } from "@/lib/billing/dates";
import { formatINR } from "@/lib/billing/money";
import { stateCodeFromGstin, stateNameFromCode } from "@/lib/billing/states";
import { cn } from "@/lib/ui-utils";
import type { Lead } from "@/server/db/schema";
import { addLeadActivity, updateLeadStatus } from "../actions";
import { leadActivitySchema, LOGGABLE_ACTIVITIES, type LeadActivityInput } from "../schemas";
import { LeadFormDialog } from "./lead-form-dialog";

type Activity = { id: string; type: LeadActivityType; content: string; createdAt: string; createdBy: string | null };

const activityIcon: Record<LeadActivityType, LucideIcon> = {
  created: Sparkles,
  note: MessageSquareText,
  call: Phone,
  email: Mail,
  meeting: Users,
  follow_up: CalendarClock,
  status_change: RefreshCcw,
  converted: UserCheck,
};

export function LeadDetail({ lead, activities, customer }: { lead: Lead; activities: Activity[]; customer: { id: string; name: string } | null }) {
  const [statusPending, startStatus] = useTransition();
  const [notePending, startNote] = useTransition();
  const today = todayISO();
  const form = useForm<LeadActivityInput>({ resolver: zodResolver(leadActivitySchema), defaultValues: { type: "call", content: "", nextFollowUp: "" } });

  const onAddActivity = form.handleSubmit((values) =>
    startNote(async () => {
      const result = await addLeadActivity(lead.id, values);
      handleActionResult(result, form);
      if (result.ok) form.reset({ type: values.type, content: "", nextFollowUp: "" });
    }),
  );

  const gstState = stateCodeFromGstin(lead.gstin);
  const closed = lead.status === "converted" || lead.status === "lost";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Link href="/dashboard/leads" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Leads
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight">{lead.leadName}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {lead.companyName || lead.contactPerson || "No company"} · added {formatDateTime(lead.createdAt)} · via {leadSourceLabels[lead.source]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={lead.status}
            onValueChange={(v) => startStatus(async () => void handleActionResult(await updateLeadStatus(lead.id, v as LeadStatus)))}
            disabled={statusPending || lead.status === "converted"}
          >
            <SelectTrigger className="w-[170px] bg-white" aria-label="Lead status">
              {statusPending ? <Spinner /> : null}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.filter((s) => s !== "converted" || lead.status === "converted").map((s) => (
                <SelectItem key={s} value={s}>
                  {leadStatusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LeadFormDialog
            lead={lead}
            trigger={
              <Button variant="outline">
                <Pencil /> Edit
              </Button>
            }
          />
          {customer ? (
            <Button asChild>
              <Link href={`/dashboard/customers/${customer.id}`}>
                <UserCheck /> View customer
              </Link>
            </Button>
          ) : (
            <CustomerFormDialog
              leadId={lead.id}
              title="Convert lead to customer"
              initialValues={{
                name: lead.companyName || lead.leadName,
                contactPerson: lead.contactPerson,
                mobile: lead.mobile,
                email: lead.email,
                gstin: lead.gstin,
                pan: lead.gstin.length === 15 ? lead.gstin.slice(2, 12) : "",
                billingAddress: lead.address,
                stateCode: gstState,
                state: stateNameFromCode(gstState),
                notes: lead.notes,
              }}
              trigger={
                <Button disabled={lead.status === "lost"}>
                  <UserCheck /> Convert to customer
                </Button>
              }
            />
          )}
        </div>
      </div>

      {lead.status === "converted" && customer && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="size-4" /> Converted to customer{" "}
          <Link href={`/dashboard/customers/${customer.id}`} className="font-semibold underline-offset-2 hover:underline">
            {customer.name}
          </Link>
          .{" "}
          <Link href={`/dashboard/invoices/new?customer=${customer.id}`} className="font-semibold underline-offset-2 hover:underline">
            Create an invoice →
          </Link>
        </div>
      )}
      {lead.status === "lost" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <XCircle className="size-4" /> This lead is marked as lost. Change the status to reopen it.
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[380px_1fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Lead details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <DetailRow label="Contact person">{lead.contactPerson}</DetailRow>
              <DetailRow label="Mobile">{lead.mobile && <a href={`tel:${lead.mobile.replace(/\s/g, "")}`} className="text-primary hover:underline">{lead.mobile}</a>}</DetailRow>
              <DetailRow label="Email">{lead.email && <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>}</DetailRow>
              <DetailRow label="GSTIN">{lead.gstin && <span className="font-mono">{lead.gstin}</span>}</DetailRow>
              <DetailRow label="Address">
                <span className="whitespace-pre-line">{lead.address}</span>
              </DetailRow>
              <DetailRow label="Interested in">{lead.productInterest}</DetailRow>
              <DetailRow label="Expected qty">{lead.expectedQuantity}</DetailRow>
              <DetailRow label="Deal value">{lead.expectedValue ? formatINR(lead.expectedValue) : ""}</DetailRow>
              <DetailRow label="Follow-up">
                {lead.followUpDate && (
                  <span className={cn(!closed && lead.followUpDate < today && "text-red-600", !closed && lead.followUpDate === today && "text-amber-700")}>
                    {formatDate(lead.followUpDate)}
                    {!closed && lead.followUpDate < today && " · overdue"}
                    {!closed && lead.followUpDate === today && " · today"}
                  </span>
                )}
              </DetailRow>
              {lead.notes && (
                <DetailRow label="Notes">
                  <span className="whitespace-pre-line font-normal">{lead.notes}</span>
                </DetailRow>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Log activity / follow-up note</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onAddActivity} noValidate className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <SelectField
                  control={form.control}
                  name="type"
                  label="Type"
                  options={LOGGABLE_ACTIVITIES.map((t) => ({ value: t, label: leadActivityLabels[t] }))}
                />
                <DateField control={form.control} name="nextFollowUp" label="Next follow-up (optional)" />
                <TextareaField
                  control={form.control}
                  name="content"
                  label="What happened?"
                  required
                  rows={3}
                  className="sm:col-span-2"
                  placeholder="e.g. Spoke to purchase head — wants a quote for 40 modules by Friday."
                />
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={notePending}>
                    {notePending && <Spinner />} Add to timeline
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Activity history</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[15px] before:w-px before:bg-border">
                {activities.map((a) => {
                  const Icon = activityIcon[a.type];
                  return (
                    <li key={a.id} className="relative flex gap-4">
                      <span
                        className={cn(
                          "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-white",
                          a.type === "converted" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                          a.type === "status_change" && "text-violet-600",
                          a.type === "follow_up" && "text-amber-600",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm">
                          <span className="font-medium">{leadActivityLabels[a.type]}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {formatDateTime(a.createdAt)}
                            {a.createdBy && ` · ${a.createdBy}`}
                          </span>
                        </p>
                        <p className="mt-0.5 whitespace-pre-line text-sm text-foreground/80">{a.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
