import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { DetailSkeleton } from "@/components/sections/DetailSkeleton";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteAside } from "@/components/sections/QuoteAside";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustry, industries } from "@/content/industries";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return pageMetadata({
    title: `${industry.title} Battery Scrap`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
  });
}

// Params are read inside <Suspense> so the shared App Shell stays URL-independent
// (required for instant navigations with Partial Prefetching). Known slugs are
// still fully prerendered via generateStaticParams.
export default function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <IndustryContent params={params} />
    </Suspense>
  );
}

async function IndustryContent({ params }: Pick<PageProps<"/industries/[slug]">, "params">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const Icon = industry.icon;
  const related = services.filter((service) => industry.relatedServices.includes(service.slug));
  const others = industries.filter((item) => item.slug !== industry.slug);
  const pid = `industry-${industry.slug}`;

  return (
    <>
      <PageHero
        id={`${pid}-hero`}
        eyebrow="Industries"
        title={industry.title}
        description={industry.summary}
        image={industry.image}
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.title, href: `/industries/${industry.slug}` },
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
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-forest-700 text-sun-300">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <Eyebrow>Overview</Eyebrow>
              </div>
              <h2 id={`${pid}-overview`} className="mt-6 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-ink-950 sm:text-[2.5rem]">
                Responsible battery scrap management, built around your sector
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-500">
                {industry.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink-950">Battery scrap we typically handle</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {industry.scrapTypes.map((item) => (
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
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink-950">How we support {industry.title}</h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {industry.support.map((item, i) => (
                  <li key={item.title} className="rounded-[1.25rem] border border-mist-200 p-6">
                    <span className="font-display text-sm font-bold text-leaf-600">0{i + 1}</span>
                    <p className="mt-3 font-display font-bold text-ink-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <QuoteAside />
          </div>
        </div>
      </section>

      <section aria-labelledby={`${pid}-services`} className="section-y">
        <div className="container-site">
          <Reveal>
            <SectionHeading id={`${pid}-services`} eyebrow="Relevant Services" title={`Services for ${industry.title}`} />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={i * 90}>
                <ServiceCard service={service} index={services.indexOf(service)} />
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-16 border-t border-mist-200 pt-10">
            <h2 className="font-display text-lg font-bold text-ink-950">Other industries we serve</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/industries/${item.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-forest-700 hover:bg-forest-700 hover:text-white"
                  >
                    {item.title}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

    </>
  );
}
