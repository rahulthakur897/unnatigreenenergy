import Link from "next/link";
import { Check, ClipboardList } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { quoteChecklist } from "@/content/services";
import { quoteHref, talkHref } from "@/lib/site";

/** Sticky quote card used on service and industry detail pages. */
export function QuoteAside({ idealFor }: { idealFor?: string[] }) {
  return (
    <aside aria-label="Request a quote" className="rounded-[1.5rem] border border-mist-200 bg-white p-7 shadow-soft sm:p-8 lg:sticky lg:top-32">
      {idealFor && (
        <div className="border-b border-mist-200 pb-7">
          <h2 className="font-display text-lg font-bold text-ink-950">Ideal for</h2>
          <ul className="mt-4 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] text-ink-700">
                <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-forest-700 text-sun-300">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={idealFor ? "pt-7" : undefined}>
        <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink-950">
          <ClipboardList className="size-5 text-leaf-600" aria-hidden="true" />
          For a faster quote, share
        </h2>
        <ul className="mt-4 space-y-2.5">
          {quoteChecklist.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-ink-500">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-400" />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink href={quoteHref} arrow block className="mt-7">
          Request a Quote
        </ButtonLink>
        <p className="mt-4 text-center text-sm text-ink-500">
          Prefer to talk?{" "}
          <Link href={talkHref} className="font-semibold text-forest-700 underline decoration-leaf-300 underline-offset-4">
            Contact our team
          </Link>
        </p>
      </div>
    </aside>
  );
}
