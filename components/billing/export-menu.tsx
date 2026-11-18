"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/billing/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/billing/ui/dropdown-menu";

export type ExportEntity = "leads" | "customers" | "invoices" | "products";

/** Download buttons for the CSV / Excel export API. */
export function ExportMenu({ entity, label = "Export" }: { entity: ExportEntity; label?: string }) {
  const href = (format: "csv" | "xlsx") => `/api/billing/export/${entity}/?format=${format}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={href("xlsx")}>
            <FileSpreadsheet className="text-emerald-600" /> Excel (.xlsx)
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={href("csv")}>
            <FileText /> CSV
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
