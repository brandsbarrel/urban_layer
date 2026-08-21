import { sendSuccess } from "../shared/api-response.js";
import { createCheckoutPaymentOrder, verifyCheckoutPayment, handleRazorpayWebhook } from "../services/payment.service.js";

const createPaymentOrderHandler = async (req, res, next) => {
  try {
    const paymentOrder = await createCheckoutPaymentOrder(req.params.orderId);
    return sendSuccess({
      res,
      message: "Payment order created successfully.",
      data: paymentOrder
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPaymentHandler = async (req, res, next) => {
  try {
    const result = await verifyCheckoutPayment(req.body);
    return sendSuccess({
      res,
      message: "Payment verified successfully.",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const razorpayWebhookHandler = async (req, res, next) => {
  try {
    const signature = req.headers["x-razorpay-signature"] || req.headers["x-razorpay-signature-256"];
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const result = await handleRazorpayWebhook({
      rawBody,
      signature,
      eventData: req.body
    });
    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    return next(error);
  }
};

export { createPaymentOrderHandler, verifyPaymentHandler, razorpayWebhookHandler };
