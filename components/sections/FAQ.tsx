import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/content/faqs";
import { faqSchema } from "@/lib/seo";
import { quoteHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FAQ({
  id = "faq",
  withSchema = false,
  className,
}: {
  id?: string;
  /** Emit FAQPage structured data — enable on one page only to avoid duplicate markup. */
  withSchema?: boolean;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y", className)}>
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                id={`${id}-title`}
                eyebrow="FAQ"
                title="Questions We Often Hear"
                description="Quick answers about selling your battery scrap to us and how the process works."
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="surface-dark relative mt-10 overflow-hidden rounded-[1.5rem] bg-forest-800 p-7 text-white">
                <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.25),transparent_70%)]" />
                <span className="relative grid size-11 place-items-center rounded-full bg-white/10 text-sun-300 ring-1 ring-white/15">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                <p className="relative mt-5 font-display text-xl font-semibold">Can&rsquo;t find your answer?</p>
                <p className="relative mt-2 text-sm leading-relaxed text-white/65">
                  Get in touch and we&rsquo;ll talk through your material, quantities and what you need.
                </p>
                <ButtonLink href={quoteHref} variant="accent" arrow className="relative mt-6">
                  Talk to Our Team
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-8" delay={80}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </section>
  );
}
