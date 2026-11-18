import { AboutHero } from "@/components/sections/AboutHero";
import { AboutStory } from "@/components/sections/AboutStory";
import { FocusAreas, MissionVision, ValuesGrid } from "@/components/sections/MissionValues";
import { StatsBand } from "@/components/sections/StatsBand";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Meet UNNATI GREEN ENERGY, a lithium-ion cell and battery scrap trader that helps businesses dispose of batteries properly and get valuable materials back into use.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory id="about-story" />
      <MissionVision id="about-mission" />
      <FocusAreas id="about-focus" />
      <ValuesGrid id="about-values" />
      <WhyChooseUs id="about-why-us" className="bg-white" />
    </>
  );
}
