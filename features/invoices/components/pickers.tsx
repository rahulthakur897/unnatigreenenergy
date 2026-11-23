"use client";

import { Check, ChevronsUpDown, PackageSearch, UserRoundSearch } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/billing/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/billing/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/billing/ui/popover";
import { isServiceCode } from "@/lib/billing/constants";
import { formatINR, formatQty } from "@/lib/billing/money";
import { cn } from "@/lib/ui-utils";

export type PickerCustomer = {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  email: string;
  gstin: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  stateCode: string;
};

export type PickerProduct = {
  id: string;
  name: string;
  description: string;
  hsnCode: string;
  unit: string;
  availableQty: string;
  sellingPrice: number;
  gstRate: string;
};

export function CustomerPicker({
  customers,
  value,
  onSelect,
  footer,
}: {
  customers: PickerCustomer[];
  value: string;
  onSelect: (customer: PickerCustomer) => void;
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const selected = customers.find((c) => c.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-10 w-full justify-between font-normal">
          <span className="flex min-w-0 items-center gap-2">
            <UserRoundSearch className="text-muted-foreground" />
            <span className={cn("truncate", !selected && "text-muted-foreground")}>{selected ? selected.name : "Select an existing customer…"}</span>
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-[320px] p-0" align="start">
        <Command filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
          <CommandInput placeholder="Search by name, GSTIN or phone…" />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.name} ${c.gstin} ${c.mobile} ${c.id}`}
                  onSelect={() => {
                    onSelect(c);
                    setOpen(false);
                  }}
                  className="items-start"
                >
                  <Check className={cn("mt-0.5", value === c.id ? "opacity-100" : "opacity-0")} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{[c.gstin, c.state, c.mobile].filter(Boolean).join(" · ") || "No GSTIN"}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {footer && <div className="border-t p-1">{footer}</div>}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ProductPicker({
  products,
  onSelect,
  trigger,
}: {
  products: PickerProduct[];
  onSelect: (product: PickerProduct) => void;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm" className="h-8">
            <PackageSearch /> Pick product
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <Command filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
          <CommandInput placeholder="Search products or HSN…" />
          <CommandList>
            <CommandEmpty>No product found. Type the item manually instead.</CommandEmpty>
            <CommandGroup heading="Products & services">
              {products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.hsnCode} ${p.id}`}
                  onSelect={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                  className="items-start"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      HSN {p.hsnCode || "—"} · GST {p.gstRate}% · {isServiceCode(p.hsnCode) ? "Service" : `Stock ${formatQty(p.availableQty)} ${p.unit}`}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-xs font-medium">{formatINR(p.sellingPrice)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
