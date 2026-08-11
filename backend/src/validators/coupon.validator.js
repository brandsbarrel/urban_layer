import { z } from "zod";
import {
  COUPON_DISCOUNT_TYPES,
  COUPON_STATUSES,
  COUPON_TYPES,
} from "../constants/index.js";

const couponBaseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .transform((value) => value.toUpperCase()),

  title: z
    .string()
    .trim()
    .min(1)
    .max(160),

  subtitle: z
    .string()
    .trim()
    .max(240)
    .optional()
    .default(""),

  type: z
    .enum(COUPON_TYPES)
    .optional()
    .default("Direct Discount"),

  discountType: z.enum(COUPON_DISCOUNT_TYPES),

  discountValue: z.coerce
    .number()
    .nonnegative(),

  minOrderValue: z
    .union([
      z.coerce.number().nonnegative(),
      z.literal(""),
      z.null(),
    ])
    .transform((value) => {
      if (value === "" || value === null) {
        return 0;
      }

      return value;
    }),

  maxRedemption: z
    .string()
    .trim()
    .min(1)
    .default("Unlimited"),

  startDate: z.string().date(),

  endDate: z.string().date(),

  status: z
    .enum(COUPON_STATUSES)
    .optional()
    .default("Scheduled"),
});

const createCouponSchema = couponBaseSchema
  .refine(
    (data) =>
      new Date(data.endDate).getTime() >
      new Date(data.startDate).getTime(),
    {
      path: ["endDate"],
      message: "End date must be later than start date.",
    }
  )
  .refine(
    (data) => {
      if (data.discountType === "Percentage") {
        return data.discountValue <= 100;
      }

      return true;
    },
    {
      path: ["discountValue"],
      message: "Percentage discount cannot exceed 100.",
    }
  );

const updateCouponSchema = couponBaseSchema
  .partial()
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return (
          new Date(data.endDate).getTime() >
          new Date(data.startDate).getTime()
        );
      }

      return true;
    },
    {
      path: ["endDate"],
      message: "End date must be later than start date.",
    }
  )
  .refine(
    (data) => {
      if (
        data.discountType === "Percentage" &&
        data.discountValue !== undefined
      ) {
        return data.discountValue <= 100;
      }

      return true;
    },
    {
      path: ["discountValue"],
      message: "Percentage discount cannot exceed 100.",
    }
  );

const validateCouponCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toUpperCase()),

  cartTotal: z.coerce
    .number()
    .nonnegative(),

  customerId: z
    .string()
    .trim()
    .optional()
    .default(""),
});

export {
  createCouponSchema,
  updateCouponSchema,
  validateCouponCodeSchema,
};