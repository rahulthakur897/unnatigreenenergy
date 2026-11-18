import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTA } from "@/components/sections/CTA";
import { DetailSkeleton } from "@/components/sections/DetailSkeleton";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { QuoteAside } from "@/components/sections/QuoteAside";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { getService, services } from "@/content/services";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.title, description: service.summary, path: `/services/${service.slug}` });
}

// Params are read inside <Suspense> so the shared App Shell stays URL-independent
// (required for instant navigations with Partial Prefetching). Known slugs are
// still fully prerendered via generateStaticParams.
export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: Pick<PageProps<"/services/[slug]">, "params">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const pid = `service-${service.slug}`;

  return (
    <>
      <PageHero
        id={`${pid}-hero`}
        eyebrow="Services"
        title={service.title}
        description={service.summary}
        image={service.image}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      >
        <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
          Request a Quote
        </ButtonLink>
      </PageHero>

      <section aria-labelledby={`${pid}-overview`} className="section-y bg-white">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Overview</Eyebrow>
              <h2
                id={`${pid}-overview`}
                className="mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-ink-950 sm:text-[2.5rem]"
              >
                Our approach to {service.shortTitle.toLowerCase()}
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-500">
                {service.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink-950">
                {service.scopeTitle ?? "What we take"}
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.scope.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-mist-200 bg-mist-50 p-4 text-[0.9375rem] text-ink-700">
                    <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf-500 text-white">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink-950">What you get</h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {service.highlights.map((highlight, i) => (
                  <li key={highlight.title} className="rounded-[1.25rem] border border-mist-200 p-6">
                    <span className="font-display text-sm font-bold text-leaf-600">0{i + 1}</span>
                    <p className="mt-3 font-display font-bold text-ink-950">{highlight.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{highlight.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <QuoteAside idealFor={service.idealFor} />
          </div>
        </div>
      </section>

      <ProcessTimeline id={`${pid}-process`} />

      <section aria-labelledby={`${pid}-related`} className="section-y">
        <div className="container-site">
          <Reveal>
            <SectionHeading id={`${pid}-related`} eyebrow="More Services" title="Other ways we can help" />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal as="li" key={item.slug} delay={i * 90}>
                <ServiceCard service={item} index={services.indexOf(item)} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTA id={`${pid}-cta`} />
      <JsonLd data={serviceSchema({ name: service.title, description: service.summary, path: `/services/${service.slug}` })} />
    </>
  );
}
