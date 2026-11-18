/**
 * Optional demo data for exploring the app: fictional customers, leads, products,
 * invoices (with payments, a draft and a cancelled invoice).
 *
 *   npm run db:seed:demo
 *
 * Refuses to run when the database already contains invoices, so demo data can never
 * mix with real books or consume real invoice numbers. Use a separate DATABASE_URL to try it.
 */
import { eq, sql } from "drizzle-orm";
import { isServiceCode } from "../../lib/billing/constants";
import { addDaysISO, financialYearOf, todayISO } from "../../lib/billing/dates";
import { calculateInvoice, formatInvoiceNumber, taxTypeFor } from "../../lib/billing/invoice-calc";
import { Decimal } from "../../lib/billing/money";
import { stateNameFromCode } from "../../lib/billing/states";
import { createDb } from "./client";
import {
  activityLog,
  companySettings,
  customers,
  invoiceItems,
  invoices,
  invoiceSequences,
  leadActivities,
  leads,
  payments,
  productCategories,
  products,
  stockMovements,
  users,
} from "./schema";

const DEMO_CUSTOMERS = [
  { name: "Shakti E-Rickshaw Works", contactPerson: "Ravi Tyagi", mobile: "+91 98100 11001", gstin: "09AAKFS4821K1Z3", stateCode: "09", billingAddress: "Plot 14, Partapur Industrial Area, Meerut, Uttar Pradesh - 250103", customerType: "business" as const },
  { name: "Ganga Battery Traders", contactPerson: "Anil Verma", mobile: "+91 98100 11002", gstin: "09AAHFG7710C1Z9", stateCode: "09", billingAddress: "112, Naveen Market, Kanpur, Uttar Pradesh - 208001", customerType: "dealer" as const },
  { name: "Volt Mobility Solutions", contactPerson: "Neha Kapoor", mobile: "+91 98100 11003", gstin: "07AAICV5528P1Z2", stateCode: "07", billingAddress: "C-45, Okhla Phase II, New Delhi - 110020", customerType: "business" as const },
  { name: "GreenCell Recyclers Pvt Ltd", contactPerson: "Sourav Das", mobile: "+91 98100 11004", gstin: "19AAGCG3391M1Z7", stateCode: "19", billingAddress: "Unit 6, Falta SEZ Road, South 24 Parganas, West Bengal - 743504", customerType: "business" as const },
  { name: "Sunrise Inverters", contactPerson: "Mahesh Jain", mobile: "+91 98100 11005", gstin: "08AAPFS2207Q1Z1", stateCode: "08", billingAddress: "E-210, VKI Area, Jaipur, Rajasthan - 302013", customerType: "dealer" as const },
  { name: "Rohit Kumar", contactPerson: "", mobile: "+91 98100 11006", gstin: "", stateCode: "09", billingAddress: "House 22, Sector 12, Noida, Uttar Pradesh - 201301", customerType: "individual" as const },
];

const DEMO_PRODUCTS = [
  { name: "NMC Module 48V Refurbished", hsnCode: "85076000", unit: "PCS", purchase: 2_400_000, selling: 3_100_000, qty: "40" },
  { name: "LFP Cell 3.2V 100Ah (Grade B)", hsnCode: "85076000", unit: "PCS", purchase: 180_000, selling: 245_000, qty: "600" },
  { name: "Mixed Li-ion Battery Scrap", hsnCode: "85496000", unit: "KG", purchase: 9_000, selling: 13_500, qty: "4500", gst: "18" },
  { name: "18650 Cell Scrap (sorted)", hsnCode: "85496000", unit: "KG", purchase: 12_000, selling: 17_000, qty: "1200", gst: "18" },
  { name: "Battery Testing & Grading Service", hsnCode: "998713", unit: "NOS", purchase: 0, selling: 150_000, qty: "0", gst: "18" },
];

async function main() {
  const { db, client } = createDb();
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(invoices);
  if (n > 0 && !process.argv.includes("--force")) {
    console.error("✗ This database already has invoices. Demo data is only for an empty database (use a separate DATABASE_URL).");
    process.exit(1);
  }
  const [settings] = await db.select().from(companySettings).where(eq(companySettings.id, 1));
  const [admin] = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
  if (!settings || !admin) throw new Error("Run `npm run db:seed` first.");

  const today = todayISO();
  const fy = financialYearOf(today);
  const fyStart = `${fy.slice(0, 4)}-04-01`;
  const daysIntoFy = Math.max(30, Math.round((Date.parse(today) - Date.parse(fyStart)) / 86_400_000));

  // Products
  const [cells] = await db.insert(productCategories).values({ name: "Lithium-ion Cells" }).onConflictDoNothing().returning();
  const categoryId = cells?.id ?? (await db.select().from(productCategories).where(eq(productCategories.name, "Battery Scrap")))[0]?.id ?? null;
  const productRows: (typeof products.$inferSelect)[] = [];
  for (const p of DEMO_PRODUCTS) {
    const [row] = await db
      .insert(products)
      .values({ name: p.name, hsnCode: p.hsnCode, unit: p.unit, categoryId, availableQty: p.qty, purchasePrice: p.purchase, sellingPrice: p.selling, gstRate: p.gst ?? "18" })
      .returning();
    if (Number(p.qty) > 0) await db.insert(stockMovements).values({ productId: row.id, change: p.qty, reason: "opening", note: "Opening stock", createdBy: admin.id });
    productRows.push(row);
  }
  const [nmc72] = await db.select().from(products).where(eq(products.name, "NMC Module 72V Refurbished"));
  if (nmc72) {
    await db.update(products).set({ availableQty: "25", purchasePrice: 3_600_000 }).where(eq(products.id, nmc72.id));
    productRows.push({ ...nmc72, availableQty: "25", purchasePrice: 3_600_000 });
  }

  // Customers
  const customerRows: (typeof customers.$inferSelect)[] = [];
  for (const [i, c] of DEMO_CUSTOMERS.entries()) {
    const createdAt = new Date(Date.parse(fyStart) + i * 9 * 86_400_000).toISOString();
    const [row] = await db
      .insert(customers)
      .values({ ...c, email: `accounts@${c.name.toLowerCase().replace(/[^a-z]+/g, "")}.example`, state: stateNameFromCode(c.stateCode), pan: c.gstin ? c.gstin.slice(2, 12) : "", createdAt })
      .returning();
    customerRows.push(row);
  }

  // Invoices
  let seq = (await db.select().from(invoiceSequences).where(eq(invoiceSequences.id, `${settings.invoicePrefix}|${fy}`)))[0]?.lastNumber ?? 0;
  const plan = [
    { c: 0, day: 8, lines: [[5, "3"], [0, "4"]], pay: "full" },
    { c: 1, day: 20, lines: [[1, "120"]], pay: "full" },
    { c: 3, day: 35, lines: [[2, "850"], [3, "300"]], pay: "full" },
    { c: 2, day: 50, lines: [[0, "6"]], pay: "part" },
    { c: 4, day: 66, lines: [[1, "200"], [4, "1"]], pay: "full" },
    { c: 0, day: 80, lines: [[5, "2"]], pay: "full" },
    { c: 3, day: 96, lines: [[2, "1200"]], pay: "part" },
    { c: 1, day: 110, lines: [[3, "250"], [1, "60"]], pay: "none", due: 15 },
    { c: 5, day: 124, lines: [[0, "1"]], pay: "full" },
    { c: 2, day: 140, lines: [[5, "4"], [4, "2"]], pay: "none", due: 30 },
    { c: 0, day: 155, lines: [[1, "150"]], pay: "part", due: 7 },
    { c: 4, day: 170, lines: [[2, "600"]], pay: "none", due: 45, cancel: true },
    { c: 3, day: 185, lines: [[3, "400"]], pay: "none", due: 30 },
    { c: 1, day: 200, lines: [[0, "3"]], pay: "draft" },
  ] as const;

  for (const p of plan) {
    const day = Math.min(p.day, daysIntoFy - 1);
    const invoiceDate = addDaysISO(fyStart, day);
    const customer = customerRows[p.c];
    const taxType = taxTypeFor(settings.stateCode, customer.stateCode);
    const items = p.lines.map(([pi, qty], position) => {
      const prod = productRows[Math.min(pi, productRows.length - 1)];
      return { position, productId: prod.id, description: prod.name, hsnCode: prod.hsnCode, unit: prod.unit, quantity: qty, rate: prod.sellingPrice, gstRate: prod.gstRate, costPrice: prod.purchasePrice };
    });
    const totals = calculateInvoice(items, { taxType, roundOff: true });
    const draft = p.pay === "draft";
    if (!draft) seq++;
    const invoiceNumber = draft ? null : formatInvoiceNumber(settings.invoicePrefix, fy, seq, settings.numberPadding);
    const generatedAt = new Date(`${invoiceDate}T10:30:00+05:30`).toISOString();
    const [inv] = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        sequenceNumber: draft ? null : seq,
        financialYear: fy,
        status: draft ? "draft" : "generated",
        invoiceDate,
        dueDate: addDaysISO(invoiceDate, "due" in p ? p.due : 0),
        customerId: customer.id,
        billName: customer.name,
        billAddress: customer.billingAddress,
        billGstin: customer.gstin,
        billState: customer.state,
        billStateCode: customer.stateCode,
        billPhone: customer.mobile,
        billEmail: customer.email,
        placeOfSupply: customer.stateCode,
        taxType,
        vehicleNumber: draft ? "" : `UP14 ${["AB", "CD", "EF"][p.c % 3]} ${1000 + p.day}`,
        subtotal: totals.subtotal,
        taxableAmount: totals.taxableAmount,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        igstAmount: totals.igstAmount,
        roundOff: totals.roundOff,
        total: totals.total,
        terms: settings.defaultTerms,
        sellerSnapshot: draft
          ? null
          : JSON.stringify({
              name: settings.name, address: settings.address, gstin: settings.gstin, pan: settings.pan, phone: settings.phone, email: settings.email,
              state: settings.state, stateCode: settings.stateCode, logoFileId: settings.logoFileId, bankName: settings.bankName,
              bankAccountName: settings.bankAccountName, bankAccountNumber: settings.bankAccountNumber, bankIfsc: settings.bankIfsc,
              bankBranch: settings.bankBranch, upiId: settings.upiId, signatoryName: settings.signatoryName,
              signatoryDesignation: settings.signatoryDesignation, signatureFileId: settings.signatureFileId, footer: settings.defaultFooter,
            }),
        generatedAt: draft ? null : generatedAt,
        createdBy: admin.id,
        createdAt: generatedAt,
      })
      .returning();
    await db.insert(invoiceItems).values(items.map((it, i) => ({ ...it, invoiceId: inv.id, amount: totals.lines[i].amount, taxAmount: totals.lines[i].taxAmount })));
    if (draft) continue;

    for (const it of items) {
      if (isServiceCode(it.hsnCode)) continue;
      const [prod] = await db.select({ q: products.availableQty }).from(products).where(eq(products.id, it.productId));
      await db.update(products).set({ availableQty: new Decimal(prod.q).minus(it.quantity).toString() }).where(eq(products.id, it.productId));
      await db.insert(stockMovements).values({ productId: it.productId, change: `-${it.quantity}`, reason: "invoice", note: `Sold on ${invoiceNumber}`, invoiceId: inv.id, createdBy: admin.id });
    }
    await db.insert(activityLog).values({ entityType: "invoice", entityId: inv.id, action: "generated", description: `Invoice ${invoiceNumber} generated for ${customer.name}`, userId: admin.id, createdAt: generatedAt });

    if ("cancel" in p && p.cancel) {
      await db.update(invoices).set({ status: "cancelled", cancelledAt: new Date(Date.parse(generatedAt) + 86_400_000).toISOString(), cancelReason: "Wrong rate entered — re-issued", cancelledBy: admin.id }).where(eq(invoices.id, inv.id));
      continue;
    }
    if (p.pay !== "none") {
      const amount = p.pay === "full" ? totals.total : Math.round(totals.total * 0.4);
      const paymentDate = addDaysISO(invoiceDate, p.pay === "full" ? 2 : 5);
      if (paymentDate <= today) {
        await db.insert(payments).values({ invoiceId: inv.id, paymentDate, amount, mode: p.c % 2 ? "upi" : "bank_transfer", reference: `UTR${String(880000 + p.day * 37)}`, createdBy: admin.id, createdAt: new Date(`${paymentDate}T15:00:00+05:30`).toISOString() });
      }
    }
  }
  await db
    .insert(invoiceSequences)
    .values({ id: `${settings.invoicePrefix}|${fy}`, prefix: settings.invoicePrefix, financialYear: fy, lastNumber: seq })
    .onConflictDoUpdate({ target: invoiceSequences.id, set: { lastNumber: seq } });

  // Leads
  const leadPlan = [
    { leadName: "E-rickshaw fleet battery swap", companyName: "Metro Cabs Lucknow", status: "new", source: "phone", value: 1_850_000, interest: "NMC Module 48V Refurbished", qty: "40 PCS", follow: 1 },
    { leadName: "Monthly cell scrap pickup", companyName: "Apex Electronics Ltd", status: "contacted", source: "indiamart", value: 640_000, interest: "18650 Cell Scrap (sorted)", qty: "500 KG / month", follow: -2 },
    { leadName: "Solar storage pilot", companyName: "Surya Homes", status: "qualified", source: "referral", value: 420_000, interest: "LFP Cell 3.2V 100Ah (Grade B)", qty: "160 PCS", follow: 3 },
    { leadName: "Warehouse UPS replacement", companyName: "Bharat Logistics", status: "proposal_sent", source: "email", value: 960_000, interest: "NMC Module 72V Refurbished", qty: "12 PCS", follow: 0 },
    { leadName: "Scrap buy-back tie-up", companyName: "Volt Mobility Solutions", status: "converted", source: "trade_show", value: 1_200_000, interest: "NMC Module 48V Refurbished", qty: "20 PCS", follow: -30 },
    { leadName: "One-time laptop battery lot", companyName: "TechServe Repairs", status: "lost", source: "whatsapp", value: 75_000, interest: "Mixed Li-ion Battery Scrap", qty: "60 KG", follow: -20 },
  ] as const;
  for (const [i, l] of leadPlan.entries()) {
    const createdAt = new Date(Date.parse(`${today}T09:00:00+05:30`) - (leadPlan.length - i) * 4 * 86_400_000).toISOString();
    const [lead] = await db
      .insert(leads)
      .values({
        leadName: l.leadName,
        companyName: l.companyName,
        contactPerson: ["Amit Saxena", "Pooja Rao", "Vikas Singh", "Kiran Mehta", "Neha Kapoor", "Imran Khan"][i],
        mobile: `+91 99000 2200${i}`,
        email: `purchase@${l.companyName.toLowerCase().replace(/[^a-z]+/g, "")}.example`,
        productInterest: l.interest,
        expectedQuantity: l.qty,
        expectedValue: l.value * 100, // rupees → paise
        source: l.source,
        status: l.status,
        followUpDate: addDaysISO(today, l.follow),
        customerId: l.status === "converted" ? customerRows[2].id : null,
        createdAt,
      })
      .returning();
    await db.insert(leadActivities).values({ leadId: lead.id, type: "created", content: `Lead created from ${l.source.replace("_", " ")}`, createdBy: admin.id, createdAt });
    if (l.status !== "new") {
      await db.insert(leadActivities).values({ leadId: lead.id, type: "call", content: "Discussed quantities, pricing and pickup schedule.", createdBy: admin.id, createdAt: new Date(Date.parse(createdAt) + 86_400_000).toISOString() });
    }
    await db.insert(activityLog).values({ entityType: "lead", entityId: lead.id, action: "created", description: `New lead “${l.leadName}” added`, userId: admin.id, createdAt });
  }

  console.log(`✓ Demo data added: ${customerRows.length} customers, ${plan.length} invoices, ${leadPlan.length} leads.`);
  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
