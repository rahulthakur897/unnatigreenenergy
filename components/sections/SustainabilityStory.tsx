import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { sustainabilityPrinciples } from "@/content/company";
import { stepNumber } from "@/lib/utils";

export function SustainabilityIntro({ id = "sustainability-intro" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Eyebrow>Why It Matters</Eyebrow>
          <h2 id={`${id}-title`} className="mt-5 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink-950 sm:text-[2.5rem] lg:text-[3rem]">
            The clean-energy transition runs on batteries. <span className="text-leaf-600">Their end of life matters too.</span>
          </h2>
        </Reveal>
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-500 lg:col-span-6 lg:pt-12" delay={100}>
          <p>
            Lithium-ion batteries power electric vehicles, store renewable energy and run the devices we rely on every day.
            As adoption grows, so does the volume of batteries reaching the end of their working life.
          </p>
          <p>
            Handled carelessly, battery waste is a safety and environmental risk. Handled responsibly, it is a source of
            valuable materials that can return to the supply chain. That is the difference we work to make.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Principles({ id = "principles" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow="Our Principles"
            title="Four principles guide our sustainability approach"
            description="They shape how we evaluate, handle and route every lot of battery scrap."
          />
        </Reveal>
        <ol className="mt-14 grid gap-5 md:grid-cols-2">
          {sustainabilityPrinciples.map((principle, index) => (
            <Reveal as="li" key={principle.title} delay={(index % 2) * 90}>
              <div className="group flex h-full gap-6 rounded-[1.5rem] border border-mist-200 bg-mist-50 p-7 transition-colors duration-500 hover:border-leaf-300/60 hover:bg-leaf-50/60 sm:p-9">
                <span className="font-display text-4xl font-extrabold leading-none text-leaf-300 transition-colors duration-500 group-hover:text-leaf-500">
                  {stepNumber(index)}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-950">{principle.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-500">{principle.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
