"use client";

/* eslint-disable @next/next/no-img-element -- previews of local blobs / authenticated files */
import { ImageUp, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/billing/ui/button";
import { cn } from "@/lib/ui-utils";

export type ImageChange = { file: File | null; remove: boolean };

/** Image picker with preview. Reports the chosen file (or a removal) to the parent form. */
export function ImageUpload({
  label,
  hint,
  currentUrl,
  fallbackUrl,
  accept = "image/png,image/jpeg",
  maxBytes = 2 * 1024 * 1024,
  onChange,
  previewClassName,
}: {
  label: string;
  hint?: string;
  currentUrl: string | null;
  fallbackUrl?: string;
  accept?: string;
  maxBytes?: number;
  onChange: (change: ImageChange) => void;
  previewClassName?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  // undefined = unchanged (show the saved image), null = removed, string = newly picked file.
  const [override, setPreview] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const preview = override === undefined ? currentUrl : override;

  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn("grid h-20 w-44 place-items-center overflow-hidden rounded-lg border bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-[length:16px_16px] p-2", previewClassName)}>
          {preview || fallbackUrl ? (
            <img src={preview ?? fallbackUrl} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <ImageUp className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}>
              <ImageUp /> {preview ? "Replace" : "Upload"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPreview(null);
                  if (input.current) input.current.value = "";
                  onChange({ file: null, remove: true });
                }}
              >
                <Trash2 /> Remove
              </Button>
            )}
          </div>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > maxBytes) {
            setError(`Image must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller.`);
            return;
          }
          setError(null);
          setPreview(URL.createObjectURL(file));
          onChange({ file, remove: false });
        }}
      />
    </div>
  );
}
