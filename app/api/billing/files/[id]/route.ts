import { getCurrentUser } from "@/server/auth/dal";
import { getFile } from "@/server/files";

export async function GET(request: Request, ctx: RouteContext<"/api/billing/files/[id]">) {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await ctx.params;
  const file = await getFile(id);
  if (!file) return Response.json({ error: "File not found" }, { status: 404 });

  const download = new URL(request.url).searchParams.has("download");
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(file.fileName)}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
