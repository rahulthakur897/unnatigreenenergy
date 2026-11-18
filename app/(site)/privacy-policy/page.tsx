import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What information UNNATI GREEN ENERGY collects through this website, how it is used and how it is kept safe.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      id="privacy-hero"
      title="Privacy Policy"
      href="/privacy-policy"
      intro="What we collect when you use this website or contact us, and how we look after it."
    >
      {/* TODO: Confirm the effective date once this policy has been reviewed. */}
      <p>
        <strong>Last updated:</strong> To be confirmed
      </p>

      <h2>1. About this policy</h2>
      <p>
        This policy describes how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) gathers, uses and
        safeguards information when you browse this website or get in touch with us.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li>
          <strong>Details you give us</strong>, for example your name, company, phone number and email address, along with
          information about your battery material, likely quantities and anything you write in our forms.
        </li>
        <li>
          <strong>Technical data</strong>, for example your IP address, the browser you use and the pages you view. Our hosting
          provider may log this automatically to keep the site secure and running well.
        </li>
      </ul>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To reply to your enquiries and prepare quotes.</li>
        <li>To keep in touch about the transactions and services you ask for.</li>
        <li>To run, protect and improve this website.</li>
        <li>To meet our legal obligations.</li>
      </ul>

      <h2>4. Who we share it with</h2>
      <p>
        We never sell your personal information. We may pass it to service providers who help us run this website or manage
        our communications, and we will disclose it where the law requires us to.
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        We hold personal information only for as long as we need it for the reasons set out above, or for as long as the law
        requires.
      </p>

      <h2>6. Keeping it safe</h2>
      <p>
        We take sensible steps to protect the information we hold, although no way of sending or storing data can be
        guaranteed to be completely secure.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can ask to see, correct or delete the personal information we hold about you by contacting us at the address
        below.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We do not use advertising cookies on this website. If we add analytics or similar tools in future, we will update this
        policy.
      </p>

      <h2>9. Updates to this policy</h2>
      <p>We may change this policy from time to time. The current version will always be published on this page.</p>

      <h2>10. Contact</h2>
      <p>
        If you have a question about your privacy, email{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-forest-700 underline underline-offset-2">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
