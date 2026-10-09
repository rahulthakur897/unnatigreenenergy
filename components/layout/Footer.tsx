import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CellPattern, SunGlow } from "@/components/ui/Decor";
import { Logo } from "@/components/ui/Logo";
import { services } from "@/content/services";
import { callHref, quoteHref, site } from "@/lib/site";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = services.map((service) => ({ label: service.shortTitle, href: `/services/${service.slug}` }));

function FooterHeading({ children }: { children: string }) {
  return <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-200">{children}</h2>;
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-block py-1 text-[0.9375rem] text-white/65 transition-colors duration-300 hover:text-white"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { contact } = site;

  return (
    <footer className="surface-dark relative overflow-hidden bg-forest-950 text-white">
      <CellPattern id="footer-cells" className="text-white/[0.035]" />
      <SunGlow className="-right-40 -top-56 size-[36rem]" />

      <div className="container-site relative">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" aria-label={`${site.name} — home`} className="inline-block rounded-2xl bg-white p-3.5 shadow-lg">
              <Logo className="h-24 w-auto" sizes="120px" />
            </Link>
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
              Responsible lithium-ion cell and battery scrap trading — helping businesses recover value from battery
              waste while supporting a cleaner, circular energy future.
            </p>
            {site.social.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {site.social.map((profile) => (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-sm text-white/75 hover:border-white/40 hover:text-white"
                    >
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Company" className="lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 space-y-1.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-3">
            <FooterHeading>Services</FooterHeading>
            <ul className="mt-5 space-y-1.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            {/* TODO: Contact details come from lib/site.ts — replace the placeholders there. */}
            <address className="mt-5 space-y-4 text-[0.9375rem] not-italic text-white/65">
              <Link href={callHref} className="flex items-start gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden="true" />
                <span>{contact.phone.display}</span>
              </Link>
              <a href={`mailto:${contact.email}`} className="flex items-start gap-3 break-all transition-colors hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden="true" />
                <span>{contact.email}</span>
              </a>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden="true" />
                <span>{contact.address.short}</span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden="true" />
                <span>
                  {contact.hours[0].days}
                  <br />
                  {contact.hours[0].time}
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.name}. All Rights Reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="transition-colors hover:text-white">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
