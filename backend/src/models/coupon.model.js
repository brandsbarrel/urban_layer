import mongoose from "mongoose";
import { COUPON_DISCOUNT_TYPES, COUPON_STATUSES, COUPON_TYPES } from "../constants/index.js";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      enum: COUPON_TYPES,
      default: "Direct Discount"
    },
    discountType: {
      type: String,
      enum: COUPON_DISCOUNT_TYPES,
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    maxRedemption: {
      type: String,
      default: "Unlimited"
    },
    status: {
      type: String,
      enum: COUPON_STATUSES,
      default: "Scheduled"
    },
    revenue: {
      type: Number,
      default: 0
    },
    redemptions: {
      type: Number,
      default: 0
    },
    avgBasket: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    progressPercent: {
      type: Number,
      default: 0
    },
    heroImage: {
      type: String,
      trim: true,
      default: null
    },
    usageTrend: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0]
    },
    usageCount: {
      type: Number,
      default: 0
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usageLimitPerCustomer: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

couponSchema.index({ code: 1 }, { unique: true });

const CouponModel = mongoose.model("Coupon", couponSchema);

export { CouponModel };
