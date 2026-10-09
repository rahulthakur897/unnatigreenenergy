import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How UNNATI GREEN ENERGY collects, uses and protects information submitted through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      id="privacy-hero"
      title="Privacy Policy"
      href="/privacy-policy"
      intro="How we collect, use and protect the information you share with us."
    >
      {/* TODO: Confirm the effective date once this policy has been reviewed. */}
      <p>
        <strong>Last updated:</strong> To be confirmed
      </p>

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects,
        uses and protects information when you visit this website or contact us.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Information you provide</strong> — such as your name, company name, phone number, email address, details
          of your battery material, estimated quantities and any message you send through our forms.
        </li>
        <li>
          <strong>Technical information</strong> — such as your IP address, browser type and pages visited, which hosting
          infrastructure may record automatically for security and performance.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <ul>
        <li>To respond to inquiries and prepare quotations.</li>
        <li>To communicate with you about transactions and services you request.</li>
        <li>To maintain, secure and improve this website.</li>
        <li>To comply with applicable legal obligations.</li>
      </ul>

      <h2>4. Sharing of information</h2>
      <p>
        We do not sell your personal information. We may share it with service providers who help us operate this website
        or handle communications on our behalf, and where disclosure is required by law.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We keep personal information only for as long as needed for the purposes described in this policy, or as required by
        law.
      </p>

      <h2>6. Security</h2>
      <p>
        We take reasonable measures to protect the information we hold. However, no method of transmission or storage is
        completely secure.
      </p>

      <h2>7. Your choices</h2>
      <p>
        You may request access to, correction of or deletion of your personal information by contacting us using the details
        below.
      </p>

      <h2>8. Cookies</h2>
      <p>
        This website does not use advertising cookies. If analytics or similar tools are introduced, this policy will be
        updated accordingly.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>We may update this policy from time to time. The latest version will always be available on this page.</p>

      <h2>10. Contact</h2>
      <p>
        For privacy-related questions, email{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-forest-700 underline underline-offset-2">
          {site.contact.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
