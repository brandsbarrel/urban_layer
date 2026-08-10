import { Router } from "express";
import {
  addCustomerCartItem,
  checkoutCustomerCart,
  getCustomerCart,
  removeCustomerCartItem,
  updateCustomerCartItem
} from "../controllers/cart.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { checkoutSchema, cartItemSchema } from "../validators/checkout.validator.js";

const cartRouter = Router();

cartRouter.use(authenticate("customer"));
cartRouter.use(authorize("Customer"));

cartRouter.get("/", getCustomerCart);
cartRouter.post("/items", validate(cartItemSchema), addCustomerCartItem);
cartRouter.patch("/items/:productId", validate(cartItemSchema.pick({ quantity: true })), updateCustomerCartItem);
cartRouter.delete("/items/:productId", removeCustomerCartItem);
cartRouter.post("/checkout", validate(checkoutSchema), checkoutCustomerCart);

export { cartRouter };
