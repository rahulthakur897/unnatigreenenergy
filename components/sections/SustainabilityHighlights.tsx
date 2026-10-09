import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sustainabilityBenefits } from "@/content/company";
import { photos } from "@/lib/images";
import { cn } from "@/lib/utils";

export function SustainabilityHighlights({
  id = "sustainability",
  eyebrow = "Sustainability",
  title = "More Than Just Scrap",
  description = "Handling battery scrap properly does more than close a deal. It keeps useful materials in circulation, lowers environmental risk and makes the clean-energy economy stronger.",
  showLink = true,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  showLink?: boolean;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y bg-white", className)}>
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div className="lg:order-2 lg:col-span-6 xl:col-span-5">
          <Reveal>
            <SectionHeading
              id={`${id}-title`}
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
          </Reveal>
          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {sustainabilityBenefits.map(({ title, text, icon: Icon }, index) => (
              <Reveal as="li" key={title} delay={(index % 2) * 80} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf-50 text-forest-700 ring-1 ring-leaf-100">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-ink-950">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          {showLink && (
            <Reveal className="mt-10">
              <ArrowLink href="/sustainability">How we think about sustainability</ArrowLink>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:order-1 lg:col-span-6 xl:col-span-7">
          <div className="relative h-full">
            <Parallax className="aspect-[4/3] rounded-[2rem] bg-forest-900 lg:aspect-auto lg:h-full lg:min-h-[36rem]" offset={44}>
              <Image
                src={photos.leafDark.src}
                alt={photos.leafDark.alt}
                fill
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 50vw, 92vw"
                placeholder="blur"
                className="object-cover"
              />
            </Parallax>
            <div className="surface-dark absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-forest-950/70 p-6 text-white backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-sm sm:p-7">
              <p className="font-display text-2xl font-bold leading-tight sm:text-[1.75rem]">
                Waste Today, <span className="text-sun-300">Value Tomorrow.</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Recovering batteries properly keeps their materials working, and keeps them out of landfill.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
