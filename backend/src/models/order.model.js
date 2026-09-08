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
    // Source and actor
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
    },
    // IMPORTANT: createdAt is the HISTORICAL timestamp of this event.
    // It is set at event creation time and NEVER updated afterwards.
    // This fixes the timeline date bug where all events showed the same date.
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

/**
 * Tracking event schema for Shiprocket scan events.
 * Each event has its OWN occurredAt from the provider scan date.
 * NEVER use order.updatedAt or webhook received time for occurredAt.
 */
const trackingEventSchema = new mongoose.Schema(
  {
    // Deterministic key for idempotency (sha256 of awb+date+status+activity+location)
    eventKey: {
      type: String,
      trim: true,
      required: true
    },
    provider: {
      type: String,
      default: "SHIPROCKET"
    },
    // Normalized Urban Layers status
    status: {
      type: String,
      trim: true,
      default: ""
    },
    // Human-readable label from provider
    statusLabel: {
      type: String,
      trim: true,
      default: ""
    },
    // Activity description from provider
    activity: {
      type: String,
      trim: true,
      default: ""
    },
    // Location from provider
    location: {
      type: String,
      trim: true,
      default: ""
    },
    // Raw provider status code
    providerStatusCode: {
      type: String,
      trim: true,
      default: ""
    },
    // Raw provider status string (preserved for debugging)
    rawStatus: {
      type: String,
      trim: true,
      default: ""
    },
    // CRITICAL: This is the ORIGINAL timestamp from the provider scan.
    // Set from scans[].date, NEVER from current time or order.updatedAt.
    occurredAt: {
      type: Date,
      required: true
    }
  },
  {
    _id: false,
    timestamps: false
  }
);

/**
 * Return shipment sub-document schema.
 * Kept SEPARATE from forward shipment to preserve both histories independently.
 */
const returnShipmentSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "SHIPROCKET" },
    shiprocketOrderId: { type: String, trim: true, default: null },
    awb: { type: String, trim: true, default: null },
    courierName: { type: String, trim: true, default: null },
    currentStatus: { type: String, trim: true, default: null },
    currentStatusId: { type: Number, default: null },
    shipmentStatus: { type: String, trim: true, default: null },
    podStatus: { type: String, trim: true, default: null },
    pod: { type: String, trim: true, default: null },
    updatedAt: { type: Date, default: null }
  },
  { _id: false }
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
      // Delivery recipient and address
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
      // Shipping provider
      provider: {
        type: String,
        trim: true,
        default: null
      },
      // Carrier / courier name (human-readable)
      carrier: {
        type: String,
        trim: true,
        default: "Not yet assigned"
      },
      courierName: {
        type: String,
        trim: true,
        default: null
      },
      // Tracking number (same as AWB for Shiprocket)
      trackingNumber: {
        type: String,
        trim: true,
        default: null
      },
      // ============================================================
      // SHIPROCKET IDENTIFIERS — stored separately, NEVER collapsed
      // ============================================================
      // The order_id Shiprocket assigns (e.g., "1373900_150876814")
      shiprocketOrderId: {
        type: String,
        trim: true,
        default: null
      },
      // The channel_order_id / our reference (e.g., Urban Layers orderNumber)
      shiprocketReferenceOrderId: {
        type: String,
        trim: true,
        default: null
      },
      // The sr_order_id (Shiprocket's internal numeric order ID)
      shiprocketShipmentId: {
        type: String,
        trim: true,
        default: null
      },
      // AWB code (Air Waybill — the courier tracking number)
      awb: {
        type: String,
        trim: true,
        default: null
      },
      // Legacy field kept for backwards compatibility
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
      // ============================================================
      // CURRENT STATUS (snapshot, updated by webhooks)
      // ============================================================
      currentStatus: {
        type: String,
        trim: true,
        default: null
      },
      currentStatusId: {
        type: Number,
        default: null
      },
      shipmentStatus: {
        type: String,
        trim: true,
        default: null
      },
      shipmentStatusId: {
        type: Number,
        default: null
      },
      currentTimestamp: {
        type: String,
        trim: true,
        default: null
      },
      channelId: {
        type: String,
        trim: true,
        default: null
      },
      // ============================================================
      // DATES
      // ============================================================
      awbAssignedDate: {
        type: Date,
        default: null
      },
      pickupScheduledDate: {
        type: Date,
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
      },
      // ============================================================
      // POD & QC
      // ============================================================
      podStatus: {
        type: String,
        trim: true,
        default: null
      },
      pod: {
        type: String,
        trim: true,
        default: null
      },
      qcImage: {
        type: String,
        trim: true,
        default: null
      },
      qcFailureReason: {
        type: String,
        trim: true,
        default: null
      },
      // Label and invoice
      labelUrl: {
        type: String,
        trim: true,
        default: null
      },
      invoiceUrl: {
        type: String,
        trim: true,
        default: null
      }
    },
    // ============================================================
    // TRACKING EVENTS (Shiprocket scans[] — forward shipment)
    // Each event preserves its OWN occurredAt from the provider scan date.
    // NEVER use order.updatedAt or webhook received time.
    // ============================================================
    trackingEvents: {
      type: [trackingEventSchema],
      default: []
    },
    // ============================================================
    // RETURN SHIPMENT — separate from forward shipment
    // ============================================================
    returnShipment: {
      type: returnShipmentSchema,
      default: null
    },
    // ============================================================
    // RETURN TRACKING EVENTS (Shiprocket scans[] — return shipment)
    // Stored separately to preserve forward shipment history.
    // ============================================================
    returnTrackingEvents: {
      type: [trackingEventSchema],
      default: []
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

// ============================================================
// INDEXES
// ============================================================
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ shippingStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
// Shiprocket identifier indexes for fast webhook lookup
orderSchema.index({ "shipping.awb": 1 }, { sparse: true });
orderSchema.index({ "shipping.shiprocketOrderId": 1 }, { sparse: true });
orderSchema.index({ "shipping.shiprocketShipmentId": 1 }, { sparse: true });
// Return shipment AWB index
orderSchema.index({ "returnShipment.awb": 1 }, { sparse: true });
// Tracking event idempotency (covered at application level via eventKey set)

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
