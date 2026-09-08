import { z } from "zod";

const adminOrderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(20),
  search: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default("All"),
  paymentStatus: z.string().trim().optional().default("All"),
  paymentMethod: z.string().trim().optional().default("All"),
  shippingStatus: z.string().trim().optional().default("All"),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "totalAmount", "orderNumber", "status"]).optional().default("createdAt"),
  sortOrder: z.enum(["desc", "asc"]).optional().default("desc")
});

const markShippedSchema = z.object({
  courier: z.string().trim().min(1),
  trackingNumber: z.string().trim().min(1),
  shippingMethod: z.string().trim().min(1)
});

const cancelOrderSchema = z.object({
  reason: z.string().trim().min(1).max(200)
});

const rejectReturnSchema = z.object({
  reason: z.string().trim().min(1).max(300)
});

const processRefundSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  reason: z.string().trim().min(1).max(200).optional().default("Admin processed refund"),
  method: z.string().trim().optional().default("Original Payment Method")
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
  rejectReturnSchema,
  processRefundSchema,
  verifyPaymentSchema
};
