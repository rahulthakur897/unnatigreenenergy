import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/company";
import { stepNumber } from "@/lib/utils";

export function ProcessTimeline({ id = "process" }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="surface-dark section-y relative isolate overflow-hidden bg-forest-900 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            align="center"
            tone="dark"
            eyebrow="How It Works"
            title="From Battery Waste to Resource Recovery"
            description="A clear, accountable process — from your first inquiry to the point where materials find new value."
          />
        </Reveal>

        {/* Desktop: horizontal timeline */}
        <div className="relative mt-20 hidden lg:block">
          <ScrollLine orientation="horizontal" className="absolute left-[7.5%] right-[7.5%] top-7 h-0.5" />
          <ol className="relative grid grid-cols-6 gap-6">
            {processSteps.map(({ title, text, icon: Icon }, index) => (
              <Reveal as="li" key={title} delay={index * 110} className="group flex flex-col items-center text-center">
                <span className="relative grid size-14 place-items-center rounded-full border border-white/15 bg-forest-800 text-leaf-200 shadow-[0_0_0_10px_var(--color-forest-900)] transition-colors duration-500 group-hover:border-sun-400/60 group-hover:bg-sun-400 group-hover:text-forest-950">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="mt-7 font-display text-sm font-semibold tracking-wide text-sun-300">{stepNumber(index)}</span>
                <h3 className="mt-2 font-display text-[1.0625rem] font-semibold leading-snug xl:text-lg">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Mobile & tablet: vertical timeline */}
        <div className="relative mt-14 lg:hidden">
          <ScrollLine
            orientation="vertical"
            className="absolute bottom-8 left-7 top-8 w-0.5"
            fillClassName="bg-gradient-to-b from-leaf-300 via-leaf-200 to-sun-400"
          />
          <ol className="relative space-y-10 sm:space-y-12">
            {processSteps.map(({ title, text, icon: Icon }, index) => (
              <Reveal as="li" key={title} className="flex gap-6">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-white/15 bg-forest-800 text-leaf-200 shadow-[0_0_0_8px_var(--color-forest-900)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <span className="font-display text-sm font-semibold text-sun-300">{stepNumber(index)}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-white/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
