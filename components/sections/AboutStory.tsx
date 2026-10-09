import Image from "next/image";
import { Eye, Recycle, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { photos } from "@/lib/images";

const pillars = [
  { label: "Careful", text: "Every lot handled with attention", icon: ShieldCheck },
  { label: "Open", text: "Plain terms, full records", icon: Eye },
  { label: "Circular", text: "Materials put back to work", icon: Recycle },
];

export function AboutStory({ id = "about-story" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site">
        <Reveal>
          <Eyebrow>Our Story</Eyebrow>
          <h2 id={`${id}-title`} className="sr-only">
            Our story
          </h2>
          <p className="mt-8 max-w-5xl font-display text-[1.625rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink-950 sm:text-[2.125rem] lg:text-[2.625rem]">
            We trade lithium-ion cells and battery scrap so that businesses can{" "}
            <span className="text-leaf-600">dispose of batteries properly</span>,{" "}
            <span className="text-leaf-600">get more back from them</span> and help build a{" "}
            <span className="text-leaf-600">closed-loop energy economy</span>.
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative pb-14 pr-8 sm:pb-20 sm:pr-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-forest-900 shadow-lift">
                <Image
                  src={photos.inspectionLine.src}
                  alt={photos.inspectionLine.alt}
                  fill
                  sizes="(min-width: 1024px) 520px, 88vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] overflow-hidden rounded-[1.5rem] border-[6px] border-white bg-white shadow-lift">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photos.liIonLabel.src}
                    alt={photos.liIonLabel.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-forest-700 shadow-soft">
                Waste Today, Value Tomorrow
              </p>
            </div>
          </Reveal>


          <Reveal className="lg:col-span-6" delay={100}>
            <div className="space-y-5 text-lg leading-relaxed text-ink-500">
              <p>
                <span className="font-semibold text-forest-700">
                  Unnati
                </span>{" "}
                represents progress, growth, and the pursuit of a better future.
                At UNNATI GREEN ENERGY, this philosophy shapes our approach to
                lithium-ion battery scrap trading — connecting responsible
                material management with new opportunities for resource recovery
                and long-term value creation.
              </p>

              <p>
                We work within the evolving battery and energy ecosystem,
                supporting businesses that generate or handle used lithium-ion
                cells, battery packs, modules, and related scrap materials.
                Through transparent commercial practices, careful material
                evaluation, and dependable coordination, we aim to make battery
                scrap trading more structured, accessible, and reliable for our
                business partners.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-6 border-t border-mist-200 pt-8 sm:grid-cols-3">
              {pillars.map(({ label, text, icon: Icon }) => (
                <li key={label} className="group">
                  <span className="grid size-12 place-items-center rounded-xl bg-forest-700 text-sun-300 transition-colors duration-300 group-hover:bg-leaf-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <p className="mt-4 font-display font-bold text-ink-950">
                    {label}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
