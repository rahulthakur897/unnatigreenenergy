import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";
import { stepNumber } from "@/lib/utils";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-mist-200 bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ease-premium hover:-translate-y-1 hover:border-leaf-300/60 hover:shadow-lift sm:p-8">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-leaf-400 via-leaf-300 to-sun-400 transition-transform duration-700 ease-premium group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-60 rounded-full bg-leaf-100/0 blur-3xl transition-colors duration-700 group-hover:bg-leaf-100/80"
      />

      <div className="relative flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-forest-700 text-leaf-200 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] transition-colors duration-500 group-hover:bg-forest-800 group-hover:text-sun-300">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span aria-hidden="true" className="font-display text-sm font-semibold text-ink-400">
          {stepNumber(index)}
        </span>
      </div>

      <h3 className="relative mt-7 font-display text-xl font-bold tracking-tight text-ink-950">
        <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {service.title}
        </Link>
      </h3>
      <p className="relative mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">{service.summary}</p>

      <span aria-hidden="true" className="relative mt-7 inline-flex items-center gap-3 text-sm font-semibold text-forest-700">
        Learn more
        <span className="grid size-9 place-items-center rounded-full border border-mist-200 transition-colors duration-500 group-hover:border-forest-700 group-hover:bg-forest-700 group-hover:text-white">
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </span>
    </article>
  );
}
