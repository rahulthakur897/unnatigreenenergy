import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/billing/common";
import { ProfileForm, PasswordForm, UsersCard } from "@/features/settings/components/account-forms";
import { CompanyProfileForm } from "@/features/settings/components/company-profile-form";
import { InvoiceSettingsForm, NumberingCard } from "@/features/settings/components/invoice-settings-form";
import { GST_RATES } from "@/lib/billing/constants";
import { recentFinancialYears } from "@/lib/billing/dates";
import { cn } from "@/lib/ui-utils";
import { requireUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { invoiceSequences, users } from "@/server/db/schema";
import { fileUrl } from "@/server/files";
import { getCompanySettings } from "@/server/settings";

export const metadata: Metadata = { title: "Settings" };

const TABS = [
  { key: "company", label: "Company profile" },
  { key: "invoice", label: "Invoice settings" },
  { key: "profile", label: "My profile" },
  { key: "users", label: "Users", adminOnly: true },
] as const;

export default async function SettingsPage({ searchParams }: PageProps<"/dashboard/settings">) {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const requested = (await searchParams).tab;
  const tab = TABS.find((t) => t.key === requested && (!("adminOnly" in t) || isAdmin))?.key ?? "company";
  const s = await getCompanySettings();

  return (
    <div className="max-w-6xl">
      <PageHeader title="Settings" description="Company details, invoice numbering and defaults, bank details, signatory, your account and team access." />
      <nav className="mb-6 flex gap-1 border-b" aria-label="Settings sections">
        {TABS.filter((t) => !("adminOnly" in t) || isAdmin).map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/settings?tab=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "company" && (
        <div className="max-w-4xl">
          <CompanyProfileForm
            canEdit={isAdmin}
            logoUrl={fileUrl(s.logoFileId)}
            values={{ name: s.name, address: s.address, gstin: s.gstin, pan: s.pan, phone: s.phone, email: s.email, website: s.website, state: s.state, stateCode: s.stateCode }}
          />
        </div>
      )}
      {tab === "invoice" && <InvoiceTab isAdmin={isAdmin} settings={s} />}
      {tab === "profile" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileForm values={{ name: user.name, email: user.email }} avatarUrl={fileUrl(user.avatarFileId)} />
          <PasswordForm />
        </div>
      )}
      {tab === "users" && isAdmin && <UsersTab currentUserId={user.id} />}
    </div>
  );
}

async function InvoiceTab({ isAdmin, settings: s }: { isAdmin: boolean; settings: Awaited<ReturnType<typeof getCompanySettings>> }) {
  const seqRows = await db.select().from(invoiceSequences);
  const prefixes = { tax_invoice: s.invoicePrefix, bill_of_supply: s.billOfSupplyPrefix };
  const lastUsed = (prefix: string) => Object.fromEntries(seqRows.filter((r) => r.prefix === prefix).map((r) => [r.financialYear, r.lastNumber]));
  const sequences = { tax_invoice: lastUsed(prefixes.tax_invoice), bill_of_supply: lastUsed(prefixes.bill_of_supply) };
  return (
    <div className="space-y-6">
      <NumberingCard financialYears={recentFinancialYears(3)} sequences={sequences} prefixes={prefixes} padding={s.numberPadding} canEdit={isAdmin} />
      <InvoiceSettingsForm
        canEdit={isAdmin}
        signatureUrl={fileUrl(s.signatureFileId)}
        values={{
          invoicePrefix: s.invoicePrefix,
          billOfSupplyPrefix: s.billOfSupplyPrefix,
          autoNumbering: s.autoNumbering,
          numberPadding: String(s.numberPadding) as "3",
          defaultGstRate: ((GST_RATES as readonly string[]).includes(s.defaultGstRate) ? s.defaultGstRate : "18") as "18",
          defaultDueDays: String(s.defaultDueDays),
          roundOffTotal: s.roundOffTotal,
          defaultTerms: s.defaultTerms,
          defaultFooter: s.defaultFooter,
          bankName: s.bankName,
          bankAccountName: s.bankAccountName,
          bankAccountNumber: s.bankAccountNumber,
          bankIfsc: s.bankIfsc,
          bankBranch: s.bankBranch,
          upiId: s.upiId,
          signatoryName: s.signatoryName,
          signatoryDesignation: s.signatoryDesignation,
        }}
      />
    </div>
  );
}

async function UsersTab({ currentUserId }: { currentUserId: string }) {
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, isActive: users.isActive, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt));
  return <UsersCard users={rows} currentUserId={currentUserId} />;
}
