import { z } from "zod";

const adminOrderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(20),
  search: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default("All"),
  paymentStatus: z.string().trim().optional().default("All")
});

const markShippedSchema = z.object({
  courier: z.string().trim().min(1),
  trackingNumber: z.string().trim().min(1),
  shippingMethod: z.string().trim().min(1)
});

const cancelOrderSchema = z.object({
  reason: z.string().trim().min(1).max(200)
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
  orderId: z.string().trim().optional()
});

export {
  adminOrderListQuerySchema,
  markShippedSchema,
  cancelOrderSchema,
  verifyPaymentSchema
};
