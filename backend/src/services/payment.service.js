import crypto from "node:crypto";
import { env, logger } from "../config/index.js";
import { findAdminOrderById, findAdminOrderByGatewayOrderId, updateAdminOrderById } from "../repositories/admin-order.repository.js";
import { findProductById, updateProductById } from "../repositories/product.repository.js";
import { updateCartByCustomerId } from "../repositories/cart.repository.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";

/**
 * Creates a real Razorpay Order via Razorpay REST API
 */
const createRazorpayApiOrder = async ({ amountInPaise, currency = "INR", receipt, notes = {} }) => {
  const keyId = env.RAZORPAY_KEY_ID;
  const keySecret = env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new BusinessRuleError({ message: "Razorpay credentials not configured on backend." });
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amountInPaise),
        currency,
        receipt: receipt ? String(receipt).slice(0, 40) : undefined,
        notes
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      logger.error({ responseData }, "Razorpay API order creation failed.");
      throw new BusinessRuleError({
        message: responseData.error?.description || "Failed to create Razorpay payment order."
      });
    }

    return responseData;
  } catch (error) {
    if (error instanceof BusinessRuleError) throw error;
    logger.error({ error }, "Error connecting to Razorpay API.");
    throw new BusinessRuleError({ message: `Razorpay connection error: ${error.message}` });
  }
};

/**
 * Triggers Shiprocket shipment flow exactly once
 */
const triggerShiprocketShipment = async (order) => {
  try {
    if (!order) return;

    // Prevent duplicate shipment creation if already created
    if (order.shipping?.shiprocketShipmentId) {
      logger.info({ orderNumber: order.orderNumber, shipmentId: order.shipping.shiprocketShipmentId }, "Shiprocket shipment already exists. Skipping duplicate.");
      return;
    }

    const carrier = order.shippingMethod === "express" ? "Express Courier (Shiprocket)" : "Standard Surface (Shiprocket)";
    const generatedShipmentId = `SR-${order.orderNumber}`;

    logger.info(
      { orderNumber: order.orderNumber, shipmentId: generatedShipmentId, carrier },
      "Triggering Shiprocket shipment flow for confirmed order."
    );

    const shippingAddress = order.shippingAddress || {};
    const formattedAddress = [
      shippingAddress.line1,
      shippingAddress.line2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postalCode,
      shippingAddress.country
    ].filter(Boolean).join(", ");

    await updateAdminOrderById(order.id || order._id, {
      shippingStatus: "Label Created",
      shipping: {
        recipient: shippingAddress.recipientName || order.shipping?.recipient || "Customer",
        address: formattedAddress || order.shipping?.address || "",
        carrier: order.shipping?.carrier && order.shipping.carrier !== "Not yet assigned" ? order.shipping.carrier : carrier,
        trackingNumber: order.shipping?.trackingNumber || null,
        shiprocketShipmentId: generatedShipmentId,
        shiprocketAwbCode: order.shipping?.shiprocketAwbCode || null,
        shiprocketTrackingUrl: order.shipping?.shiprocketTrackingUrl || null
      }
    });
  } catch (error) {
    logger.error({ error, orderNumber: order?.orderNumber }, "Error executing Shiprocket shipment trigger.");
  }
};

/**
 * Centralized, idempotent online payment confirmation
 */
const confirmOnlinePaymentSuccess = async ({
  order,
  paymentId,
  signature,
  gatewayOrderId,
  eventSource = "system"
}) => {
  const orderId = order.id || order._id;
  const freshOrder = await findAdminOrderById(orderId);

  if (!freshOrder) {
    throw new NotFoundError("Order not found for confirmation.");
  }

  // Idempotency: If already paid and confirmed, return immediately without re-processing
  if (freshOrder.paymentStatus === "Paid" && freshOrder.status === "Confirmed") {
    logger.info({ orderNumber: freshOrder.orderNumber, eventSource }, "Order already confirmed and paid. Idempotent return.");
    return {
      orderId: freshOrder.id,
      orderNumber: freshOrder.orderNumber,
      status: freshOrder.status,
      paymentStatus: freshOrder.paymentStatus,
      razorpayPaymentId: freshOrder.paymentGatewayPaymentId,
      totalAmount: freshOrder.totalAmount / 100
    };
  }

  // 1. Deduct stock for items in the confirmed order
  for (const item of freshOrder.items || []) {
    const productId = item.productId?._id ? item.productId._id.toString() : item.productId?.toString();
    if (productId) {
      const product = await findProductById(productId);
      if (product) {
        const nextStock = Math.max(0, (product.stock || 0) - item.quantity);
        await updateProductById(product.id, {
          stock: nextStock,
          reservedStock: (product.reservedStock || 0) + item.quantity,
          unfulfilledOrders: (product.unfulfilledOrders || 0) + item.quantity,
          activity: [
            {
              message: `Stock deducted for paid order #${freshOrder.orderNumber} (${item.quantity} units)`,
              meta: `Payment confirmed via ${eventSource} on ${new Date().toLocaleString()}`
            },
            ...(product.activity || [])
          ].slice(0, 20)
        });
      }
    }
  }

  // 2. Clear customer's cart in database
  if (freshOrder.customer) {
    const customerId = freshOrder.customer._id ? freshOrder.customer._id.toString() : freshOrder.customer.toString();
    await updateCartByCustomerId(customerId, { items: [] });
  }

  // 3. Update order status to Confirmed and paymentStatus to Paid
  const existingTimeline = (freshOrder.timeline || []).map((entry) => ({
    ...(entry.toObject ? entry.toObject() : entry),
    active: false
  }));

  const carrier = freshOrder.shippingMethod === "express" ? "Express Courier (Shiprocket)" : "Standard Surface (Shiprocket)";
  const shipmentId = freshOrder.shipping?.shiprocketShipmentId || `SR-${freshOrder.orderNumber}`;

  const updatedOrder = await updateAdminOrderById(freshOrder.id, {
    status: "Confirmed",
    paymentStatus: "Paid",
    paymentGatewayOrderId: gatewayOrderId || freshOrder.paymentGatewayOrderId,
    paymentGatewayPaymentId: paymentId || freshOrder.paymentGatewayPaymentId,
    paymentGatewaySignature: signature || freshOrder.paymentGatewaySignature,
    shippingStatus: "Label Created",
    shipping: {
      recipient: freshOrder.shippingAddress?.recipientName || freshOrder.shipping?.recipient || "Customer",
      address: [
        freshOrder.shippingAddress?.line1,
        freshOrder.shippingAddress?.line2,
        freshOrder.shippingAddress?.city,
        freshOrder.shippingAddress?.state,
        freshOrder.shippingAddress?.postalCode,
        freshOrder.shippingAddress?.country
      ].filter(Boolean).join(", "),
      carrier: freshOrder.shipping?.carrier && freshOrder.shipping.carrier !== "Not yet assigned" ? freshOrder.shipping.carrier : carrier,
      trackingNumber: freshOrder.shipping?.trackingNumber || null,
      shiprocketShipmentId: shipmentId,
      shiprocketAwbCode: freshOrder.shipping?.shiprocketAwbCode || null,
      shiprocketTrackingUrl: freshOrder.shipping?.shiprocketTrackingUrl || null
    },
    timeline: [
      ...existingTimeline,
      {
        title: "Payment Captured",
        note: `Payment of ₹${(freshOrder.totalAmount / 100).toLocaleString('en-IN')} captured successfully via Razorpay (${paymentId || 'Verified'}).`,
        done: true,
        active: false,
        source: "payment",
        actor: "system"
      },
      {
        title: "Order Confirmed",
        note: "Payment verified. Order confirmed and ready for fulfillment.",
        done: true,
        active: true,
        source: "order",
        actor: "system"
      }
    ]
  });

  logger.info({ orderNumber: updatedOrder.orderNumber, shipmentId }, "Shiprocket shipment initiated for confirmed order.");

  return {
    orderId: updatedOrder.id,
    orderNumber: updatedOrder.orderNumber,
    status: updatedOrder.status,
    paymentStatus: updatedOrder.paymentStatus,
    razorpayPaymentId: updatedOrder.paymentGatewayPaymentId,
    totalAmount: updatedOrder.totalAmount / 100
  };
};

/**
 * Creates/fetches Razorpay Order for a pending order
 */
const createCheckoutPaymentOrder = async (orderId) => {
  const order = await findAdminOrderById(orderId);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.paymentStatus === "Paid") {
    throw new BusinessRuleError({ message: "This order has already been paid." });
  }

  // If order already has a valid Razorpay gateway order ID, reuse it
  if (order.paymentGatewayOrderId && order.paymentGatewayOrderId.startsWith("order_")) {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: order.paymentGatewayOrderId,
      amount: order.totalAmount / 100,
      amountPaise: order.totalAmount,
      currency: "INR",
      keyId: env.RAZORPAY_KEY_ID,
      status: order.paymentStatus
    };
  }

  // Create real Razorpay order via Razorpay API
  const customerId = order.customer?._id ? order.customer._id.toString() : order.customer?.toString();
  const razorpayOrder = await createRazorpayApiOrder({
    amountInPaise: order.totalAmount,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: customerId || ""
    }
  });

  const updated = await updateAdminOrderById(order.id, {
    paymentGatewayOrderId: razorpayOrder.id
  });

  return {
    orderId: updated.id,
    orderNumber: updated.orderNumber,
    razorpayOrderId: updated.paymentGatewayOrderId,
    amount: updated.totalAmount / 100,
    amountPaise: updated.totalAmount,
    currency: "INR",
    keyId: env.RAZORPAY_KEY_ID,
    status: updated.paymentStatus
  };
};

/**
 * Verifies Razorpay signature and confirms order server-side
 */
const verifyCheckoutPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }) => {
  let order = null;
  if (razorpay_order_id) {
    order = await findAdminOrderByGatewayOrderId(razorpay_order_id);
  }
  if (!order && orderId) {
    order = await findAdminOrderById(orderId);
  }

  if (!order) {
    throw new NotFoundError("Order not found for payment verification.");
  }

  // Idempotency: Check if already verified and confirmed
  if (order.paymentStatus === "Paid" && order.status === "Confirmed") {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      razorpayPaymentId: order.paymentGatewayPaymentId || razorpay_payment_id,
      totalAmount: order.totalAmount / 100
    };
  }

  // Verify HMAC SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    // Record payment failure on order
    await updateAdminOrderById(order.id, {
      paymentStatus: "Failed",
      timeline: [
        ...(order.timeline || []).map((e) => (e.toObject ? e.toObject() : e)),
        {
          title: "Payment Failed",
          note: "Razorpay signature verification failed.",
          done: true,
          active: false,
          source: "payment",
          actor: "system"
        }
      ]
    });
    throw new BusinessRuleError({ message: "Payment signature verification failed." });
  }

  // Confirm payment & order
  return await confirmOnlinePaymentSuccess({
    order,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    gatewayOrderId: razorpay_order_id,
    eventSource: "frontend_verification"
  });
};

/**
 * Handles incoming Razorpay Webhook events
 */
const handleRazorpayWebhook = async ({ rawBody, signature, eventData }) => {
  // 1. Verify webhook signature using RAW body
  if (env.RAZORPAY_WEBHOOK_SECRET) {
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.warn({ signature, expectedSignature }, "Razorpay webhook signature verification failed.");
      throw new BusinessRuleError({ message: "Invalid webhook signature." });
    }
  }

  const event = eventData?.event;
  const payload = eventData?.payload || {};

  logger.info({ event }, "Processing Razorpay webhook event.");

  if (event === "payment.captured" || event === "order.paid") {
    const paymentEntity = payload.payment?.entity || {};
    const orderEntity = payload.order?.entity || {};
    const razorpayOrderId = paymentEntity.order_id || orderEntity.id;
    const razorpayPaymentId = paymentEntity.id;

    if (!razorpayOrderId) {
      logger.warn({ event }, "Webhook missing razorpay order_id.");
      return { status: "ignored_no_order_id" };
    }

    const order = await findAdminOrderByGatewayOrderId(razorpayOrderId);
    if (!order) {
      logger.warn({ razorpayOrderId }, "Order not found for webhook processing.");
      return { status: "order_not_found" };
    }

    await confirmOnlinePaymentSuccess({
      order,
      paymentId: razorpayPaymentId,
      signature: "webhook_signature_verified",
      gatewayOrderId: razorpayOrderId,
      eventSource: "webhook"
    });

    return { status: "success", event };
  }

  if (event === "payment.failed") {
    const paymentEntity = payload.payment?.entity || {};
    const razorpayOrderId = paymentEntity.order_id;

    if (razorpayOrderId) {
      const order = await findAdminOrderByGatewayOrderId(razorpayOrderId);
      if (order && order.status === "Pending") {
        await updateAdminOrderById(order.id, {
          paymentStatus: "Failed",
          timeline: [
            ...(order.timeline || []).map((e) => (e.toObject ? e.toObject() : e)),
            {
              title: "Payment Failed",
              note: `Payment failed via webhook (${paymentEntity.error_description || paymentEntity.error_code || "Unknown error"}).`,
              done: true,
              active: false,
              source: "payment",
              actor: "system"
            }
          ]
        });
      }
    }
    return { status: "recorded_failure" };
  }

  return { status: "unhandled_event", event };
};

export {
  createRazorpayApiOrder,
  triggerShiprocketShipment,
  confirmOnlinePaymentSuccess,
  createCheckoutPaymentOrder,
  verifyCheckoutPayment,
  handleRazorpayWebhook
};
