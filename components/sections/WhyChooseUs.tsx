import Image from "next/image";
import { Handshake } from "lucide-react";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/content/company";
import { photos } from "@/lib/images";
import { quoteHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function WhyChooseUs({ id = "why-us", className }: { id?: string; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y relative", className)}>
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                id={`${id}-title`}
                eyebrow="Why Us"
                title="Why Choose UNNATI GREEN ENERGY?"
                description="We combine industry understanding with a simple principle: handle every battery responsibly, and treat every client transparently."
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-forest-900">
                <Image
                  src={photos.warehouseForklift.src}
                  alt={photos.warehouseForklift.alt}
                  fill
                  sizes="(min-width: 1024px) 480px, 92vw"
                  placeholder="blur"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent" />
                <p className="absolute bottom-5 left-5 right-5 flex items-center gap-3 font-display font-semibold text-white">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun-400 text-forest-950">
                    <Handshake className="size-5" aria-hidden="true" />
                  </span>
                  Built for long-term partnerships
                </p>
              </div>
              <ButtonLink href={quoteHref} arrow size="lg" className="mt-8">
                Start a Conversation
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        <ul className="grid gap-px self-start overflow-hidden rounded-[1.5rem] border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:col-span-7">
          {whyChooseUs.map((item, index) => (
            <Reveal as="li" key={item.title} delay={(index % 2) * 90} className="bg-white transition-colors duration-500 hover:bg-leaf-50/60">
              <FeatureCard {...item} variant="plain" className="p-7 sm:p-8" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
