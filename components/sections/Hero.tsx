import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SunGlow } from "@/components/ui/Decor";
import { RecoveryLoop } from "@/components/sections/RecoveryLoop";
import { heroChecks } from "@/content/company";
import { photos } from "@/lib/images";
import { quoteHref, site } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="surface-dark relative isolate overflow-hidden bg-forest-950 text-white">
      {/* Background: brand-duotone battery modules, legibility gradients, sunlight */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={photos.heroModules.src}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          className="object-cover object-[70%_40%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(1_23_10/0.72)_0%,rgb(1_23_10/0.86)_55%,#01170a_100%)] lg:bg-[linear-gradient(90deg,#01170a_0%,rgb(1_23_10/0.93)_32%,rgb(1_23_10/0.55)_64%,rgb(1_23_10/0.25)_100%)]" />
        <div className="absolute inset-0 bg-grid-dark opacity-70 [mask-image:radial-gradient(ellipse_at_30%_40%,black_20%,transparent_70%)]" />
        <SunGlow className="-right-48 -top-72 size-[48rem]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-forest-950" />
      </div>

      <div className="container-site relative grid min-h-[100svh] items-center gap-12 pb-36 pt-36 sm:pb-40 lg:grid-cols-12 lg:pt-40 xl:gap-16">
        <div className="lg:col-span-7">
          <p className="inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[0.8125rem] font-medium text-white/85 backdrop-blur-sm">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-leaf-300" />
              <span className="relative size-2 rounded-full bg-leaf-300" />
            </span>
            {site.descriptor}
          </p>

          <h1
            id="home-hero-title"
            className="mt-7 animate-fade-up font-display text-[2.625rem] font-extrabold leading-[1.02] tracking-[-0.035em] [animation-delay:120ms] sm:text-6xl lg:text-[4.25rem] xl:text-[4.5rem]"
          >
            Used Batteries Today, <span className="text-gradient-energy">Valuable Resources Tomorrow</span>
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-white/75 [animation-delay:240ms] sm:text-xl">
            UNNATI GREEN ENERGY buys and trades lithium-ion cell and battery scrap, giving businesses a dependable way to
            earn a return on worn-out batteries and keep their materials in use.
          </p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row sm:items-center">
            <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/services" variant="outlineLight" size="lg">
              See What We Do
            </ButtonLink>
          </div>

          <ul className="mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 text-sm text-white/70 [animation-delay:480ms]">
            {heroChecks.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-leaf-400/20 text-leaf-200">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 animate-fade-up [animation-delay:560ms] lg:hidden">
            <RecoveryLoop variant="rail" />
          </div>
        </div>

        <div className="hidden animate-fade-up [animation-delay:520ms] lg:col-span-5 lg:block xl:pl-6">
          <RecoveryLoop variant="card" />
        </div>
      </div>
    </section>
  );
}
