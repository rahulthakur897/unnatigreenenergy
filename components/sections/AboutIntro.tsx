import Image from "next/image";
import { Check, Sun } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/lib/images";

const focus = [
  "Accountable sourcing",
  "Lithium-ion scrap trading",
  "Recovery of valuable materials",
  "Open, documented dealings",
  "Partnerships that last",
  "Care for the environment",
];

export function AboutIntro({ id = "about" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y relative overflow-hidden">
      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <Reveal className="relative lg:col-span-6">
          <div className="relative pr-6 sm:pr-14 lg:pr-12">
            <Parallax className="aspect-[4/5] rounded-[2rem] bg-forest-900 shadow-lift sm:aspect-[5/5] lg:aspect-[4/5]">
              <Image
                src={photos.recyclingFacility.src}
                alt={photos.recyclingFacility.alt}
                fill
                sizes="(min-width: 1024px) 560px, 92vw"
                placeholder="blur"
                className="object-cover"
              />
            </Parallax>

            <div className="absolute right-0 top-10 hidden w-40 overflow-hidden rounded-2xl border-[6px] border-white shadow-lift sm:block lg:w-44 xl:w-52">
              <div className="relative aspect-[3/4]">
                <Image
                  src={photos.lithiumCells.src}
                  alt={photos.lithiumCells.alt}
                  fill
                  sizes="208px"
                  placeholder="blur"
                  className="object-cover object-[75%_50%]"
                />
              </div>
            </div>

            <div className="absolute -bottom-8 left-5 right-12 rounded-2xl border border-mist-200 bg-white/95 p-5 shadow-lift backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-sun-100 text-sun-600">
                  <Sun className="size-5" aria-hidden="true" />
                </span>
                <p className="font-display font-bold leading-tight text-ink-950">
                  Waste Today, <span className="text-leaf-600">Value Tomorrow</span>
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A worn-out battery is still full of materials worth getting back.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <SectionHeading id={`${id}-title`} eyebrow="About Us" title="Where Used Batteries Find Their Next Use" />
            <p className="mt-6 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-leaf-50 px-4 py-2 text-[0.8125rem] font-semibold text-forest-700 ring-1 ring-leaf-100">
              Clean Energy <span aria-hidden="true" className="text-leaf-400">•</span> Closed-Loop Thinking{" "}
              <span aria-hidden="true" className="text-leaf-400">•</span> Careful Recovery
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-7 text-lg leading-relaxed text-ink-600">
              UNNATI GREEN ENERGY trades lithium-ion cells and battery scrap. We give businesses a proper way to deal with
              their battery waste, so that as much material as possible is recovered and put back to work.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Even a worn-out lithium-ion battery holds useful materials, including lithium, nickel, cobalt, copper and
              aluminium, depending on its chemistry. We link the businesses that produce battery scrap with the channels that
              can reclaim those materials, backed by open evaluation, careful handling and relationships built to last.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <ul className="mt-8 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {focus.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink-900">
                  <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-700 text-sun-300">
                    <Check className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="primary" size="lg" arrow className="mt-10">
              Read Our Story
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
