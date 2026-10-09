import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using the UNNATI GREEN ENERGY website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      id="terms-hero"
      title="Terms & Conditions"
      href="/terms"
      intro="The terms that apply when you use this website."
    >
      {/* TODO: Confirm the effective date once these terms have been reviewed. */}
      <p>
        <strong>Last updated:</strong> To be confirmed
      </p>

      <h2>1. Acceptance of terms</h2>
      <p>By accessing or using this website, you agree to these Terms &amp; Conditions. If you do not agree, please do not use the website.</p>

      <h2>2. Website information</h2>
      <p>
        Content on this website is provided for general information about {site.name} and its services. It does not
        constitute an offer, and it may be updated or changed without notice.
      </p>

      <h2>3. Quotations and transactions</h2>
      <p>
        Inquiries submitted through this website are not binding. Any quotation is subject to evaluation of the material and
        written confirmation. Transactions are governed by the specific terms agreed between the parties.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The {site.name} name, logo and original content on this website belong to {site.name}. Third-party photography is
        used under the terms of its respective licence. You may not reproduce our content without permission.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to misuse this website, attempt to gain unauthorised access to it, or submit false or misleading information.</p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} is not liable for any loss arising from use of, or reliance on, the
        information on this website.
      </p>

      <h2>7. External links</h2>
      <p>This website may link to third-party websites. We are not responsible for their content or practices.</p>

      <h2>8. Governing law</h2>
      {/* TODO: Specify the jurisdiction (city/state) with your legal advisor. */}
      <p>These terms are governed by the laws of India. Jurisdiction details are to be confirmed.</p>

      <h2>9. Changes to these terms</h2>
      <p>We may revise these terms at any time. Continued use of the website means you accept the revised terms.</p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-forest-700 underline underline-offset-2">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
