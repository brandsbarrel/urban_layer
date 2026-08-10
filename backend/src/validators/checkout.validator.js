import { z } from "zod";
import { PAYMENT_METHODS } from "../constants/index.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId.");

const cartItemSchema = z.object({
  productId: objectIdSchema,
  variantId: z.string().trim().optional().nullable(),
  quantity: z.coerce.number().int().positive()
});

const checkoutSchema = z.object({
  shippingAddressIndex: z.coerce.number().int().nonnegative(),
  billingAddressIndex: z.coerce.number().int().nonnegative().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  couponCode: z.string().trim().optional().default(""),
  notes: z.string().trim().max(1000).optional().default("")
});

export { cartItemSchema, checkoutSchema };
