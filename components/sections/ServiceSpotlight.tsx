import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CellPattern } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { getService } from "@/content/services";
import { quoteHref } from "@/lib/site";

/** Feature band for the lithium-ion battery manufacturing line service. */
export function ServiceSpotlight({ id = "manufacturing-line" }: { id?: string }) {
  const service = getService("lithium-ion-battery-manufacturing-line");
  if (!service) return null;

  return (
    <section aria-labelledby={`${id}-title`} className="section-y">
      <div className="container-site">
        <Reveal>
          <div className="surface-dark relative isolate grid overflow-hidden rounded-[2rem] bg-forest-900 text-white lg:grid-cols-2">
            <CellPattern id={`${id}-cells`} className="-z-10 text-white/[0.04] [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
            <div className="relative min-h-[18rem] lg:order-2 lg:min-h-full">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                placeholder="blur"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent lg:bg-gradient-to-r lg:from-forest-900 lg:via-forest-900/20" />
            </div>
            <div className="p-8 sm:p-12 lg:p-14">
              <Eyebrow tone="dark">Service Spotlight</Eyebrow>
              <h2 id={`${id}-title`} className="mt-5 font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]">
                {service.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/70">{service.summary}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.scope.slice(0, 6).map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] text-white/85">
                    <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sun-400 text-forest-950">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/services/${service.slug}`} variant="accent" size="lg" arrow>
                  Explore This Service
                </ButtonLink>
                <ButtonLink href={quoteHref} variant="outlineLight" size="lg">
                  Discuss Your Line
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
