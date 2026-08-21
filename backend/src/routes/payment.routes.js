import { Router } from "express";
import { createPaymentOrderHandler, verifyPaymentHandler, razorpayWebhookHandler } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyPaymentSchema } from "../validators/order.validator.js";

const paymentRouter = Router();

paymentRouter.post("/orders/:orderId/create", authenticate("customer"), authorize("Customer"), createPaymentOrderHandler);
paymentRouter.post("/verify", validate(verifyPaymentSchema), verifyPaymentHandler);
paymentRouter.post("/webhook", razorpayWebhookHandler);

export { paymentRouter };
