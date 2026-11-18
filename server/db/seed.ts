/**
 * Base seed: admin user, company profile (from the UNNATI GREEN ENERGY tax invoice),
 * bank details, default terms, product categories, the example product and the invoice sequence.
 * Idempotent — existing rows are left untouched.
 *
 *   npm run db:seed
 */
import { eq } from "drizzle-orm";
import { hashPassword } from "../auth/password";
import { createDb } from "./client";
import { companySettings, invoiceSequences, productCategories, products, users } from "./schema";

const DEFAULT_TERMS = [
  "PAYMENT TERMS:- 100% ADVANCE",
  "TRANSPORTATION CHARGES :- PAY BY BUYER",
  "LOADING/UNLOADING :- LOADING IN SELLER SCOPE/UNLOADING IN BUYER SCOPE",
].join("\n");

async function main() {
  const { db, client } = createDb();

  // Admin user
  const email = (process.env.ADMIN_EMAIL ?? "admin@unnatigreenenergy.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({
      name: process.env.ADMIN_NAME ?? "Administrator",
      email,
      passwordHash: await hashPassword(password),
      role: "admin",
    });
    console.log(`✓ Admin user created: ${email}`);
  } else {
    console.log(`• Admin user exists: ${email}`);
  }

  // Company profile & invoice settings
  const settings = await db.select({ id: companySettings.id }).from(companySettings).limit(1);
  if (settings.length === 0) {
    await db.insert(companySettings).values({
      id: 1,
      name: "UNNATI GREEN ENERGY",
      address:
        "Ground Floor, House No 88, Javli Road, Near Loni Sub Post Office, Narayan Pur Safuddinpur, Loni, Ghaziabad, Uttar Pradesh - 201102",
      gstin: "09OBXPS3673B1ZP",
      pan: "OBXPS3673B",
      phone: "+91 7905554569",
      state: "Uttar Pradesh",
      stateCode: "09",
      bankName: "Yes Bank",
      bankAccountName: "UNNATI GREEN ENERGY",
      bankAccountNumber: "1454632 00000940",
      bankIfsc: "YESB0001454",
      bankBranch: "Element One, Sector 49, Gurgaon, Haryana 122018",
      invoicePrefix: "UGE",
      autoNumbering: true,
      numberPadding: 3,
      defaultGstRate: "18",
      defaultDueDays: 0,
      defaultTerms: DEFAULT_TERMS,
      defaultFooter: "This is a computer-generated invoice.",
      roundOffTotal: true,
      signatoryName: "",
      signatoryDesignation: "Authorized Signatory",
    });
    console.log("✓ Company profile created");
  } else {
    console.log("• Company profile exists");
  }

  // Invoice sequence — the last issued invoice was UGE/2026-27/020, so the next one is 021.
  const seqId = "UGE|2026-27";
  const seq = await db.select().from(invoiceSequences).where(eq(invoiceSequences.id, seqId)).limit(1);
  if (seq.length === 0) {
    const lastNumber = Number(process.env.SEED_LAST_INVOICE_NUMBER ?? 20);
    await db.insert(invoiceSequences).values({ id: seqId, prefix: "UGE", financialYear: "2026-27", lastNumber });
    console.log(`✓ Invoice sequence UGE/2026-27 starts after ${String(lastNumber).padStart(3, "0")}`);
  }

  // Product categories & example product
  const categoryNames = ["Battery Modules", "Lithium-ion Cells", "Battery Packs", "Battery Scrap", "Services"];
  for (const name of categoryNames) {
    await db.insert(productCategories).values({ name }).onConflictDoNothing();
  }
  const [modules] = await db.select().from(productCategories).where(eq(productCategories.name, "Battery Modules")).limit(1);
  const example = await db.select({ id: products.id }).from(products).where(eq(products.name, "NMC Module 72V Refurbished")).limit(1);
  if (example.length === 0) {
    await db.insert(products).values({
      name: "NMC Module 72V Refurbished",
      description: "",
      hsnCode: "85076000",
      unit: "PCS",
      categoryId: modules?.id ?? null,
      availableQty: "0",
      purchasePrice: 0,
      sellingPrice: 4_600_000, // ₹46,000.00
      gstRate: "18",
      status: "active",
    });
    console.log("✓ Example product created: NMC Module 72V Refurbished");
  }

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
