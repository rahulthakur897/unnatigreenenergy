import { desc } from "drizzle-orm";
import { listCustomers } from "@/features/customers/queries";
import { listInvoices } from "@/features/invoices/queries";
import { listProducts } from "@/features/products/queries";
import { customerTypeLabels, invoiceStatusLabels, invoiceTypeLabels, leadSourceLabels, leadStatusLabels, paymentStatusLabels } from "@/lib/billing/constants";
import { todayISO } from "@/lib/billing/dates";
import { getCurrentUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { leads } from "@/server/db/schema";
import { CSV_TYPE, downloadResponse, toCsv, toXlsx, XLSX_TYPE, type ExportColumn, type ExportRow } from "@/server/export";
import { getCompanySettings } from "@/server/settings";

type Dataset = { title: string; columns: ExportColumn[]; rows: ExportRow[] };

const loaders: Record<string, () => Promise<Dataset>> = {
  async leads() {
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return {
      title: "Leads",
      columns: [
        { key: "leadName", label: "Lead Name" },
        { key: "companyName", label: "Company Name" },
        { key: "contactPerson", label: "Contact Person" },
        { key: "mobile", label: "Mobile Number" },
        { key: "email", label: "Email" },
        { key: "gstin", label: "GSTIN" },
        { key: "address", label: "Address" },
        { key: "productInterest", label: "Product Interested In" },
        { key: "expectedQuantity", label: "Expected Quantity" },
        { key: "expectedValue", label: "Expected Deal Value", type: "money" },
        { key: "source", label: "Lead Source" },
        { key: "followUpDate", label: "Follow-up Date" },
        { key: "status", label: "Lead Status" },
        { key: "notes", label: "Notes" },
        { key: "createdAt", label: "Created" },
      ],
      rows: rows.map((l) => ({ ...l, source: leadSourceLabels[l.source], status: leadStatusLabels[l.status], createdAt: l.createdAt.slice(0, 10) })),
    };
  },
  async customers() {
    const rows = await listCustomers();
    return {
      title: "Customers",
      columns: [
        { key: "name", label: "Customer / Company" },
        { key: "contactPerson", label: "Contact Person" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "gstin", label: "GSTIN" },
        { key: "pan", label: "PAN" },
        { key: "billingAddress", label: "Billing Address" },
        { key: "shippingAddress", label: "Shipping Address" },
        { key: "state", label: "State" },
        { key: "stateCode", label: "State Code" },
        { key: "customerType", label: "Customer Type" },
        { key: "invoiceCount", label: "Invoices", type: "number" },
        { key: "billed", label: "Total Billed", type: "money" },
        { key: "received", label: "Received", type: "money" },
        { key: "outstanding", label: "Outstanding", type: "money" },
      ],
      rows: rows.map((c) => ({ ...c, customerType: customerTypeLabels[c.customerType] })),
    };
  },
  async invoices() {
    const rows = await listInvoices();
    return {
      title: "Invoices",
      columns: [
        { key: "invoiceNumber", label: "Invoice Number" },
        { key: "invoiceType", label: "Type" },
        { key: "invoiceDate", label: "Invoice Date" },
        { key: "dueDate", label: "Due Date" },
        { key: "billName", label: "Customer Name" },
        { key: "billGstin", label: "GSTIN" },
        { key: "total", label: "Total Amount", type: "money" },
        { key: "paid", label: "Received", type: "money" },
        { key: "balance", label: "Balance", type: "money" },
        { key: "status", label: "Invoice Status" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "createdAt", label: "Created" },
      ],
      rows: rows.map((i) => ({
        ...i,
        invoiceNumber: i.invoiceNumber ?? "DRAFT",
        invoiceType: invoiceTypeLabels[i.invoiceType],
        status: invoiceStatusLabels[i.status],
        paymentStatus: i.paymentStatus ? paymentStatusLabels[i.paymentStatus] : "",
        createdAt: i.createdAt.slice(0, 10),
      })),
    };
  },
  async products() {
    const rows = await listProducts();
    return {
      title: "Products",
      columns: [
        { key: "name", label: "Product Name" },
        { key: "description", label: "Description" },
        { key: "categoryName", label: "Category" },
        { key: "hsnCode", label: "HSN/SAC" },
        { key: "unit", label: "Unit" },
        { key: "availableQty", label: "Available Qty", type: "number" },
        { key: "purchasePrice", label: "Purchase Price", type: "money" },
        { key: "sellingPrice", label: "Selling Price", type: "money" },
        { key: "gstRate", label: "GST %", type: "number" },
        { key: "status", label: "Status" },
      ],
      rows,
    };
  },
};

export async function GET(request: Request, ctx: RouteContext<"/api/billing/export/[entity]">) {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const { entity } = await ctx.params;
  const load = loaders[entity];
  if (!load) return Response.json({ error: "Unknown export" }, { status: 404 });

  const data = await load();
  const fileBase = `${entity}_${todayISO()}`;
  if (new URL(request.url).searchParams.get("format") === "csv") {
    return downloadResponse(toCsv(data.columns, data.rows), `${fileBase}.csv`, CSV_TYPE);
  }
  const company = (await getCompanySettings()).name;
  const xlsx = await toXlsx({ sheetName: data.title, title: data.title, company, columns: data.columns, rows: data.rows });
  return downloadResponse(xlsx, `${fileBase}.xlsx`, XLSX_TYPE);
}
