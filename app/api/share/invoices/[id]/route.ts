import { eq } from "drizzle-orm";
import { invoicePdfResponse } from "@/features/invoices/pdf-response";
import { db } from "@/server/db";
import { invoices } from "@/server/db/schema";
import { verifyInvoiceShareToken } from "@/server/share";

/** Public, token-protected PDF link for sharing a generated invoice with a customer. */
export async function GET(request: Request, ctx: RouteContext<"/api/share/invoices/[id]">) {
  const { id } = await ctx.params;
  const token = new URL(request.url).searchParams.get("t");
  if (!verifyInvoiceShareToken(id, token)) return Response.json({ error: "This link is invalid." }, { status: 404 });

  const [invoice] = await db.select({ status: invoices.status }).from(invoices).where(eq(invoices.id, id)).limit(1);
  if (!invoice || invoice.status === "draft") return Response.json({ error: "Invoice not available." }, { status: 404 });

  const response = await invoicePdfResponse(id, { download: false });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
