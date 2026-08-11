import { z } from "zod";
import { CUSTOMER_STATUSES } from "../constants/index.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId.");
const emailSchema = z.string().trim().max(254).email().transform((value) => value.toLowerCase());
const phoneSchema = z.string().trim().regex(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format.").or(z.literal("")).optional().transform((value) => value || "");

const addressSchema = z.object({
  label: z.string().trim().max(60).optional().default(""),
  recipientName: z.string().trim().min(1).max(120),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().min(1).max(30),
  country: z.string().trim().min(1).max(120),
  phone: phoneSchema,
  isDefault: z.boolean().optional().default(false)
});

const adminCustomerUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  avatarUrl: z.string().url().refine((value) => value.startsWith("https://"), "URL must start with https://").or(z.literal("")).optional(),
  status: z.enum(CUSTOMER_STATUSES).optional(),
  tier: z.string().trim().max(120).optional(),
  rewardPoints: z.coerce.number().int().nonnegative().optional(),
  returnRate: z.coerce.number().min(0).max(100).optional(),
  addresses: z.array(addressSchema).optional()
});

const customerProfileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: phoneSchema,
  avatarUrl: z.string().url().refine((value) => value.startsWith("https://"), "URL must start with https://").or(z.literal("")).optional()
});

const customerAddressCreateSchema = addressSchema;
const customerAddressUpdateSchema = addressSchema.partial();

const bulkDeactivateSchema = z.object({
  ids: z.array(objectIdSchema).min(1)
});

export {
  adminCustomerUpdateSchema,
  customerProfileUpdateSchema,
  customerAddressCreateSchema,
  customerAddressUpdateSchema,
  bulkDeactivateSchema
};
