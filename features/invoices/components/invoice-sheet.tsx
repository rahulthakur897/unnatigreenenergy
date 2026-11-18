/* eslint-disable @next/next/no-img-element -- the sheet is printed and must use plain <img> */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { formatINR } from "@/lib/billing/money";
import { cn } from "@/lib/ui-utils";
import {
  DEFAULT_LOGO_PATH,
  INVOICE_THEME as T,
  itemCellText,
  partyLines,
  printModel,
  splitDescription,
  type InvoiceDocument,
  type InvoiceParty,
  type LabeledValue,
} from "../document";

const RADIUS = "1.6mm";

/**
 * A4 tax invoice / bill of supply rendered in HTML — used for previews, the invoice page and printing.
 * The downloadable PDF (server/pdf/invoice-pdf.tsx) draws the same layout from the same print model.
 */
export function InvoiceSheet({
  doc,
  logoUrl,
  signatureUrl,
  className,
  style,
}: {
  doc: InvoiceDocument;
  logoUrl?: string | null;
  signatureUrl?: string | null;
  className?: string;
  style?: CSSProperties;
}) {
  const m = printModel(doc);
  const watermark = doc.status === "draft" ? "DRAFT" : doc.status === "cancelled" ? "CANCELLED" : null;

  return (
    <div
      className={cn("invoice-sheet relative isolate flex flex-col overflow-hidden bg-white font-invoice antialiased", className)}
      style={{
        width: "210mm",
        minHeight: "297mm",
        color: T.text,
        fontSize: "9pt",
        lineHeight: 1.38,
        fontVariantLigatures: "none",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        ...style,
      }}
    >
      {watermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid place-items-center select-none"
          style={{ color: watermark === "DRAFT" ? "rgba(100,116,139,0.09)" : "rgba(220,38,38,0.11)" }}
        >
          <span className="rotate-[-32deg] font-bold tracking-[0.2em]" style={{ fontSize: "96pt" }}>
            {watermark}
          </span>
        </div>
      )}

      {/* Accent band */}
      <div aria-hidden="true" style={{ height: "3mm", background: T.accent }} />
      <div aria-hidden="true" style={{ height: "0.8mm", background: T.gold }} />

      <div className="flex flex-1 flex-col" style={{ padding: "9mm 14mm 9mm" }}>
        {/* Header: seller left, document title right */}
        <header className="flex items-start justify-between" style={{ gap: "8mm" }}>
          <div className="min-w-0">
            <img src={logoUrl || DEFAULT_LOGO_PATH} alt={doc.seller.name} style={{ height: "16mm", width: "auto", objectFit: "contain" }} />
            <p className="font-bold" style={{ marginTop: "3.5mm", fontSize: "10.5pt", color: T.ink }}>
              {doc.seller.name}
            </p>
            {m.sellerLines.map((line, i) => (
              <p key={i} className="whitespace-pre-line" style={{ fontSize: "8.4pt", color: T.muted, marginTop: i === 0 ? "0.4mm" : 0 }}>
                {line}
              </p>
            ))}
          </div>
          <div className="shrink-0 text-right">
            <h1 className="font-bold" style={{ color: T.accent, fontSize: "21pt", letterSpacing: "0.12em", lineHeight: 1.1 }}>
              {m.words.title}
            </h1>
            <Label style={{ marginTop: "4mm", color: T.muted }}>{m.words.numberLabel.replace(".", "")}</Label>
            <p className="tabular font-bold" style={{ fontSize: "13pt", color: T.ink, lineHeight: 1.2 }}>
              {doc.invoiceNumber}
            </p>
            {doc.numberIsProvisional && <p style={{ fontSize: "7.4pt", color: T.muted }}>Provisional — assigned when generated</p>}
          </div>
        </header>

        {/* Dates, state, place of supply (+ transport when given) */}
        <MetaStrip cells={m.meta} style={{ marginTop: "6mm" }} />
        {m.transport.length > 0 && <MetaStrip cells={m.transport} subtle style={{ marginTop: "1.6mm" }} />}

        {/* Parties */}
        <section className="grid grid-cols-2" style={{ gap: "5mm", marginTop: "5mm" }}>
          <PartyCard title="Billed To" party={doc.billTo} />
          <PartyCard title="Shipped To" party={doc.shipTo} />
        </section>

        {/* Items */}
        <table className="w-full" style={{ marginTop: "6mm", borderCollapse: "separate", borderSpacing: 0, tableLayout: "fixed", fontSize: "8.8pt" }}>
          <colgroup>
            {m.columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {m.columns.map((c, i) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap font-bold"
                  style={{
                    textAlign: c.align,
                    background: T.accent,
                    color: "#fff",
                    padding: "2.3mm 2mm",
                    fontSize: "7.3pt",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderTopLeftRadius: i === 0 ? RADIUS : 0,
                    borderBottomLeftRadius: i === 0 ? RADIUS : 0,
                    borderTopRightRadius: i === m.columns.length - 1 ? RADIUS : 0,
                    borderBottomRightRadius: i === m.columns.length - 1 ? RADIUS : 0,
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, r) => (
              <tr key={r} style={{ background: r % 2 ? T.zebra : "#fff", breakInside: "avoid" }}>
                {m.columns.map((c) => (
                  <td
                    key={c.key}
                    className="tabular align-top"
                    style={{ textAlign: c.align, padding: "2.2mm 2mm", borderBottom: `0.6pt solid ${T.line}`, color: c.key === "amount" ? T.ink : undefined }}
                  >
                    {c.key === "description" ? <Description text={item.description} /> : itemCellText(c.key, item, r, m.singleUnit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in words + bank | totals */}
        <section className="grid" style={{ gridTemplateColumns: "1fr 72mm", columnGap: "8mm", marginTop: "5mm", breakInside: "avoid" }}>
          <div className="min-w-0">
            <Label>Amount in words</Label>
            <p className="italic" style={{ marginTop: "1mm", fontSize: "9pt", color: T.ink }}>
              {m.amountWords}
            </p>
            {m.bank.length > 0 && (
              <div style={{ marginTop: "5mm", border: `0.6pt solid ${T.line}`, borderRadius: RADIUS, padding: "3mm 3.5mm" }}>
                <Label>Bank details</Label>
                <dl className="grid" style={{ gridTemplateColumns: "20mm 1fr", rowGap: "0.9mm", marginTop: "1.6mm", fontSize: "8.6pt" }}>
                  {m.bank.map((b) => (
                    <Fragment key={b.label}>
                      <dt style={{ color: T.muted }}>{b.label}</dt>
                      <dd className="min-w-0 wrap-break-word font-bold" style={{ color: T.ink }}>
                        {b.value}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            )}
          </div>
          <div>
            <dl style={{ fontSize: "8.9pt" }}>
              {m.totalRows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between"
                  style={{ padding: "1.1mm 1mm", borderTop: i === 0 ? undefined : `0.6pt solid ${T.line}`, color: i === 0 ? T.ink : T.text }}
                >
                  <dt className={cn(i === 0 && "font-bold")}>{row.label}</dt>
                  <dd className={cn("tabular", i === 0 && "font-bold")}>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center justify-between" style={{ marginTop: "2.5mm", background: T.accent, color: "#fff", borderRadius: RADIUS, padding: "3.2mm 4mm" }}>
              <span className="font-bold" style={{ fontSize: "7.6pt", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Total Payable
              </span>
              <span className="tabular font-bold" style={{ fontSize: "13.5pt" }}>
                {formatINR(doc.totals.total)}
              </span>
            </div>
          </div>
        </section>

        {/* Terms | signatory */}
        <section className="grid" style={{ gridTemplateColumns: "1fr 62mm", columnGap: "8mm", marginTop: "8mm", breakInside: "avoid" }}>
          <div className="min-w-0">
            {doc.terms.length > 0 && (
              <>
                <Label>Terms &amp; Conditions</Label>
                <ol style={{ marginTop: "1.3mm", fontSize: "7.9pt", color: T.muted }}>
                  {doc.terms.map((term, i) => (
                    <li key={i} className="flex" style={{ gap: "1.6mm", marginTop: i ? "0.5mm" : 0 }}>
                      <span className="tabular shrink-0">{i + 1}.</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {doc.notes && (
              <p className="whitespace-pre-line" style={{ marginTop: "3mm", fontSize: "8.2pt", color: T.muted }}>
                <span className="font-bold" style={{ color: T.ink }}>
                  Note:{" "}
                </span>
                {doc.notes}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="font-bold" style={{ fontSize: "8.4pt", color: T.ink }}>
              For {doc.seller.name}
            </p>
            <div className="grid w-full place-items-center" style={{ height: "17mm" }}>
              {signatureUrl && <img src={signatureUrl} alt="Signature" style={{ maxHeight: "15mm", maxWidth: "45mm", objectFit: "contain" }} />}
            </div>
            <div className="w-full" style={{ borderTop: `0.6pt solid ${T.lineStrong}`, paddingTop: "1.5mm" }}>
              {doc.seller.signatoryName && <p style={{ fontSize: "8.6pt", color: T.ink }}>{doc.seller.signatoryName}</p>}
              <p className="font-bold" style={{ fontSize: "7.6pt", color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {doc.seller.signatoryDesignation || "Authorized Signatory"}
              </p>
            </div>
          </div>
        </section>

        {doc.seller.footer && (
          <footer className="text-center" style={{ marginTop: "auto", paddingTop: "8mm" }}>
            <p style={{ borderTop: `0.6pt solid ${T.line}`, paddingTop: "2.5mm", fontSize: "7.6pt", color: T.muted }}>{doc.seller.footer}</p>
          </footer>
        )}
      </div>
    </div>
  );
}

function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="font-bold" style={{ fontSize: "6.9pt", letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, ...style }}>
      {children}
    </p>
  );
}

function MetaStrip({ cells, subtle, style }: { cells: LabeledValue[]; subtle?: boolean; style?: CSSProperties }) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
        background: subtle ? "#fff" : T.soft,
        border: `0.6pt solid ${subtle ? T.line : T.softLine}`,
        borderRadius: RADIUS,
        padding: "2.4mm 0",
        ...style,
      }}
    >
      {cells.map((cell, i) => (
        <div key={cell.label} className="min-w-0" style={{ padding: "0 4mm", borderLeft: i ? `0.6pt solid ${subtle ? T.line : T.softLine}` : undefined }}>
          <p className="font-bold" style={{ fontSize: "6.6pt", letterSpacing: "0.09em", textTransform: "uppercase", color: T.muted }}>
            {cell.label}
          </p>
          <p className="tabular wrap-break-word font-bold" style={{ fontSize: "9pt", color: T.ink, marginTop: "0.3mm" }}>
            {cell.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function PartyCard({ title, party }: { title: string; party: InvoiceParty }) {
  return (
    <div className="min-w-0 overflow-hidden" style={{ border: `0.6pt solid ${T.line}`, borderRadius: RADIUS }}>
      <div style={{ background: T.soft, borderBottom: `0.6pt solid ${T.softLine}`, padding: "1.5mm 3.5mm" }}>
        <Label>{title}</Label>
      </div>
      <div style={{ padding: "2.6mm 3.5mm 3mm", fontSize: "8.5pt" }}>
        <p className="font-bold" style={{ fontSize: "10pt", color: T.ink }}>
          {party.name}
        </p>
        {party.address && (
          <p className="whitespace-pre-line" style={{ marginTop: "0.4mm" }}>
            {party.address}
          </p>
        )}
        <dl className="grid" style={{ gridTemplateColumns: "auto 1fr", columnGap: "2mm", rowGap: "0.2mm", marginTop: "1.2mm" }}>
          {partyLines(party).map((line) => (
            <Fragment key={line.label}>
              <dt style={{ color: T.muted }}>{line.label}</dt>
              <dd className="min-w-0 wrap-break-word" style={{ color: T.ink }}>
                {line.value}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Description({ text }: { text: string }) {
  const { title, details } = splitDescription(text);
  return (
    <span className="block wrap-break-word">
      <span className="block font-bold" style={{ color: T.ink }}>
        {title}
      </span>
      {details && (
        <span className="block whitespace-pre-line" style={{ fontSize: "8pt", color: T.muted, marginTop: "0.3mm" }}>
          {details}
        </span>
      )}
    </span>
  );
}
