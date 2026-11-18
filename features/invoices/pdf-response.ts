import "server-only";
import { invoicePdfFileName, renderInvoicePdf } from "@/server/pdf/invoice-pdf";
import { buildInvoiceDocument, getInvoiceWithItems } from "./queries";

/** Renders an invoice as a PDF HTTP response (inline view or download). */
export async function invoicePdfResponse(invoiceId: string, opts: { download: boolean }) {
  const found = await getInvoiceWithItems(invoiceId);
  if (!found) return Response.json({ error: "Invoice not found" }, { status: 404 });

  const doc = await buildInvoiceDocument(found.invoice, found.items);
  const pdf = await renderInvoicePdf(doc);
  const fileName = invoicePdfFileName(doc);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${opts.download ? "attachment" : "inline"}; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
