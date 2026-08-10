import { Router } from "express";
import {
  bulkDeactivateCustomersHandler,
  deactivateAdminCustomerHandler,
  deleteAdminCustomerHandler,
  getAdminCustomerById,
  getAdminCustomers,
  updateAdminCustomerHandler
} from "../controllers/customer.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { adminCustomerUpdateSchema, bulkDeactivateSchema } from "../validators/customer.validator.js";

const adminCustomerRouter = Router();

adminCustomerRouter.use(authenticate("admin"));
adminCustomerRouter.use(authorize("Admin", "SuperAdmin"));

adminCustomerRouter.get("/", getAdminCustomers);
adminCustomerRouter.get("/:id", getAdminCustomerById);
adminCustomerRouter.patch("/:id", validate(adminCustomerUpdateSchema), updateAdminCustomerHandler);
adminCustomerRouter.post("/:id/deactivate", deactivateAdminCustomerHandler);
adminCustomerRouter.post("/bulk/deactivate", validate(bulkDeactivateSchema), bulkDeactivateCustomersHandler);
adminCustomerRouter.delete("/:id", deleteAdminCustomerHandler);

export { adminCustomerRouter };
