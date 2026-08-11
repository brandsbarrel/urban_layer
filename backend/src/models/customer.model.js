import mongoose from "mongoose";
import { CUSTOMER_STATUSES } from "../constants/index.js";
import { addressSchema } from "./address.schema.js";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    avatarUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: CUSTOMER_STATUSES,
      default: "Active"
    },
    tier: {
      type: String,
      trim: true
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    lifetimeSpend: {
      type: Number,
      default: 0
    },
    rewardPoints: {
      type: Number,
      default: 0
    },
    returnRate: {
      type: Number,
      default: 0
    },
    addresses: {
      type: [addressSchema],
      default: []
    },
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: []
    },
    lastLoginAt: {
      type: Date
    },
    tokenVersion: {
      type: Number,
      default: 0
    },
    deactivatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerSchema.virtual("avgOrderValue").get(function avgOrderValue() {
  if (!this.totalOrders) {
    return 0;
  }

  return this.lifetimeSpend / this.totalOrders;
});

customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ name: "text", email: "text" });

const CustomerModel = mongoose.model("Customer", customerSchema);

export { CustomerModel };
