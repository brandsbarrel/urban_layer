import { Router } from "express";
import { getCustomerOrders, getCustomerOrderById } from "../controllers/customer-order.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const customerOrderRouter = Router();

customerOrderRouter.use(authenticate("customer"));
customerOrderRouter.use(authorize("Customer"));

customerOrderRouter.get("/", getCustomerOrders);
customerOrderRouter.get("/:id", getCustomerOrderById);

export { customerOrderRouter };