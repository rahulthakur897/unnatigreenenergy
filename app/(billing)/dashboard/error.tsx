"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/billing/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-8 text-center shadow-card">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-danger-soft text-danger">
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="mt-4 font-display text-lg font-semibold">Something went wrong</h1>
      <p className="mt-1 text-sm text-muted-foreground">This page couldn&rsquo;t load. Your data is safe — try again, and if it keeps happening, note the time and reference below.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
      <Button className="mt-6" onClick={reset}>
        <RotateCcw /> Try again
      </Button>
    </div>
  );
}
