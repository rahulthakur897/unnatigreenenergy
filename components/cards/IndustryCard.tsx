import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/content/industries";

/** Editorial image card that links to the industry detail page. */
export function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = industry.icon;
  return (
    <article className="group relative isolate flex aspect-[3/4] h-full flex-col justify-between overflow-hidden rounded-[1.25rem] bg-forest-900 p-4 text-white sm:aspect-[4/5] sm:p-6">
      <Image
        src={industry.image.src}
        alt={industry.image.alt}
        fill
        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, 50vw"
        placeholder="blur"
        className="-z-20 object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.07]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/10 transition-colors duration-500"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-leaf-300 to-sun-400 transition-transform duration-700 ease-premium group-hover:scale-x-100"
      />

      <span className="grid size-10 place-items-center rounded-xl bg-white/12 text-sun-300 ring-1 ring-white/20 backdrop-blur-md transition-colors duration-500 group-hover:bg-sun-400 group-hover:text-forest-950 sm:size-12">
        <Icon className="size-5 sm:size-[1.375rem]" aria-hidden="true" />
      </span>

      <div>
        <h3 className="font-display text-base font-bold leading-tight tracking-tight sm:text-xl">
          <Link href={`/industries/${industry.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {industry.title}
          </Link>
        </h3>
        <div className="hidden sm:block">
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{industry.summary}</p>
        </div>
        <span aria-hidden="true" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-200 sm:mt-4 sm:text-sm">
          Explore
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
