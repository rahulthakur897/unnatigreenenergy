/* eslint-disable jsx-a11y/alt-text -- react-pdf <Image> has no alt prop; the PDF title/author carry document metadata */
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Document, Font, Image, Page, renderToBuffer, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import {
  DEFAULT_LOGO_PATH,
  documentWording,
  INVOICE_THEME as T,
  itemCellText,
  partyLines,
  printModel,
  splitDescription,
  type InvoiceDocument,
  type InvoiceParty,
  type LabeledValue,
} from "@/features/invoices/document";
import { formatINR } from "@/lib/billing/money";
import { getFile } from "@/server/files";

/* -------------------------------------------------------------------------- */
/* Fonts: Carlito is metric-compatible with Calibri                            */
/* -------------------------------------------------------------------------- */

const fontDir = path.join(process.cwd(), "assets", "fonts", "carlito");
let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "Carlito",
    fonts: [
      { src: path.join(fontDir, "Carlito-Regular.ttf"), fontWeight: 400 },
      { src: path.join(fontDir, "Carlito-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(fontDir, "Carlito-Bold.ttf"), fontWeight: 700 },
      { src: path.join(fontDir, "Carlito-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
  // Never hyphenate words such as GSTINs or product codes.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

type ImageData = { data: Buffer; format: "png" | "jpg" };

async function loadImage(fileId: string | null, fallbackPublicPath?: string): Promise<ImageData | null> {
  if (fileId) {
    const file = await getFile(fileId);
    if (file && (file.mimeType === "image/png" || file.mimeType === "image/jpeg")) {
      return { data: Buffer.from(file.data), format: file.mimeType === "image/png" ? "png" : "jpg" };
    }
  }
  if (fallbackPublicPath) {
    const data = await readFile(path.join(process.cwd(), "public", fallbackPublicPath));
    return { data, format: fallbackPublicPath.endsWith(".png") ? "png" : "jpg" };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Styles (1mm = 2.835pt)                                                       */
/* -------------------------------------------------------------------------- */

const RADIUS = 4.5;

const s = StyleSheet.create({
  // Ligatures off so the PDF text layer copies/searches exactly ("Uttar", not "Utar").
  page: {
    fontFamily: "Carlito",
    fontFeatureSettings: { liga: false, clig: false },
    fontSize: 9,
    color: T.text,
    paddingTop: "13mm",
    paddingBottom: "17mm",
    paddingHorizontal: "14mm",
  },
  // Body line height goes on each top-level section, not on <Page>: set on the page, react-pdf drops the fixed footer and page number.
  // react-pdf turns a unitless lineHeight into points using this element's own fontSize, so both are set together.
  body: { fontSize: 9, lineHeight: 1.38 },
  band: { position: "absolute", top: 0, left: 0, right: 0 },
  row: { flexDirection: "row" },
  label: { fontSize: 6.9, fontWeight: 700, letterSpacing: 0.7, textTransform: "uppercase", color: T.accent },
  title: { color: T.accent, fontSize: 21, fontWeight: 700, letterSpacing: 2.5, lineHeight: 1.1 },
  sellerName: { marginTop: "3.5mm", fontSize: 10.5, fontWeight: 700, color: T.ink },
  sellerLine: { fontSize: 8.4, color: T.muted },
  metaCellLabel: { fontSize: 6.6, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: T.muted },
  metaCellValue: { fontSize: 9, fontWeight: 700, color: T.ink, marginTop: 1 },
  card: { borderWidth: 0.6, borderColor: T.line, borderRadius: RADIUS },
  th: { color: "#fff", fontWeight: 700, fontSize: 7.3, letterSpacing: 0.45, textTransform: "uppercase", paddingVertical: "2.3mm", paddingHorizontal: "2mm" },
  td: { fontSize: 8.8, paddingVertical: "2.2mm", paddingHorizontal: "2mm" },
  watermark: { position: "absolute", top: "40%", left: 0, right: 0, textAlign: "center", fontSize: 96, fontWeight: 700, letterSpacing: 12 },
  footer: {
    position: "absolute",
    bottom: "7mm",
    left: "14mm",
    right: "14mm",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.6,
    borderColor: T.line,
    paddingTop: "2mm",
    fontSize: 7.2,
    color: T.muted,
  },
});

/* -------------------------------------------------------------------------- */
/* Pieces                                                                      */
/* -------------------------------------------------------------------------- */

function Label({ children, style }: { children: ReactNode; style?: { marginTop?: number | string; color?: string } }) {
  return <Text style={[s.label, style ?? {}]}>{children}</Text>;
}

function MetaStrip({ cells, subtle, marginTop }: { cells: LabeledValue[]; subtle?: boolean; marginTop: string }) {
  const divider = subtle ? T.line : T.softLine;
  return (
    <View
      style={[
        s.row,
        s.body,
        { marginTop, backgroundColor: subtle ? "#fff" : T.soft, borderWidth: 0.6, borderColor: divider, borderRadius: RADIUS, paddingVertical: "2.4mm" },
      ]}
      wrap={false}
    >
      {cells.map((cell, i) => (
        <View key={cell.label} style={{ flex: 1, paddingHorizontal: "4mm", borderLeftWidth: i ? 0.6 : 0, borderColor: divider }}>
          <Text style={s.metaCellLabel}>{cell.label}</Text>
          <Text style={s.metaCellValue}>{cell.value}</Text>
        </View>
      ))}
    </View>
  );
}

function PartyCard({ title, party }: { title: string; party: InvoiceParty }) {
  return (
    <View style={[s.card, { flex: 1 }]}>
      <View style={{ backgroundColor: T.soft, borderBottomWidth: 0.6, borderColor: T.softLine, paddingVertical: "1.5mm", paddingHorizontal: "3.5mm", borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS }}>
        <Label>{title}</Label>
      </View>
      <View style={{ paddingTop: "2.6mm", paddingBottom: "3mm", paddingHorizontal: "3.5mm", fontSize: 8.5 }}>
        <Text style={{ fontSize: 10, fontWeight: 700, color: T.ink }}>{party.name}</Text>
        {party.address ? <Text style={{ marginTop: 1 }}>{party.address}</Text> : null}
        <View style={{ marginTop: "1.2mm" }}>
          {partyLines(party).map((line) => (
            <View key={line.label} style={s.row}>
              <Text style={{ color: T.muted, width: 46 }}>{line.label}</Text>
              <Text style={{ flex: 1, color: T.ink }}>{line.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Document                                                                    */
/* -------------------------------------------------------------------------- */

function InvoicePdf({ doc, logo, signature }: { doc: InvoiceDocument; logo: ImageData | null; signature: ImageData | null }) {
  const m = printModel(doc);
  const watermark = doc.status === "draft" ? "DRAFT" : doc.status === "cancelled" ? "CANCELLED" : null;
  const title = doc.numberIsProvisional ? `Draft ${m.words.name.toLowerCase()}` : `${m.words.name} ${doc.invoiceNumber}`;
  const last = m.columns.length - 1;

  return (
    <Document title={title} author={doc.seller.name} subject={`${m.words.name} for ${doc.billTo.name}`} creator="UNNATI GREEN ENERGY Billing" producer="UNNATI GREEN ENERGY Billing">
      <Page size="A4" style={s.page}>
        {/* Accent band on every page */}
        <View fixed style={s.band}>
          <View style={{ height: "3mm", backgroundColor: T.accent }} />
          <View style={{ height: "0.8mm", backgroundColor: T.gold }} />
        </View>

        {watermark ? (
          <Text fixed style={[s.watermark, { color: watermark === "DRAFT" ? "#64748B" : "#DC2626", opacity: 0.1, transform: "rotate(-32deg)" }]}>
            {watermark}
          </Text>
        ) : null}

        {/* Header */}
        <View style={[s.row, s.body, { justifyContent: "space-between", alignItems: "flex-start" }]}>
          <View style={{ flex: 1, paddingRight: "8mm" }}>
            {logo ? <Image src={logo} style={{ height: "16mm", alignSelf: "flex-start", objectFit: "contain" }} /> : null}
            <Text style={s.sellerName}>{doc.seller.name}</Text>
            {m.sellerLines.map((line, i) => (
              <Text key={i} style={[s.sellerLine, { marginTop: i === 0 ? 1 : 0 }]}>
                {line}
              </Text>
            ))}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.title}>{m.words.title}</Text>
            <Label style={{ marginTop: "4mm", color: T.muted }}>{m.words.numberLabel.replace(".", "")}</Label>
            <Text style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{doc.invoiceNumber}</Text>
            {doc.numberIsProvisional ? <Text style={{ fontSize: 7.4, color: T.muted }}>Provisional — assigned when generated</Text> : null}
          </View>
        </View>

        <MetaStrip cells={m.meta} marginTop="6mm" />
        {m.transport.length ? <MetaStrip cells={m.transport} subtle marginTop="1.6mm" /> : null}

        {/* Parties */}
        <View style={[s.row, s.body, { marginTop: "5mm", gap: "5mm" }]} wrap={false}>
          <PartyCard title="Billed To" party={doc.billTo} />
          <PartyCard title="Shipped To" party={doc.shipTo} />
        </View>

        {/* Items */}
        <View style={[s.body, { marginTop: "6mm" }]}>
          <View style={[s.row, { backgroundColor: T.accent, borderRadius: RADIUS }]} wrap={false}>
            {m.columns.map((c) => (
              <View key={c.key} style={{ width: c.width }}>
                <Text style={[s.th, { textAlign: c.align }]}>{c.label}</Text>
              </View>
            ))}
          </View>
          {doc.items.map((item, r) => (
            <View key={r} style={[s.row, { backgroundColor: r % 2 ? T.zebra : "#fff", borderBottomWidth: 0.6, borderColor: T.line }]} wrap={false}>
              {m.columns.map((c, i) => {
                if (c.key === "description") {
                  const { title: name, details } = splitDescription(item.description);
                  return (
                    <View key={c.key} style={[s.td, { width: c.width }]}>
                      <Text style={{ fontWeight: 700, color: T.ink }}>{name}</Text>
                      {details ? <Text style={{ fontSize: 8, color: T.muted, marginTop: 1 }}>{details}</Text> : null}
                    </View>
                  );
                }
                return (
                  <View key={c.key} style={[s.td, { width: c.width }]}>
                    <Text style={{ textAlign: c.align, color: i === last ? T.ink : T.text }}>{itemCellText(c.key, item, r, m.singleUnit)}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Amount in words + bank | totals */}
        <View style={[s.row, s.body, { marginTop: "5mm" }]} wrap={false}>
          <View style={{ flex: 1, paddingRight: "8mm" }}>
            <Label>Amount in words</Label>
            <Text style={{ marginTop: "1mm", fontSize: 9, fontStyle: "italic", color: T.ink }}>{m.amountWords}</Text>
            {m.bank.length ? (
              <View style={[s.card, { marginTop: "5mm", paddingVertical: "3mm", paddingHorizontal: "3.5mm" }]}>
                <Label>Bank details</Label>
                <View style={{ marginTop: "1.6mm", fontSize: 8.6 }}>
                  {m.bank.map((b) => (
                    <View key={b.label} style={[s.row, { marginBottom: 2.4 }]}>
                      <Text style={{ width: "20mm", color: T.muted }}>{b.label}</Text>
                      <Text style={{ flex: 1, fontWeight: 700, color: T.ink }}>{b.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
          <View style={{ width: "72mm" }}>
            {m.totalRows.map((row, i) => (
              <View
                key={row.label}
                style={[s.row, { justifyContent: "space-between", paddingVertical: "1.1mm", paddingHorizontal: "1mm", borderTopWidth: i ? 0.6 : 0, borderColor: T.line, fontSize: 8.9 }]}
              >
                <Text style={i === 0 ? { fontWeight: 700, color: T.ink } : {}}>{row.label}</Text>
                <Text style={i === 0 ? { fontWeight: 700, color: T.ink } : {}}>{row.value}</Text>
              </View>
            ))}
            <View
              style={[s.row, { justifyContent: "space-between", alignItems: "center", marginTop: "2.5mm", backgroundColor: T.accent, borderRadius: RADIUS, paddingVertical: "3.2mm", paddingHorizontal: "4mm" }]}
            >
              <Text style={{ color: "#fff", fontSize: 7.6, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Total Payable</Text>
              <Text style={{ color: "#fff", fontSize: 13.5, fontWeight: 700 }}>{formatINR(doc.totals.total)}</Text>
            </View>
          </View>
        </View>

        {/* Terms | signatory */}
        <View style={[s.row, s.body, { marginTop: "8mm" }]} wrap={false}>
          <View style={{ flex: 1, paddingRight: "8mm" }}>
            {doc.terms.length ? (
              <>
                <Label>Terms &amp; Conditions</Label>
                <View style={{ marginTop: "1.3mm" }}>
                  {doc.terms.map((term, i) => (
                    <View key={i} style={[s.row, { marginTop: i ? 1.4 : 0, fontSize: 7.9, color: T.muted }]}>
                      <Text style={{ width: 11 }}>{i + 1}.</Text>
                      <Text style={{ flex: 1 }}>{term}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
            {doc.notes ? (
              <Text style={{ marginTop: "3mm", fontSize: 8.2, color: T.muted }}>
                <Text style={{ fontWeight: 700, color: T.ink }}>Note: </Text>
                {doc.notes}
              </Text>
            ) : null}
          </View>
          <View style={{ width: "62mm", alignItems: "center" }}>
            <Text style={{ fontSize: 8.4, fontWeight: 700, color: T.ink, textAlign: "center" }}>For {doc.seller.name}</Text>
            <View style={{ height: "17mm", width: "100%", justifyContent: "center", alignItems: "center" }}>
              {signature ? <Image src={signature} style={{ maxHeight: "15mm", maxWidth: "45mm", objectFit: "contain" }} /> : null}
            </View>
            <View style={{ width: "100%", borderTopWidth: 0.6, borderColor: T.lineStrong, paddingTop: "1.5mm", alignItems: "center" }}>
              {doc.seller.signatoryName ? <Text style={{ fontSize: 8.6, color: T.ink }}>{doc.seller.signatoryName}</Text> : null}
              <Text style={{ fontSize: 7.6, fontWeight: 700, color: T.muted, letterSpacing: 0.6, textTransform: "uppercase" }}>
                {doc.seller.signatoryDesignation || "Authorized Signatory"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer on every page */}
        <View fixed style={s.footer}>
          <Text style={{ flex: 1, paddingRight: "6mm" }}>{doc.seller.footer || `${doc.seller.name} · ${doc.invoiceNumber}`}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/** Renders an invoice to an A4 PDF buffer. */
export async function renderInvoicePdf(doc: InvoiceDocument): Promise<Buffer> {
  registerFonts();
  const [logo, signature] = await Promise.all([loadImage(doc.seller.logoFileId, DEFAULT_LOGO_PATH), loadImage(doc.seller.signatureFileId)]);
  return renderToBuffer(<InvoicePdf doc={doc} logo={logo} signature={signature} />);
}

export function invoicePdfFileName(doc: InvoiceDocument) {
  const stem = documentWording(doc.invoiceType).fileStem;
  const base = doc.numberIsProvisional ? `Draft-${stem}-${doc.billTo.name}` : `${stem}-${doc.invoiceNumber}`;
  return `${base.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-")}.pdf`;
}
