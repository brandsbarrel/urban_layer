import mongoose from "mongoose";
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "../constants/index.js";
import { addressSchema } from "./address.schema.js";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      trim: true
    },
    variantId: {
      type: String,
      trim: true,
      default: null
    },
    variantLabel: {
      type: String,
      trim: true,
      default: ""
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    lineTotal: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    _id: false
  }
);

const timelineEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    note: {
      type: String,
      trim: true,
      default: ""
    },
    done: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    shippingAddress: {
      type: addressSchema,
      required: true
    },
    billingAddress: {
      type: addressSchema,
      required: true
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending"
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending"
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      required: true
    },
    shippingAmount: {
      type: Number,
      required: true
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    couponCode: {
      type: String,
      trim: true,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    timeline: {
      type: [timelineEntrySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
