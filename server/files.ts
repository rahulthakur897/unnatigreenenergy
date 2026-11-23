import "server-only";
import { eq } from "drizzle-orm";
import { AppError } from "@/server/action-result";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
/** Images that are embedded in PDFs (the PDF renderer supports PNG and JPEG only). */
const PDF_IMAGE_TYPES = ["image/png", "image/jpeg"];

/** Authenticated URL for a stored file. */
export function fileUrl(id: string | null | undefined): string | null {
  return id ? `/api/billing/files/${id}/` : null;
}

export async function saveUpload(
  file: File,
  opts: { kind: "image" | "pdf-image"; maxBytes: number; userId?: string },
): Promise<string> {
  const allowed = opts.kind === "image" ? IMAGE_TYPES : PDF_IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    throw new AppError(opts.kind === "image" ? "Upload a PNG, JPG or WebP image." : "Upload a PNG or JPG image.");
  }
  if (file.size > opts.maxBytes) {
    throw new AppError(`File is too large (max ${Math.round(opts.maxBytes / 1024 / 1024)} MB).`);
  }
  const data = Buffer.from(await file.arrayBuffer());
  const [row] = await db
    .insert(files)
    .values({ fileName: file.name.slice(0, 200), mimeType: file.type, size: file.size, data, uploadedBy: opts.userId ?? null })
    .returning({ id: files.id });
  return row.id;
}

export async function getFile(id: string) {
  const [row] = await db.select().from(files).where(eq(files.id, id)).limit(1);
  return row ?? null;
}

export async function deleteFile(id: string | null | undefined) {
  if (id) await db.delete(files).where(eq(files.id, id));
}
