import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ServiceSpotlight } from "@/components/sections/ServiceSpotlight";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services — Battery Scrap Trading, Recovery & Manufacturing Line Support",
  description:
    "Services from UNNATI GREEN ENERGY: lithium-ion scrap trading, battery production line support, cell and pack scrap, material recovery, accountable sourcing and bulk industrial trading.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        id="services-hero"
        eyebrow="Services"
        title="Services That Get the Most From Every Battery"
        description="Whether you're clearing lithium-ion scrap or setting up a battery production line, we offer practical, open services across the battery value chain."
        image={photos.liIonLabel}
        crumbs={[{ label: "Services", href: "/services" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
            Request a Quote
          </ButtonLink>
          <ButtonLink href="#services-process" variant="outlineLight" size="lg">
            How It Works
          </ButtonLink>
        </div>
      </PageHero>
      <ServicesGrid
        id="services-list"
        eyebrow="What We Offer"
        title="Seven ways we can help"
        description="Every service rests on the same three things: an accurate evaluation, careful handling and the right destination for your material."
        showLink={false}
      />
      <ServiceSpotlight id="services-spotlight" />
      <ProcessTimeline id="services-process" />
    </>
  );
}
