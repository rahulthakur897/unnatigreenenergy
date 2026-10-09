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
    "Lithium-ion battery scrap trading, lithium-ion battery manufacturing line services, cell and pack scrap, material recovery, responsible sourcing and bulk industrial trading.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        id="services-hero"
        eyebrow="Services"
        title="Services Built for Responsible Battery Value"
        description="From trading lithium-ion battery scrap to supporting battery manufacturing lines — practical, transparent services across the battery value chain."
        image={photos.liIonLabel}
        crumbs={[{ label: "Services", href: "/services" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
            Request a Quote
          </ButtonLink>
          <ButtonLink href="#services-process" variant="outlineLight" size="lg">
            See How It Works
          </ButtonLink>
        </div>
      </PageHero>
      <ServicesGrid
        id="services-list"
        eyebrow="What We Offer"
        title="Seven ways we create value from batteries"
        description="Each service is built on the same foundation: accurate evaluation, careful handling and responsible routing."
        showLink={false}
      />
      <ServiceSpotlight id="services-spotlight" />
      <ProcessTimeline id="services-process" />
    </>
  );
}
