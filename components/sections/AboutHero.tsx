import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SunGlow } from "@/components/ui/Decor";
import { photos } from "@/lib/images";
import { breadcrumbSchema } from "@/lib/seo";
import { quoteHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const marqueeWords = [
  "Accountable Sourcing",
  "Open Evaluation",
  "Materials Reclaimed",
  "A Closed Loop",
  "Partners for the Long Run",
  "Waste Today, Value Tomorrow",
];

const trail = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
];

export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="surface-dark relative isolate overflow-hidden bg-forest-950 text-white">
      <Image
        src={photos.warehouse.src}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(1_23_10/0.8)_0%,rgb(1_23_10/0.9)_60%,#01170a_100%)] lg:bg-[linear-gradient(90deg,#01170a_0%,rgb(1_23_10/0.92)_40%,rgb(1_23_10/0.62)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark opacity-60 mask-fade-b" />
      <SunGlow className="-right-56 -top-72 -z-10 size-[48rem]" />

      <div className="container-site relative grid items-end gap-12 pb-16 pt-40 lg:min-h-[46rem] lg:grid-cols-12 lg:items-center lg:gap-14 lg:pb-20 xl:gap-20">
        <div className="lg:col-span-7">
          <nav aria-label="Breadcrumb" className="animate-fade-up">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li className="flex items-center gap-1.5">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <ChevronRight className="size-3.5 text-white/35" aria-hidden="true" />
              </li>
              <li>
                <span aria-current="page" className="font-medium text-white/90">
                  About Us
                </span>
              </li>
            </ol>
          </nav>
          <p className="mt-8 inline-flex animate-fade-up items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-leaf-200 [animation-delay:60ms]">
            <span aria-hidden="true" className="h-px w-8 bg-sun-400" />
            About UNNATI GREEN ENERGY
          </p>
          <h1
            id="about-hero-title"
            className="mt-5 animate-fade-up font-display text-[2.625rem] font-extrabold leading-[1.02] tracking-[-0.035em] [animation-delay:120ms] sm:text-6xl lg:text-[4.25rem]"
          >
            Giving Every Battery a <span className="text-gradient-energy">Second Purpose</span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-white/75 [animation-delay:200ms] sm:text-xl">
            We help businesses deal with lithium-ion battery scrap the right way, turning what was waste into a return and
            keeping useful materials in circulation.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:280ms] sm:flex-row">
            <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/services" variant="outlineLight" size="lg">
              See What We Do
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Keyword marquee (decorative) */}
      <div aria-hidden="true" className="relative overflow-hidden border-t border-white/10 bg-forest-950/70 py-5">
        <div className="flex w-max animate-[marquee_48s_linear_infinite]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {marqueeWords.map((word) => (
                <li
                  key={word}
                  className="flex items-center gap-8 whitespace-nowrap px-8 font-display text-lg font-semibold tracking-tight text-white/70"
                >
                  <span className="size-1.5 rounded-full bg-sun-400" />
                  {word}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </section>
  );
}
