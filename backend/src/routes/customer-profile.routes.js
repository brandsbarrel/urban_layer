import { Router } from "express";
import {
  addCustomerAddressHandler,
  getCustomerProfileHandler,
  updateCustomerAddressHandler,
  updateCustomerProfileHandler
} from "../controllers/customer.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  customerAddressCreateSchema,
  customerAddressUpdateSchema,
  customerProfileUpdateSchema
} from "../validators/customer.validator.js";

const customerProfileRouter = Router();

customerProfileRouter.use(authenticate("customer"));
customerProfileRouter.use(authorize("Customer"));

customerProfileRouter.get("/profile", getCustomerProfileHandler);
customerProfileRouter.patch("/profile", validate(customerProfileUpdateSchema), updateCustomerProfileHandler);
customerProfileRouter.post("/addresses", validate(customerAddressCreateSchema), addCustomerAddressHandler);
customerProfileRouter.patch("/addresses/:index", validate(customerAddressUpdateSchema), updateCustomerAddressHandler);

export { customerProfileRouter };
