"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Renders children directly under <body>, hidden on screen and shown alone when printing.
 * Keeps printed invoices free of the dashboard chrome and of on-screen scaling.
 */
export function PrintPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return createPortal(<div className="print-portal">{children}</div>, document.body);
}
