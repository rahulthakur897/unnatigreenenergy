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
  description = "Lithium-ion batteries power almost every modern industry. We help each of them handle battery scrap responsibly — and recover the value inside it.",
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
