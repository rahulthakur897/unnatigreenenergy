"use client";

import { FilePlus2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/billing/ui/button";
import type { Customer } from "@/server/db/schema";
import { CustomerFormDialog } from "./customer-form-dialog";

export function CustomerProfileActions({ customer }: { customer: Customer }) {
  return (
    <>
      <CustomerFormDialog
        customer={customer}
        trigger={
          <Button variant="outline">
            <Pencil /> Edit
          </Button>
        }
      />
      <Button asChild>
        <Link href={`/dashboard/invoices/new?customer=${customer.id}`}>
          <FilePlus2 /> New invoice
        </Link>
      </Button>
    </>
  );
}
