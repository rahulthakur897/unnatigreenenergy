"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, Search, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/billing/ui/button";
import { Input } from "@/components/billing/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/billing/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/billing/ui/table";
import { cn } from "@/lib/ui-utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "right" | "center";
    className?: string;
  }
}

export function SortableHeader<T>({ column, title, align }: { column: Column<T>; title: string; align?: "left" | "right" }) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted hover:text-foreground",
        align === "right" && "ml-auto flex-row-reverse",
      )}
    >
      {title}
      {sorted === "asc" ? <ArrowUp className="size-3.5" /> : sorted === "desc" ? <ArrowDown className="size-3.5" /> : <ChevronsUpDown className="size-3.5 opacity-40" />}
    </button>
  );
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search…",
  toolbar,
  empty,
  initialSorting = [],
  pageSize = 10,
  onRowClick,
  hiddenColumns,
}: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  searchPlaceholder?: string;
  /** Extra filter controls rendered beside the search box. */
  toolbar?: ReactNode;
  empty?: ReactNode;
  initialSorting?: SortingState;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  hiddenColumns?: string[];
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility] = useState<VisibilityState>(() => Object.fromEntries((hiddenColumns ?? []).map((c) => [c, false])));

  // TanStack Table returns non-memoisable functions by design; the React Compiler lint rule
  // flags that, but this component re-renders from its own state so it is safe here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    autoResetPageIndex: true,
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: size } = table.getState().pagination;
  const from = filteredCount === 0 ? 0 : pageIndex * size + 1;
  const to = Math.min(filteredCount, (pageIndex + 1) * size);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-white pl-9 pr-8"
            aria-label="Search table"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter("")}
              className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-card">
        <Table>
          <TableHeader className="bg-slate-50/80">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-10 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500",
                      header.column.columnDef.meta?.align === "right" && "text-right",
                      header.column.columnDef.meta?.align === "center" && "text-center",
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3",
                        cell.column.columnDef.meta?.align === "right" && "text-right tabular",
                        cell.column.columnDef.meta?.align === "center" && "text-center",
                        cell.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  {empty && data.length === 0 ? (
                    <div className="p-4">{empty}</div>
                  ) : (
                    <div className="py-14 text-center text-sm text-muted-foreground">No matching records. Try a different search or filter.</div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>
            Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{" "}
            <span className="font-medium text-foreground">{filteredCount}</span>
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Rows</span>
              <Select value={String(size)} onValueChange={(v) => table.setPageSize(Number(v))}>
                <SelectTrigger size="sm" className="w-[70px] bg-white" aria-label="Rows per page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span>
              Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon-sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="First page">
                <ChevronsLeft />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Last page"
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact select used in table toolbars. */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  allLabel = "All",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  allLabel?: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full bg-white sm:w-[170px]", className)} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
