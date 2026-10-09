import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SunGlow } from "@/components/ui/Decor";
import type { Photo } from "@/lib/images";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href: string };

/** Dark, image-led header for inner pages, with breadcrumbs and BreadcrumbList data. */
export function PageHero({
  id,
  eyebrow,
  title,
  description,
  image,
  crumbs,
  children,
  compact = false,
}: {
  /** Unique per page — used for the heading id. */
  id: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: Photo;
  crumbs: Crumb[];
  children?: ReactNode;
  compact?: boolean;
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  return (
    <section aria-labelledby={`${id}-title`} className="surface-dark relative isolate overflow-hidden bg-forest-950 text-white">
      {image && (
        <Image
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          className="-z-20 object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(1_23_10/0.96)_0%,rgb(1_23_10/0.84)_45%,rgb(1_23_10/0.5)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(1_23_10/0.6)_0%,transparent_32%,transparent_62%,rgb(1_23_10/0.9)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark opacity-50 mask-fade-b" />
      <SunGlow className="-right-48 -top-72 -z-10 size-[44rem]" />

      <div
        className={cn(
          "container-site relative flex flex-col justify-end pt-40",
          compact ? "min-h-[24rem] pb-14 md:min-h-[26rem]" : "min-h-[32rem] pb-16 md:min-h-[36rem] md:pb-20 lg:min-h-[40rem]",
        )}
      >
        <nav aria-label="Breadcrumb" className="animate-fade-up">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            {trail.map((crumb, index) => {
              const last = index === trail.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="font-medium text-white/90">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                      <ChevronRight className="size-3.5 text-white/35" aria-hidden="true" />
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {eyebrow && (
          <p className="mt-8 inline-flex animate-fade-up items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-leaf-200 [animation-delay:60ms]">
            <span aria-hidden="true" className="h-px w-8 bg-sun-400" />
            {eyebrow}
          </p>
        )}
        <h1
          id={`${id}-title`}
          className="mt-5 max-w-4xl animate-fade-up font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] [animation-delay:120ms] sm:text-[3.5rem] lg:text-[4.25rem]"
        >
          {title}
        </h1>
        {description && (
          <div className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/75 [animation-delay:200ms] sm:text-xl">
            {description}
          </div>
        )}
        {children && <div className="mt-9 animate-fade-up [animation-delay:280ms]">{children}</div>}
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </section>
  );
}
