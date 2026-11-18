import { ContactSection } from "@/components/sections/ContactSection";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us — Request a Quote",
  description:
    "Get a quote from UNNATI GREEN ENERGY for your lithium-ion cell and battery scrap. Tell us the material, quantity and location.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Got Battery Scrap? Let's Talk"
        description="Ask for a quote, put a question to us or set up regular pickups. We'll look at your details and reply with the next steps."
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
