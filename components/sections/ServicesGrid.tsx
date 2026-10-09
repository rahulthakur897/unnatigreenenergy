import { MessageSquare } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";
import { quoteHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ServicesGrid({
  id = "services",
  eyebrow = "What We Do",
  title = "Our Services",
  description = "From battery scrap trading and material recovery to support for lithium-ion battery manufacturing lines — responsible, transparent services across the battery value chain.",
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
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow={eyebrow}
            title={title}
            description={description}
            action={showLink ? <ArrowLink href="/services">View all services</ArrowLink> : undefined}
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={(index % 4) * 80}>
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
          <Reveal as="li" delay={240}>
            <div className="surface-dark relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-forest-800 p-7 text-white sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 size-56 rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.22),transparent_70%)]"
              />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-white/10 text-sun-300 ring-1 ring-white/15">
                <MessageSquare className="size-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-7 font-display text-xl font-bold tracking-tight">Need something specific?</h3>
              <p className="relative mt-3 flex-1 text-[0.9375rem] leading-relaxed text-white/70">
                Every requirement is different. Tell us about your material or project and we&rsquo;ll shape the right
                service around it.
              </p>
              <ButtonLink href={quoteHref} variant="accent" arrow className="relative mt-7 self-start">
                Talk to Our Team
              </ButtonLink>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
