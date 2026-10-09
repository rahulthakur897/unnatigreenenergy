import { CircularEconomy } from "@/components/sections/CircularEconomy";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { QualitySafety } from "@/components/sections/QualitySafety";
import { Principles, SustainabilityIntro } from "@/components/sections/SustainabilityStory";
import { SustainabilityHighlights } from "@/components/sections/SustainabilityHighlights";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability — Creating Value Beyond Waste",
  description:
    "How responsible lithium-ion battery scrap management supports resource recovery, reduced waste and a circular energy economy.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        id="sustainability-hero"
        eyebrow="Sustainability"
        title="Creating Value Beyond Waste"
        description="Every lithium-ion battery that is recovered responsibly keeps valuable materials in use — and out of landfill."
        image={photos.banner}
        crumbs={[{ label: "Sustainability", href: "/sustainability" }]}
      />
      <SustainabilityIntro id="sustainability-intro" />
      <SustainabilityHighlights
        id="sustainability-benefits"
        eyebrow="Benefits"
        title="What responsible recovery makes possible"
        showLink={false}
        className="bg-mist-50"
      />
      <CircularEconomy id="sustainability-loop" />
      <Principles id="sustainability-principles" />
      <QualitySafety id="sustainability-quality" />
      <CTA id="sustainability-cta" />
    </>
  );
}
