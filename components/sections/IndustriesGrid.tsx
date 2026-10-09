import { IndustryCard } from "@/components/cards/IndustryCard";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/content/industries";
import { cn } from "@/lib/utils";

export function IndustriesGrid({
  id = "industries",
  eyebrow = "Industries",
  title = "Industries We Serve",
  description = "Nearly every modern industry depends on lithium-ion batteries. Whatever your sector, we can help you deal with battery scrap properly and get value back from it.",
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
            action={showLink ? <ArrowLink href="/industries">Explore all industries</ArrowLink> : undefined}
          />
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <Reveal as="li" key={industry.slug} delay={(index % 4) * 80}>
              <IndustryCard industry={industry} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
