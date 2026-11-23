import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/billing/common";
import { Button } from "@/components/billing/ui/button";

export default function DashboardNotFound() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Not found"
      description="This record doesn't exist or has been deleted."
      className="mt-10"
      action={
        <Button asChild>
          <Link href="/dashboard">Back to overview</Link>
        </Button>
      }
    />
  );
}
