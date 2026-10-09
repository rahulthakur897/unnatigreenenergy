import { Reveal } from "@/components/motion/Reveal";
import { QualityExplorer, type QualityItem } from "@/components/sections/QualityExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { qualityPillars } from "@/content/company";
import { photos, type Photo } from "@/lib/images";
import { cn } from "@/lib/utils";

/** One photograph per standard, in the same order as `qualityPillars`. */
const pillarImages: Photo[] = [
  photos.safetyWorker, // Safe Handling
  photos.inspectionLine, // Quality Inspection
  photos.lithiumCells, // Responsible Segregation
  photos.warehouseForklift, // Reliable Logistics
  photos.liIonLabel, // Transparent Documentation
  photos.leafDark, // Environmental Responsibility
];

export function QualitySafety({ id = "quality-safety", className }: { id?: string; className?: string }) {
  // Icons are rendered here (server) and handed to the interactive client component as elements.
  const items: QualityItem[] = qualityPillars.map(({ title, text, icon: Icon }, index) => ({
    title,
    text,
    icon: <Icon aria-hidden="true" />,
    image: pillarImages[index] ?? photos.safetyWorker,
  }));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y relative overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-grid-light [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="container-site relative">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow="Quality & Safety"
            title="Built Around Quality, Safety & Responsibility"
            description="Lithium-ion batteries demand respect. Six operating standards keep careful handling and accurate information at the centre of every transaction."
          />
        </Reveal>
        <Reveal className="mt-14 lg:mt-16" delay={100}>
          <QualityExplorer items={items} />
        </Reveal>
      </div>
    </section>
  );
}
