import Image from "next/image";
import { Compass, Telescope } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ValuesShowcase, type ValueItem } from "@/components/sections/ValuesShowcase";
import { CellPattern, SunGlow } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { focusAreas, values } from "@/content/company";
import { photos } from "@/lib/images";
import { stepNumber } from "@/lib/utils";

const purpose = [
  {
    label: "Our Mission",
    icon: Compass,
    statement: (
      <>
        To drive sustainable battery resource management through{" "}
        <span className="text-leaf-300">
          responsible sourcing, transparent trading, and value recovery
        </span>{" "}
        for a cleaner tomorrow.
      </>
    ),
  },
  {
    label: "Our Vision",
    icon: Telescope,
    statement: (
      <>
        To build a future where battery materials power a{" "}
        <span className="text-leaf-300">
          thriving circular economy
        </span>
        , transforming waste into valuable resources for generations to come.
      </>
    ),
  },
];


/** Dark "manifesto" panels for mission and vision. */
export function MissionVision({ id = "mission-vision" }: { id?: string }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="surface-dark section-y relative isolate overflow-hidden bg-forest-950 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgb(8_87_22/0.55),transparent_65%)]" />
      <CellPattern id={`${id}-cells`} className="-z-10 text-white/[0.035] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <SunGlow className="-left-60 -top-72 -z-10 size-[42rem]" />

      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            align="center"
            tone="dark"
            eyebrow="Our Purpose"
            title="Why we exist — and where we're headed"
          />
        </Reveal>
        <Reveal className="mt-14" delay={100}>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 lg:grid-cols-2">
            {purpose.map(({ label, icon: Icon, statement }, index) => (
              <article key={label} className="relative flex flex-col justify-between gap-12 bg-forest-950 p-8 sm:p-12 lg:min-h-[24rem] lg:p-14">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sun-300">
                    {stepNumber(index)} — {label}
                  </p>
                  <span className="grid size-12 place-items-center rounded-full bg-white/[0.08] text-sun-300 ring-1 ring-white/15">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="font-display text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-[2.5rem]">
                  {statement}
                </h3>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Editorial numbered list of the company's focus areas. */
export function FocusAreas({ id = "focus-areas" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                id={`${id}-title`}
                eyebrow="Our Approach"
                title="Seven commitments that shape our work"
                description="They guide how we source, evaluate, handle and trade every lot of battery scrap."
              />
            </Reveal>
            <Reveal delay={100} className="mt-10 hidden lg:block">
              <div className="surface-dark relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-forest-900">
                <Image
                  src={photos.recyclingFacility.src}
                  alt={photos.recyclingFacility.alt}
                  fill
                  sizes="400px"
                  placeholder="blur"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" />
                <p className="absolute inset-x-6 bottom-6 font-display text-2xl font-bold leading-tight text-white">
                  Waste Today, <span className="text-sun-300">Value Tomorrow.</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <ol className="border-t border-mist-200 lg:col-span-8">
          {focusAreas.map((area, index) => (
            <Reveal
              as="li"
              key={area.title}
              className="group grid grid-cols-[3.75rem_1fr] gap-x-5 border-b border-mist-200 py-8 sm:grid-cols-[6.5rem_1fr] sm:gap-x-8 sm:py-10"
            >
              <span
                aria-hidden="true"
                className="font-display text-[2.75rem] font-extrabold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-leaf-400)] group-hover:text-leaf-400 sm:text-[4rem]"
              >
                {stepNumber(index)}
              </span>
              <div className="pt-1 sm:pt-2">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-950 sm:text-2xl">{area.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-ink-500 sm:text-lg">{area.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Values with interactive expanding panels. */
export function ValuesGrid({ id = "values" }: { id?: string }) {
  const items: ValueItem[] = values.map(({ title, text, icon: Icon }) => ({
    title,
    text,
    icon: <Icon aria-hidden="true" />,
  }));

  return (
    <section aria-labelledby={`${id}-title`} className="section-y">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow="Our Values"
            title="The principles behind every transaction"
            description="Five values guide every conversation, evaluation and transaction — whatever the size of the lot."
          />
        </Reveal>
        <Reveal className="mt-14" delay={100}>
          <ValuesShowcase items={items} />
        </Reveal>
      </div>
    </section>
  );
}
