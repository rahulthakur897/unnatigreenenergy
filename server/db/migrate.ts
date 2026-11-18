import { mkdirSync } from "node:fs";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createDb } from "./client";

async function main() {
  mkdirSync("data", { recursive: true });
  const { db, client } = createDb();
  await migrate(db, { migrationsFolder: "server/db/migrations" });
  client.close();
  console.log("✓ Database migrations applied");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
