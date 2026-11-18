import { BadgeCheck, FileText, Target, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logo } from "@/lib/brand";
import { getCurrentUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Sign in" };

const highlights = [
  { icon: FileText, title: "GST invoices & bills of supply", text: "CGST, SGST and IGST worked out automatically, in your own invoice layout." },
  { icon: Wallet, title: "Payments & dues", text: "Record full or part payments and see what each customer still owes." },
  { icon: Target, title: "Leads to customers", text: "Track enquiries and turn them into customers and invoices." },
];

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Already signed in: skip the sign-in page.
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative isolate hidden overflow-hidden bg-[#053a20] text-white lg:flex lg:flex-col">
        <Image
          src="/assets/images/stock/battery-modules.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="-z-20 object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(22,163,74,0.35),transparent_55%)]" />

        <div className="flex flex-1 flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="inline-flex w-fit rounded-2xl bg-white px-5 py-3 shadow-lg shadow-black/20">
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-14 w-auto" priority />
          </Link>

          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Billing & Invoice Management</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight xl:text-[2.75rem]">
              Invoices, payments and customers for UNNATI GREEN ENERGY.
            </h1>
            <ul className="mt-10 space-y-6">
              {highlights.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Icon className="size-5 text-emerald-300" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-white/70">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <BadgeCheck className="size-4 text-emerald-300" aria-hidden="true" />
            Lithium Ion Cell & Battery Scrap Trading · Waste Today, Value Tomorrow
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-11 w-auto" priority />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <p className="px-6 pb-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} UNNATI GREEN ENERGY. For authorised staff only.
        </p>
      </main>
    </div>
  );
}
