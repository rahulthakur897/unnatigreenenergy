import { createDb, type Database } from "./client";

// Reuse one client across hot reloads in development.
const globalForDb = globalThis as unknown as { __ugeDb?: Database };

export const db: Database = globalForDb.__ugeDb ?? createDb().db;

if (process.env.NODE_ENV !== "production") globalForDb.__ugeDb = db;

export * as tables from "./schema";
