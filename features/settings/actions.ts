"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invoiceTypeLabels } from "@/lib/billing/constants";
import { formatInvoiceNumber, prefixForType } from "@/lib/billing/invoice-calc";
import { stateNameFromCode } from "@/lib/billing/states";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import { requireAdmin, requireUser } from "@/server/auth/dal";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { deleteUserSessions } from "@/server/auth/session";
import { db } from "@/server/db";
import { companySettings, invoices, invoiceSequences, users } from "@/server/db/schema";
import { deleteFile, saveUpload } from "@/server/files";
import { getCompanySettings } from "@/server/settings";
import {
  changePasswordSchema,
  companyProfileSchema,
  invoiceSettingsSchema,
  newUserSchema,
  numberingSchema,
  profileSchema,
  type ChangePasswordInput,
  type NewUserInput,
  type NumberingInput,
} from "./schemas";

const IMAGE_MAX = 2 * 1024 * 1024;

/**
 * Replaces an optional uploaded image. Old files are kept (not deleted) because generated
 * invoices keep referencing the logo/signature that was current when they were issued.
 */
async function imageFromForm(formData: FormData, field: string, current: string | null, userId: string, keepOld = true) {
  if (formData.get(`remove_${field}`) === "1") return null;
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const id = await saveUpload(file, { kind: field === "avatar" ? "image" : "pdf-image", maxBytes: IMAGE_MAX, userId });
    if (!keepOld) await deleteFile(current);
    return id;
  }
  return current;
}

export async function updateCompanyProfile(formData: FormData): Promise<ActionResult> {
  return action(async () => {
    const user = await requireAdmin();
    const data = parseInput(companyProfileSchema, JSON.parse(String(formData.get("values") ?? "{}")));
    const settings = await getCompanySettings();
    const logoFileId = await imageFromForm(formData, "logo", settings.logoFileId, user.id);
    await db
      .update(companySettings)
      .set({ ...data, state: stateNameFromCode(data.stateCode) || data.state, logoFileId })
      .where(eq(companySettings.id, 1));
    await logActivity({ entityType: "settings", entityId: "company", action: "updated", description: "Company profile updated", userId: user.id });
    revalidatePath("/dashboard", "layout");
    return ok(null, "Company profile saved");
  });
}

export async function updateInvoiceSettings(formData: FormData): Promise<ActionResult> {
  return action(async () => {
    const user = await requireAdmin();
    const data = parseInput(invoiceSettingsSchema, JSON.parse(String(formData.get("values") ?? "{}")));
    const settings = await getCompanySettings();
    const signatureFileId = await imageFromForm(formData, "signature", settings.signatureFileId, user.id);
    await db
      .update(companySettings)
      .set({ ...data, numberPadding: Number(data.numberPadding), defaultDueDays: Number(data.defaultDueDays), signatureFileId })
      .where(eq(companySettings.id, 1));
    await logActivity({ entityType: "settings", entityId: "invoice", action: "updated", description: "Invoice settings updated", userId: user.id });
    revalidatePath("/dashboard", "layout");
    return ok(null, "Invoice settings saved");
  });
}

/** Sets the next number of a series for a financial year. It can never go back to a number already used. */
export async function setNextInvoiceNumber(input: NumberingInput): Promise<ActionResult<{ preview: string }>> {
  return action(async () => {
    const user = await requireAdmin();
    const data = parseInput(numberingSchema, input);
    const settings = await getCompanySettings();
    const prefix = prefixForType(settings, data.series);
    const next = Number(data.nextNumber);
    const id = `${prefix}|${data.financialYear}`;

    const preview = await db.transaction(async (tx) => {
      const [used] = await tx
        .select({ max: sql<number | null>`max(${invoices.sequenceNumber})` })
        .from(invoices)
        .where(and(eq(invoices.financialYear, data.financialYear), sql`${invoices.invoiceNumber} like ${`${prefix}/%`}`));
      const maxUsed = used?.max ?? 0;
      if (next <= maxUsed) {
        throw new AppError(`Number ${next} has already been used — the next number must be above ${maxUsed}.`, { nextNumber: `Must be more than ${maxUsed}` });
      }
      await tx
        .insert(invoiceSequences)
        .values({ id, prefix, financialYear: data.financialYear, lastNumber: next - 1 })
        .onConflictDoUpdate({ target: invoiceSequences.id, set: { lastNumber: next - 1 } });
      return formatInvoiceNumber(prefix, data.financialYear, next, settings.numberPadding);
    });
    const label = invoiceTypeLabels[data.series].toLowerCase();
    await logActivity({ entityType: "settings", entityId: "numbering", action: "updated", description: `Next ${label} number set to ${preview}`, userId: user.id });
    revalidatePath("/dashboard", "layout");
    return ok({ preview }, `Next ${label} will be ${preview}`);
  });
}

export async function updateMyProfile(formData: FormData): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(profileSchema, JSON.parse(String(formData.get("values") ?? "{}")));
    const clash = await db.select({ id: users.id }).from(users).where(and(eq(users.email, data.email), ne(users.id, user.id)));
    if (clash.length) throw new AppError("Another user already has this email.", { email: "Already in use" });
    const avatarFileId = await imageFromForm(formData, "avatar", user.avatarFileId, user.id, false);
    await db.update(users).set({ name: data.name, email: data.email, avatarFileId }).where(eq(users.id, user.id));
    revalidatePath("/dashboard", "layout");
    return ok(null, "Profile updated");
  });
}

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(changePasswordSchema, input);
    const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id));
    if (!row || !(await verifyPassword(data.currentPassword, row.passwordHash))) {
      throw new AppError("Your current password is incorrect.", { currentPassword: "Incorrect password" });
    }
    await db.update(users).set({ passwordHash: await hashPassword(data.password) }).where(eq(users.id, user.id));
    return ok(null, "Password changed");
  });
}

export async function createUser(input: NewUserInput): Promise<ActionResult> {
  return action(async () => {
    await requireAdmin();
    const data = parseInput(newUserSchema, input);
    const clash = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email));
    if (clash.length) throw new AppError("A user with this email already exists.", { email: "Already in use" });
    await db.insert(users).values({ name: data.name, email: data.email, role: data.role, passwordHash: await hashPassword(data.password) });
    revalidatePath("/dashboard/settings");
    return ok(null, `${data.name} can now sign in`);
  });
}

export async function updateUserAccess(id: string, patch: { role?: "admin" | "staff"; isActive?: boolean }): Promise<ActionResult> {
  return action(async () => {
    const admin = await requireAdmin();
    if (id === admin.id) throw new AppError("You can't change your own role or deactivate yourself.");
    const [target] = await db.select().from(users).where(eq(users.id, id));
    if (!target) throw new AppError("User not found.");
    await db.update(users).set(patch).where(eq(users.id, id));
    if (patch.isActive === false) await deleteUserSessions(id);
    revalidatePath("/dashboard/settings");
    return ok(null, patch.isActive === false ? `${target.name} deactivated` : patch.isActive ? `${target.name} reactivated` : "Role updated");
  });
}
