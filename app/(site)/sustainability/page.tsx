import { CircularEconomy } from "@/components/sections/CircularEconomy";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { QualitySafety } from "@/components/sections/QualitySafety";
import { Principles, SustainabilityIntro } from "@/components/sections/SustainabilityStory";
import { SustainabilityHighlights } from "@/components/sections/SustainabilityHighlights";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability — More Than Just Scrap",
  description:
    "Why handling lithium-ion battery scrap properly matters: reclaimed materials, less waste and a closed-loop energy economy.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        id="sustainability-hero"
        eyebrow="Sustainability"
        title="More Than Just Scrap"
        description="Each lithium-ion battery recovered the right way keeps useful materials working and out of landfill."
        image={photos.banner}
        crumbs={[{ label: "Sustainability", href: "/sustainability" }]}
      />
      <SustainabilityIntro id="sustainability-intro" />
      <SustainabilityHighlights
        id="sustainability-benefits"
        eyebrow="Benefits"
        title="What proper recovery achieves"
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
