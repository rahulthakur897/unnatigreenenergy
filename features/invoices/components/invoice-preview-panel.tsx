"use client";

import { useEffect } from "react";
import type { InvoiceDocument } from "../document";
import { InvoiceFrame } from "./invoice-frame";
import { InvoiceSheet } from "./invoice-sheet";
import { PrintPortal } from "./print-portal";

/** Scaled on-screen invoice plus a full-size copy for printing. */
export function InvoicePreviewPanel({
  doc,
  logoUrl,
  signatureUrl,
  autoPrint = false,
}: {
  doc: InvoiceDocument;
  logoUrl: string | null;
  signatureUrl: string | null;
  autoPrint?: boolean;
}) {
  useEffect(() => {
    if (!autoPrint) return;
    // Give the logo a moment to load, then open the print dialog.
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, [autoPrint]);

  return (
    <>
      <div className="rounded-xl border bg-slate-100 p-3 sm:p-5">
        <InvoiceFrame>
          <InvoiceSheet doc={doc} logoUrl={logoUrl} signatureUrl={signatureUrl} />
        </InvoiceFrame>
      </div>
      <PrintPortal>
        <InvoiceSheet doc={doc} logoUrl={logoUrl} signatureUrl={signatureUrl} />
      </PrintPortal>
    </>
  );
}
