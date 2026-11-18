import { z } from "zod";
import { CUSTOMER_TYPES } from "@/lib/billing/constants";
import { stateCodeFromGstin, stateNameFromCode } from "@/lib/billing/states";
import { email, gstin, pan, phone, requiredText, stateCode, text } from "@/lib/billing/validation";

export const customerSchema = z
  .object({
    name: requiredText("Customer / company name", 200),
    contactPerson: text(120),
    mobile: phone(),
    email: email(),
    gstin: gstin(),
    pan: pan(),
    billingAddress: text(500),
    shippingAddress: text(500),
    state: text(80),
    stateCode: stateCode(),
    customerType: z.enum(CUSTOMER_TYPES),
    notes: text(1000),
  })
  .superRefine((v, ctx) => {
    const gstState = stateCodeFromGstin(v.gstin);
    if (v.gstin && gstState && v.stateCode && gstState !== v.stateCode) {
      ctx.addIssue({
        code: "custom",
        path: ["stateCode"],
        message: `GSTIN is registered in ${stateNameFromCode(gstState)} (${gstState}) — the state should match.`,
      });
    }
  });

export type CustomerInput = z.input<typeof customerSchema>;

export const emptyCustomer: CustomerInput = {
  name: "",
  contactPerson: "",
  mobile: "",
  email: "",
  gstin: "",
  pan: "",
  billingAddress: "",
  shippingAddress: "",
  state: "",
  stateCode: "",
  customerType: "business",
  notes: "",
};
