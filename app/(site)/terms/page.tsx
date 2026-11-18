import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms that apply when you use the UNNATI GREEN ENERGY website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      id="terms-hero"
      title="Terms & Conditions"
      href="/terms"
      intro="The rules for using this website."
    >
      {/* TODO: Confirm the effective date once these terms have been reviewed. */}
      <p>
        <strong>Last updated:</strong> To be confirmed
      </p>

      <h2>1. Agreeing to these terms</h2>
      <p>By visiting or using this website, you accept these Terms &amp; Conditions. If you don&rsquo;t accept them, please don&rsquo;t use the website.</p>

      <h2>2. Information on this website</h2>
      <p>
        The content here is general information about {site.name} and what we do. It is not an offer, and we may change it at
        any time without telling you first.
      </p>

      <h2>3. Quotes and transactions</h2>
      <p>
        Sending an enquiry through this website does not commit you or us to anything. Every quote depends on an evaluation
        of the material and on written confirmation, and each transaction is governed by the terms the parties agree for it.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The {site.name} name and logo, and the original content of this website, belong to {site.name}. Photographs from third
        parties are used under their own licences. Please don&rsquo;t copy our content without our permission.
      </p>

      <h2>5. Using the website properly</h2>
      <p>You must not misuse this website, try to access it without authorisation, or send us false or misleading information.</p>

      <h2>6. Limits on our liability</h2>
      <p>
        As far as the law allows, {site.name} accepts no liability for any loss that results from using, or relying on, the
        information on this website.
      </p>

      <h2>7. Links to other websites</h2>
      <p>This website may contain links to sites run by others. We are not responsible for what those sites contain or how they operate.</p>

      <h2>8. Governing law</h2>
      {/* TODO: Specify the jurisdiction (city/state) with your legal advisor. */}
      <p>These terms are governed by Indian law. The jurisdiction is to be confirmed.</p>

      <h2>9. Changes to these terms</h2>
      <p>We may update these terms whenever we need to. If you keep using the website after a change, you accept the updated terms.</p>

      <h2>10. Contact</h2>
      <p>
        Please send any questions about these terms to{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-forest-700 underline underline-offset-2">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
