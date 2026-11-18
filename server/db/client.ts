import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * libSQL works with a local SQLite file (default) or a remote Turso database:
 *   DATABASE_URL=file:./data/billing.db
 *   DATABASE_URL=libsql://<db>.turso.io  DATABASE_AUTH_TOKEN=...
 */
export function createDb(url = process.env.DATABASE_URL ?? "file:./data/billing.db") {
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
  return { client, db: drizzle(client, { schema }) };
}

export type Database = ReturnType<typeof createDb>["db"];
export type { Client };
