import { Router } from "express";
import { adminAuthRouter } from "./admin-auth.routes.js";
import { adminCustomerRouter } from "./admin-customer.routes.js";
import { cartRouter } from "./cart.routes.js";
import { categoryRouter } from "./category.routes.js";
import { customerAuthRouter } from "./customer-auth.routes.js";
import { customerProfileRouter } from "./customer-profile.routes.js";
import { healthRouter } from "./health.routes.js";
import { productRouter } from "./product.routes.js";

const apiRouter = Router();

apiRouter.use("/", healthRouter);
apiRouter.use("/admin/auth", adminAuthRouter);
apiRouter.use("/admin/categories", categoryRouter);
apiRouter.use("/admin/customers", adminCustomerRouter);
apiRouter.use("/admin/products", productRouter);
apiRouter.use("/customer/auth", customerAuthRouter);
apiRouter.use("/customer/cart", cartRouter);
apiRouter.use("/customer", customerProfileRouter);

export { apiRouter };
