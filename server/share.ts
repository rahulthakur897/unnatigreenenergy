import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** Absolute URL on this app (APP_URL), for links that leave the browser, e.g. shared invoices. */
function appUrl(path = ""): string {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) throw new Error("AUTH_SECRET must be set (at least 16 characters) to create share links.");
  return value;
}

/** Stateless signed token for sharing one invoice's PDF without signing in. */
export function invoiceShareToken(invoiceId: string): string {
  return createHmac("sha256", secret()).update(`invoice-share:${invoiceId}`).digest("base64url").slice(0, 32);
}

export function verifyInvoiceShareToken(invoiceId: string, token: string | null): boolean {
  if (!token) return false;
  const expected = Buffer.from(invoiceShareToken(invoiceId));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function invoiceShareUrl(invoiceId: string): string {
  return appUrl(`/api/share/invoices/${invoiceId}/?t=${invoiceShareToken(invoiceId)}`);
}
