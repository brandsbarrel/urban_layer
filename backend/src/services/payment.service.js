import crypto from "node:crypto";
import { findAdminOrderById, findAdminOrderByGatewayOrderId, updateAdminOrderById } from "../repositories/admin-order.repository.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";

const createCheckoutPaymentOrder = async (orderId) => {
  const order = await findAdminOrderById(orderId);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  const gatewayOrderId = order.paymentGatewayOrderId || `order_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

  const updated = await updateAdminOrderById(order.id, {
    paymentGatewayOrderId: gatewayOrderId
  });

  return {
    orderId: updated.id,
    razorpayOrderId: updated.paymentGatewayOrderId,
    amount: updated.totalAmount / 100,
    currency: "INR",
    status: updated.paymentStatus
  };
};

const verifyCheckoutPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const order = await findAdminOrderByGatewayOrderId(razorpay_order_id);

  if (!order) {
    throw new NotFoundError("Order not found for payment verification.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new BusinessRuleError({ message: "Payment signature verification failed." });
  }

  const updated = await updateAdminOrderById(order.id, {
    paymentStatus: "Paid",
    paymentGatewayPaymentId: razorpay_payment_id,
    paymentGatewaySignature: razorpay_signature,
    timeline: [
      ...(order.timeline || []).map((entry) => ({
        ...entry.toObject?.() || entry,
        active: false
      })),
      {
        title: "Payment Captured",
        note: "Payment verified successfully.",
        done: true,
        active: true
      }
    ]
  });

  return {
    orderId: updated.id,
    paymentStatus: updated.paymentStatus,
    razorpayPaymentId: updated.paymentGatewayPaymentId
  };
};

export { createCheckoutPaymentOrder, verifyCheckoutPayment };
