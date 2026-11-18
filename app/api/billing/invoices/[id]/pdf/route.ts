import { invoicePdfResponse } from "@/features/invoices/pdf-response";
import { getCurrentUser } from "@/server/auth/dal";

export async function GET(request: Request, ctx: RouteContext<"/api/billing/invoices/[id]/pdf">) {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await ctx.params;
  const download = new URL(request.url).searchParams.get("download") !== "0";
  return invoicePdfResponse(id, { download });
}
