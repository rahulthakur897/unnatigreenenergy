"use client";

import { Check, Copy, Link2, Mail, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/billing/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/billing/ui/dialog";
import { Input } from "@/components/billing/ui/input";
import { Spinner } from "@/components/billing/ui/spinner";
import { getShareLinkAction } from "../actions";

type ShareProps = {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: string;
  companyName: string;
};

export function ShareInvoiceDialog({ open, onOpenChange, ...props }: ShareProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share invoice {props.invoiceNumber}</DialogTitle>
          <DialogDescription>Anyone with the link can view and download this invoice&rsquo;s PDF. They can&rsquo;t see anything else.</DialogDescription>
        </DialogHeader>
        {/* Mounted only while the dialog is open, so the link is fetched each time it opens. */}
        <ShareBody {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ShareBody({ invoiceId, invoiceNumber, customerName, customerEmail, customerPhone, total, companyName }: ShareProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const loading = url === null;

  useEffect(() => {
    let alive = true;
    getShareLinkAction(invoiceId).then((result) => {
      if (!alive) return;
      if (result.ok) setUrl(result.data.url);
      else toast.error(result.error);
    });
    return () => {
      alive = false;
    };
  }, [invoiceId]);

  const message = (link: string) =>
    `Dear ${customerName},\n\nPlease find tax invoice ${invoiceNumber} for ${total} from ${companyName}:\n${link}\n\nThank you for your business.`;

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  function whatsapp() {
    if (!url) return;
    const phone = customerPhone.replace(/\D/g, "");
    const target = phone.length === 10 ? `91${phone}` : phone;
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(message(url))}`, "_blank", "noopener");
  }

  function email() {
    if (!url) return;
    const subject = encodeURIComponent(`Tax Invoice ${invoiceNumber} — ${companyName}`);
    window.open(`mailto:${encodeURIComponent(customerEmail)}?subject=${subject}&body=${encodeURIComponent(message(url))}`, "_self");
  }

  async function nativeShare() {
    try {
      const res = await fetch(`/api/billing/invoices/${invoiceId}/pdf/?download=0`);
      const file = new File([await res.blob()], `Tax-Invoice-${invoiceNumber.replace(/\//g, "-")}.pdf`, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Tax Invoice ${invoiceNumber}`, text: `Invoice ${invoiceNumber} — ${total}` });
      } else if (url) {
        await navigator.share({ title: `Tax Invoice ${invoiceNumber}`, text: message(url) });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") toast.error("Sharing isn't available in this browser.");
    }
  }

  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input readOnly value={url ?? "Creating link…"} className="pl-9 text-xs" aria-label="Share link" onFocus={(e) => e.target.select()} />
        </div>
        <Button onClick={copy} disabled={loading} variant="secondary">
          {loading ? <Spinner /> : copied ? <Check /> : <Copy />} Copy
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="outline" onClick={whatsapp} disabled={loading}>
          <MessageCircle className="text-emerald-600" /> WhatsApp
        </Button>
        <Button variant="outline" onClick={email} disabled={loading}>
          <Mail className="text-sky-600" /> Email
        </Button>
        {canNativeShare && (
          <Button variant="outline" onClick={nativeShare} className="sm:col-span-2">
            <Share2 /> Share PDF via device…
          </Button>
        )}
      </div>
    </>
  );
}
