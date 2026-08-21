import mongoose from "mongoose";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES
} from "../constants/index.js";
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
    },
    // New fields for enhanced timeline
    source: {
      type: String,
      enum: ["order", "payment", "shipping", "return", "refund", "system"],
      default: "order"
    },
    actor: {
      type: String,
      enum: ["customer", "admin", "system", "courier"],
      default: "system"
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "actorModel",
      default: null
    },
    actorModel: {
      type: String,
      enum: ["Customer", "Admin"],
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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
    paymentGatewayOrderId: {
      type: String,
      trim: true,
      default: null
    },
    paymentGatewayPaymentId: {
      type: String,
      trim: true,
      default: null
    },
    paymentGatewaySignature: {
      type: String,
      trim: true,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null
    },
    // NEW: Separate shipping status
    shippingStatus: {
      type: String,
      enum: SHIPPING_STATUSES,
      default: "Label Created"
    },
    shipping: {
      recipient: {
        type: String,
        trim: true,
        default: ""
      },
      address: {
        type: String,
        trim: true,
        default: ""
      },
      carrier: {
        type: String,
        trim: true,
        default: "Not yet assigned"
      },
      trackingNumber: {
        type: String,
        trim: true,
        default: null
      },
      // Shiprocket specific fields
      shiprocketShipmentId: {
        type: String,
        trim: true,
        default: null
      },
      shiprocketAwbCode: {
        type: String,
        trim: true,
        default: null
      },
      shiprocketTrackingUrl: {
        type: String,
        trim: true,
        default: null
      },
      labelUrl: {
        type: String,
        trim: true,
        default: null
      },
      invoiceUrl: {
        type: String,
        trim: true,
        default: null
      },
      pickupDate: {
        type: Date,
        default: null
      },
      estimatedDeliveryDate: {
        type: Date,
        default: null
      },
      actualDeliveryDate: {
        type: Date,
        default: null
      }
    },
    // Return request (embedded for quick access)
    returnRequest: {
      reason: {
        type: String,
        trim: true,
        default: null
      },
      requestedAt: {
        type: Date,
        default: null
      },
      status: {
        type: String,
        default: null
      },
      rejectionReason: {
        type: String,
        trim: true,
        default: null
      },
      approvedAt: {
        type: Date,
        default: null
      },
      items: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        variantId: String,
        quantity: Number,
        unitPrice: Number
      }]
    },
    // Refund info (embedded for quick access)
    refund: {
      amount: {
        type: Number,
        default: 0
      },
      reason: {
        type: String,
        trim: true,
        default: null
      },
      status: {
        type: String,
        default: null
      },
      processedAt: {
        type: Date,
        default: null
      },
      razorpayRefundId: {
        type: String,
        trim: true,
        default: null
      },
      method: {
        type: String,
        default: null
      }
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
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ shippingStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
