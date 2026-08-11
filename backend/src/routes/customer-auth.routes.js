import { Router } from "express";
import {
  customerLogin,
  customerLogout,
  customerRegister
} from "../controllers/customer-auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { customerLoginSchema, customerRegisterSchema } from "../validators/auth.validator.js";

const customerAuthRouter = Router();

customerAuthRouter.post("/register", validate(customerRegisterSchema), customerRegister);
customerAuthRouter.post("/login", validate(customerLoginSchema), customerLogin);
customerAuthRouter.post("/logout", customerLogout);

export { customerAuthRouter };
