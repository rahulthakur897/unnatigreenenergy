import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";

/** Shared layout for legal pages. */
export function LegalPage({
  id,
  title,
  href,
  intro,
  children,
}: {
  id: string;
  title: string;
  href: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero id={id} eyebrow="Legal" title={title} description={intro} crumbs={[{ label: title, href }]} compact />
      <section className="section-y bg-white">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            {/* TODO: Have these terms reviewed by a qualified legal professional, then remove this notice. */}
            <p className="flex items-start gap-3 rounded-2xl border border-dashed border-sun-500/60 bg-sun-100/50 p-5 text-sm leading-relaxed text-ink-700">
              <FileWarning className="mt-0.5 size-5 shrink-0 text-sun-600" aria-hidden="true" />
              This page is a general template provided for convenience. It must be reviewed and adapted by a qualified legal
              professional before it is relied upon.
            </p>
            <div className="prose-legal mt-6">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
