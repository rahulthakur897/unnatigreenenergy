"use server";

import { readInquiry, validateInquiry, type InquiryState } from "@/lib/inquiry";
import { site } from "@/lib/site";

const fallbackMessage = `We couldn't send your inquiry online right now. Please email ${site.contact.email}${
  site.contact.phone.href ? ` or call ${site.contact.phone.display}` : ""
} and we'll respond as soon as possible.`;

/**
 * Handles quote/inquiry submissions.
 *
 * Delivery: set INQUIRY_WEBHOOK_URL (e.g. a Zapier/Make/n8n webhook, Slack incoming
 * webhook relay, or your CRM's intake endpoint). The inquiry is POSTed as JSON.
 * TODO: Configure INQUIRY_WEBHOOK_URL before launch — see README.md.
 */
export async function submitInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("website")) {
    return { status: "success", message: "Thank you — your inquiry has been received." };
  }

  const values = readInquiry(formData);
  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please correct the highlighted fields.", errors, values };
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const payload = { ...values, source: "website", submittedAt: new Date().toISOString() };

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    } catch (error) {
      console.error("[inquiry] Delivery failed:", error);
      return { status: "error", message: fallbackMessage, values };
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[inquiry] INQUIRY_WEBHOOK_URL is not configured — inquiry was not delivered.");
    return { status: "error", message: fallbackMessage, values };
  } else {
    console.info("[inquiry] Development mode — inquiry received (not delivered):", payload);
  }

  return {
    status: "success",
    message: "Thank you — your inquiry has been received. Our team will review the details and get back to you.",
  };
}
