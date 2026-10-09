import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function ContactItem({
  icon: Icon,
  label,
  lines,
  href,
}: {
  icon: LucideIcon;
  label: string;
  lines: string[];
  href?: string;
}) {
  return (
    <li className="flex gap-4 rounded-2xl border border-mist-200 bg-mist-50/70 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-700 text-sun-300">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</p>
        {href ? (
          <a href={href} className="mt-1 block break-words font-semibold text-ink-950 transition-colors hover:text-forest-700">
            {lines[0]}
          </a>
        ) : (
          lines.map((line) => (
            <p key={line} className="mt-1 text-[0.9375rem] leading-relaxed text-ink-700">
              {line}
            </p>
          ))
        )}
      </div>
    </li>
  );
}

export function ContactSection({
  id = "contact",
  formAnchorId,
  className,
}: {
  id?: string;
  /** Anchor for "Request a Quote" links (use on one page only). */
  formAnchorId?: string;
  className?: string;
}) {
  const { contact } = site;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y bg-white", className)}>
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              id={`${id}-title`}
              eyebrow="Contact"
              title="Let's Talk About Your Battery Scrap Requirements"
              description="Tell us about your material and our team will get back to you with next steps. For urgent requirements, reach us directly."
            />
          </Reveal>
          {/* TODO: Contact details are placeholders — update them in lib/site.ts. */}
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ContactItem
                icon={Phone}
                label="Phone"
                lines={[contact.phone.display]}
                href={contact.phone.href || undefined}
              />
              <ContactItem icon={Mail} label="Email" lines={[contact.email]} href={`mailto:${contact.email}`} />
              <ContactItem icon={MapPin} label="Address" lines={[...contact.address.lines]} />
              <ContactItem
                icon={Clock}
                label="Business Hours"
                lines={contact.hours.map((slot) => `${slot.days}: ${slot.time}`)}
              />
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={60}>
            <div id={formAnchorId} className="rounded-[1.75rem] border border-mist-200 bg-mist-50 p-6 shadow-soft sm:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink-950">Request a Quote</h3>
                <p className="text-sm text-ink-400">
                  Fields marked <span className="text-leaf-600">*</span> are required
                </p>
              </div>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
                Share a few details about your battery scrap — the more you tell us, the more accurate our response.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
