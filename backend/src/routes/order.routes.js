import { Router } from "express";
import {
  cancelOrderHandler,
  confirmOrderHandler,
  processOrderHandler,
  deliverOrderHandler,
  getAdminOrderById,
  getAdminOrders,
  getOrderStatsHandler,
  outForDeliveryOrderHandler,
  packOrderHandler,
  shipOrderHandler,
  approveReturnHandler,
  rejectReturnHandler,
  processRefundHandler
} from "../controllers/order.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cancelOrderSchema, markShippedSchema, adminOrderListQuerySchema, rejectReturnSchema, processRefundSchema } from "../validators/order.validator.js";

const orderRouter = Router();

orderRouter.use(authenticate("admin"));

// Read-only routes: Staff, Admin, SuperAdmin
orderRouter.get("/", authorize("Staff", "Admin", "SuperAdmin"), validate(adminOrderListQuerySchema, "query"), getAdminOrders);
orderRouter.get("/stats", authorize("Staff", "Admin", "SuperAdmin"), getOrderStatsHandler);
orderRouter.get("/:id", authorize("Staff", "Admin", "SuperAdmin"), getAdminOrderById);

// Status transition routes: Admin, SuperAdmin only
orderRouter.post("/:id/confirm", authorize("Admin", "SuperAdmin"), confirmOrderHandler);
orderRouter.post("/:id/process", authorize("Admin", "SuperAdmin"), processOrderHandler);
orderRouter.post("/:id/pack", authorize("Admin", "SuperAdmin"), packOrderHandler);
orderRouter.post("/:id/ship", authorize("Admin", "SuperAdmin"), validate(markShippedSchema), shipOrderHandler);
orderRouter.post("/:id/out-for-delivery", authorize("Admin", "SuperAdmin"), outForDeliveryOrderHandler);
orderRouter.post("/:id/deliver", authorize("Admin", "SuperAdmin"), deliverOrderHandler);
orderRouter.post("/:id/cancel", authorize("Admin", "SuperAdmin"), validate(cancelOrderSchema), cancelOrderHandler);

// Return management: Admin, SuperAdmin only
orderRouter.post("/:id/return/approve", authorize("Admin", "SuperAdmin"), approveReturnHandler);
orderRouter.post("/:id/return/reject", authorize("Admin", "SuperAdmin"), validate(rejectReturnSchema), rejectReturnHandler);

// Refund: Admin, SuperAdmin only
orderRouter.post("/:id/refund", authorize("Admin", "SuperAdmin"), validate(processRefundSchema), processRefundHandler);

export { orderRouter };
