"use client";

import { FilePlus2, PackagePlus, Target, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/billing/ui/button";
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";
import { LeadFormDialog } from "@/features/leads/components/lead-form-dialog";
import { ProductFormDialog } from "@/features/products/components/product-dialogs";

export function QuickActions({ categories, defaultGstRate }: { categories: { id: string; name: string; productCount: number }[]; defaultGstRate: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild>
        <Link href="/dashboard/invoices/new">
          <FilePlus2 /> Create invoice
        </Link>
      </Button>
      <CustomerFormDialog
        onSaved={(c) => router.push(`/dashboard/customers/${c.id}`)}
        trigger={
          <Button variant="outline">
            <UserPlus /> Add customer
          </Button>
        }
      />
      <LeadFormDialog
        trigger={
          <Button variant="outline">
            <Target /> Add lead
          </Button>
        }
      />
      <ProductFormDialog
        categories={categories}
        defaultGstRate={defaultGstRate}
        trigger={
          <Button variant="outline">
            <PackagePlus /> Add product
          </Button>
        }
      />
    </div>
  );
}
