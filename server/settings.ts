import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/server/db";
import { companySettings } from "@/server/db/schema";

/** The single company-settings row (created by `npm run db:seed`). */
export const getCompanySettings = cache(async () => {
  const [row] = await db.select().from(companySettings).where(eq(companySettings.id, 1)).limit(1);
  if (!row) throw new Error("Company settings are missing. Run `npm run db:seed` to initialise the database.");
  return row;
});
