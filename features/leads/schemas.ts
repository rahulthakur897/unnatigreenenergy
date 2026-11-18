import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/billing/constants";
import { email, gstin, optionalDate, optionalMoney, phone, requiredText, text } from "@/lib/billing/validation";

export const leadSchema = z.object({
  leadName: requiredText("Lead name", 200),
  companyName: text(200),
  contactPerson: text(120),
  mobile: phone(),
  email: email(),
  gstin: gstin(),
  address: text(500),
  productInterest: text(300),
  expectedQuantity: text(60),
  expectedValue: optionalMoney("deal value"),
  source: z.enum(LEAD_SOURCES),
  followUpDate: optionalDate(),
  status: z.enum(LEAD_STATUSES),
  notes: text(2000),
});
export type LeadInput = z.input<typeof leadSchema>;

export const LOGGABLE_ACTIVITIES = ["note", "call", "email", "meeting", "follow_up"] as const;

export const leadActivitySchema = z.object({
  type: z.enum(LOGGABLE_ACTIVITIES),
  content: requiredText("Details", 2000),
  nextFollowUp: optionalDate(),
});
export type LeadActivityInput = z.input<typeof leadActivitySchema>;

export const emptyLead: LeadInput = {
  leadName: "",
  companyName: "",
  contactPerson: "",
  mobile: "",
  email: "",
  gstin: "",
  address: "",
  productInterest: "",
  expectedQuantity: "",
  expectedValue: "",
  source: "phone",
  followUpDate: "",
  status: "new",
  notes: "",
};
