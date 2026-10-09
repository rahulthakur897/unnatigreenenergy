import { ContactSection } from "@/components/sections/ContactSection";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us — Request a Quote",
  description:
    "Request a quote for lithium-ion cell and battery scrap. Share your material type, quantity and location with UNNATI GREEN ENERGY.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Let's Talk About Your Battery Scrap"
        description="Request a quote, ask a question or discuss a recurring requirement. Our team will review your details and respond with next steps."
        image={photos.fieldTeam}
        crumbs={[{ label: "Contact", href: "/contact" }]}
        compact
      />
      {/* "Request a Quote" links across the site point to #quote-form */}
      <ContactSection id="contact-details" formAnchorId="quote-form" />
      <FAQ id="contact-faq" />
    </>
  );
}
