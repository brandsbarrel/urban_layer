import { sendSuccess } from "../shared/api-response.js";
import { createCheckoutPaymentOrder, verifyCheckoutPayment } from "../services/payment.service.js";

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

export { createPaymentOrderHandler, verifyPaymentHandler };
