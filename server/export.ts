import "server-only";
import ExcelJS from "exceljs";
import { Decimal } from "@/lib/billing/money";

export type ExportColumn = {
  key: string;
  label: string;
  type?: "text" | "money" | "number" | "date" | "percent";
  width?: number;
};
export type ExportRow = Record<string, string | number | null | undefined>;

const moneyValue = (paise: unknown) => new Decimal(Number(paise ?? 0)).div(100).toNumber();

function cellValue(value: ExportRow[string], type: ExportColumn["type"]) {
  if (value === null || value === undefined) return "";
  if (type === "money") return moneyValue(value);
  if (type === "number" || type === "percent") return Number(value);
  return String(value);
}

/** RFC 4180 CSV with a UTF-8 BOM so Excel opens ₹ and Indian names correctly. Money in rupees. */
export function toCsv(columns: ExportColumn[], rows: ExportRow[]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.map((c) => escape(c.type === "money" ? `${c.label} (INR)` : c.label)).join(",")];
  for (const row of rows) {
    lines.push(
      columns
        .map((c) => {
          const v = cellValue(row[c.key], c.type);
          return escape(c.type === "money" && v !== "" ? (v as number).toFixed(2) : v);
        })
        .join(","),
    );
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

/** Styled Excel workbook: title block, green header row, typed cells, totals row. */
export async function toXlsx(opts: {
  sheetName: string;
  title: string;
  subtitle?: string;
  company: string;
  columns: ExportColumn[];
  rows: ExportRow[];
  totals?: ExportRow;
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = opts.company;
  wb.created = new Date();
  const ws = wb.addWorksheet(opts.sheetName.slice(0, 31), { views: [{ state: "frozen", ySplit: 4 }] });

  ws.addRow([opts.company]).font = { bold: true, size: 13, color: { argb: "FF006400" } };
  ws.addRow([opts.title]).font = { bold: true, size: 12 };
  ws.addRow([opts.subtitle ?? `Generated ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`]).font = { italic: true, color: { argb: "FF4A5568" } };

  const header = ws.addRow(opts.columns.map((c) => c.label));
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF006400" } };
    cell.alignment = { vertical: "middle" };
    cell.border = { bottom: { style: "thin", color: { argb: "FFCBD5E0" } } };
  });
  header.height = 20;

  const addDataRow = (row: ExportRow, bold = false) => {
    const r = ws.addRow(opts.columns.map((c) => cellValue(row[c.key], c.type)));
    opts.columns.forEach((c, i) => {
      const cell = r.getCell(i + 1);
      if (c.type === "money") cell.numFmt = '"₹"#,##0.00';
      if (c.type === "percent") cell.numFmt = '0.0"%"';
      if (bold) cell.font = { bold: true };
    });
    return r;
  };
  opts.rows.forEach((row) => addDataRow(row));
  if (opts.totals) {
    const t = addDataRow(opts.totals, true);
    t.eachCell((cell) => (cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } }));
  }

  opts.columns.forEach((c, i) => {
    const longest = Math.max(c.label.length, ...opts.rows.slice(0, 500).map((r) => String(r[c.key] ?? "").length));
    ws.getColumn(i + 1).width = c.width ?? Math.min(48, Math.max(12, longest + 2, c.type === "money" ? 16 : 0));
  });

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export function downloadResponse(body: string | Buffer, fileName: string, contentType: string) {
  const payload = typeof body === "string" ? body : new Uint8Array(body);
  return new Response(payload, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const CSV_TYPE = "text/csv; charset=utf-8";
