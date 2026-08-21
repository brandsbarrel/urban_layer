import { z } from "zod";
import { PAYMENT_METHODS } from "../constants/index.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId.");

const addressSchema = z.object({
  recipientName: z.string().trim().min(1, "Recipient name is required."),
  line1: z.string().trim().min(1, "Street address line 1 is required."),
  line2: z.string().trim().optional().default(""),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  postalCode: z.string().trim().min(1, "Postal code is required."),
  country: z.string().trim().min(1, "Country is required."),
  phone: z.string().trim().optional(),
});

const cartItemSchema = z.object({
  productId: objectIdSchema.or(z.string().trim().min(1)),
  variantId: z.string().trim().optional().nullable(),
  quantity: z.coerce.number().int().positive()
});

const checkoutSchema = z.object({
  // Support both: address indices (from saved addresses) OR full address objects
  shippingAddressIndex: z.coerce.number().int().nonnegative().optional(),
  billingAddressIndex: z.coerce.number().int().nonnegative().optional(),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional().default("COD"),
  couponCode: z.string().trim().optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
  // Additional fields sent by frontend
  shippingMethod: z.enum(["standard", "express"]).optional().default("standard"),
  contactEmail: z.string().email().optional().or(z.literal("")).or(z.literal(null)),
  contactPhone: z.string().trim().optional(),
  items: z.array(cartItemSchema).optional(),
}).refine(
  (data) => {
    // Either shippingAddressIndex OR shippingAddress must be provided
    return (data.shippingAddressIndex !== undefined) || (data.shippingAddress !== undefined);
  },
  {
    message: "Either shippingAddressIndex or shippingAddress must be provided",
    path: ["shippingAddress"],
  }
);

export { cartItemSchema, checkoutSchema };
