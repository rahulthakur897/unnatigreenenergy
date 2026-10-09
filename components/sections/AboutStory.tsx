import Image from "next/image";
import { Eye, Recycle, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { photos } from "@/lib/images";

const pillars = [
  { label: "Responsible", text: "Careful handling, every lot", icon: ShieldCheck },
  { label: "Transparent", text: "Clear terms and records", icon: Eye },
  { label: "Circular", text: "Materials kept in use", icon: Recycle },
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
            We work in lithium-ion cell and battery scrap trading — helping businesses{" "}
            <span className="text-leaf-600">manage battery waste responsibly</span>,{" "}
            <span className="text-leaf-600">recover more of its value</span> and support a{" "}
            <span className="text-leaf-600">circular energy economy</span>.
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
                In Hindi, <span className="font-semibold text-forest-700">unnati</span> means progress — advancement,
                upliftment, moving forward. It&rsquo;s a fitting name for what we believe the battery economy can become: a
                cycle of progress, where today&rsquo;s waste becomes tomorrow&rsquo;s value.
              </p>
              <p>
                We help the businesses that generate battery scrap — manufacturers, EV and mobility companies, energy storage
                operators, electronics businesses and aggregators — move their material responsibly, with transparent
                evaluation and careful handling.
              </p>
              <p>
                Our focus is simple: make sure the valuable materials inside used batteries are recovered rather than wasted,
                and make the process straightforward and trustworthy for every business we work with.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-3 gap-4 border-t border-mist-200 pt-8">
              {pillars.map(({ label, text, icon: Icon }) => (
                <li key={label}>
                  <span className="grid size-11 place-items-center rounded-xl bg-forest-700 text-sun-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-display font-bold text-ink-950">{label}</p>
                  <p className="mt-1 text-sm leading-snug text-ink-500">{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
