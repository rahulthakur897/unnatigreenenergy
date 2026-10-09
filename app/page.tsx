import { AboutIntro } from "@/components/sections/AboutIntro";
import { CircularEconomy } from "@/components/sections/CircularEconomy";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { QualitySafety } from "@/components/sections/QualitySafety";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SustainabilityHighlights } from "@/components/sections/SustainabilityHighlights";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBar } from "@/components/sections/TrustBar";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "UNNATI GREEN ENERGY | Lithium-Ion Battery Scrap Trading",
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

// Section ids are unique per page: Cache Components keeps recently visited routes
// mounted (hidden), so repeated ids across pages could capture hash links.
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutIntro id="about" />
      <ServicesGrid id="services" />
      <ProductsShowcase id="products" />
      <ProcessTimeline id="process" />
      <IndustriesGrid id="industries" />
      <WhyChooseUs id="why-us" />
      <CircularEconomy id="circular-economy" />
      <SustainabilityHighlights id="sustainability" />
      <QualitySafety id="quality-safety" />
      <Testimonials id="testimonials" />
      <LogoCloud id="partners" />
      <FAQ id="faq" withSchema />
      <CTA id="home-cta" />
    </>
  );
}
