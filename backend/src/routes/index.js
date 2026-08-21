import { Router } from "express";
import { adminAuthRouter } from "./admin-auth.routes.js";
import { adminCustomerRouter } from "./admin-customer.routes.js";
import { cartRouter } from "./cart.routes.js";
import { categoryRouter } from "./category.routes.js";
import { couponRouter, storefrontCouponRouter } from "./coupon.routes.js";
import { customerAuthRouter } from "./customer-auth.routes.js";
import { customerOrderRouter } from "./customer-order.routes.js";
import { customerProfileRouter } from "./customer-profile.routes.js";
import { healthRouter } from "./health.routes.js";
import { orderRouter } from "./order.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { phoneModelRouter } from "./phone-model.routes.js";
import { productRouter } from "./product.routes.js";
import { storefrontCatalogRouter } from "./storefront-catalog.routes.js";

import { razorpayWebhookHandler } from "../controllers/payment.controller.js";

const apiRouter = Router();

apiRouter.use("/", healthRouter);
apiRouter.use("/admin/auth", adminAuthRouter);
apiRouter.use("/admin/categories", categoryRouter);
apiRouter.use("/admin/customers", adminCustomerRouter);
apiRouter.use("/admin/coupons", couponRouter);
apiRouter.use("/admin/orders", orderRouter);
apiRouter.use("/admin/phone-models", phoneModelRouter);
apiRouter.use("/admin/products", productRouter);
apiRouter.use("/customer/auth", customerAuthRouter);
apiRouter.use("/customer/cart", cartRouter);
apiRouter.use("/customer/orders", customerOrderRouter);
apiRouter.use("/customer", customerProfileRouter);
apiRouter.use("/storefront/coupons", storefrontCouponRouter);
apiRouter.use("/storefront/catalog", storefrontCatalogRouter);
apiRouter.use("/storefront/payments", paymentRouter);
apiRouter.post("/webhooks/razorpay", razorpayWebhookHandler);

export { apiRouter };
