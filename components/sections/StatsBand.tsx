import { StatCard } from "@/components/cards/StatCard";
import { Reveal } from "@/components/motion/Reveal";
import { CellPattern, PlaceholderTag, SunGlow } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { stats } from "@/content/placeholders";
import { cn } from "@/lib/utils";

export function StatsBand({ id = "stats", className }: { id?: string; className?: string }) {
  const hasPlaceholders = stats.some((stat) => stat.value === null);

  return (
    <section aria-labelledby={`${id}-title`} className={cn("bg-white pb-20 md:pb-28", className)}>
      <div className="container-site">
        <Reveal>
          <div className="surface-dark relative isolate overflow-hidden rounded-[2rem] bg-forest-800 px-6 py-12 text-white sm:px-10 md:py-16 lg:px-14">
            <CellPattern id={`${id}-cells`} className="-z-10 text-white/[0.05] [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
            <SunGlow className="-right-40 -top-56 -z-10 size-[30rem]" />

            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <Eyebrow tone="dark">Our Numbers</Eyebrow>
                <h2 id={`${id}-title`} className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Our work in figures
                </h2>
                <p className="mt-4 max-w-sm leading-relaxed text-white/65">
                  A snapshot of what we&rsquo;ve done so far, refreshed as the business grows.
                </p>
                {/* TODO: Remove once every figure in content/placeholders.ts is verified. */}
                {hasPlaceholders && <PlaceholderTag tone="dark" className="mt-5" />}
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:col-span-8 lg:gap-y-12">
                {stats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
