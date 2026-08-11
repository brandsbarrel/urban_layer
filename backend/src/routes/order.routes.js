import { Router } from "express";
import {
  cancelOrderHandler,
  confirmOrderHandler,
  deliverOrderHandler,
  getAdminOrderById,
  getAdminOrders,
  getOrderStatsHandler,
  outForDeliveryOrderHandler,
  packOrderHandler,
  shipOrderHandler
} from "../controllers/order.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cancelOrderSchema, markShippedSchema, adminOrderListQuerySchema } from "../validators/order.validator.js";

const orderRouter = Router();

orderRouter.use(authenticate("admin"));
orderRouter.use(authorize("Admin", "SuperAdmin"));

orderRouter.get("/", validate(adminOrderListQuerySchema, "query"), getAdminOrders);
orderRouter.get("/stats", getOrderStatsHandler);
orderRouter.get("/:id", getAdminOrderById);
orderRouter.post("/:id/confirm", confirmOrderHandler);
orderRouter.post("/:id/pack", packOrderHandler);
orderRouter.post("/:id/ship", validate(markShippedSchema), shipOrderHandler);
orderRouter.post("/:id/out-for-delivery", outForDeliveryOrderHandler);
orderRouter.post("/:id/deliver", deliverOrderHandler);
orderRouter.post("/:id/cancel", validate(cancelOrderSchema), cancelOrderHandler);

export { orderRouter };
