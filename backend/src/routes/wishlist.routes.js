import { Router } from "express";
import {
  addToWishlistHandler,
  checkWishlistStatusHandler,
  clearWishlistHandler,
  getWishlistHandler,
  removeFromWishlistHandler
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToWishlistSchema } from "../validators/wishlist.validator.js";

const wishlistRouter = Router();

wishlistRouter.use(authenticate("customer"));
wishlistRouter.use(authorize("Customer"));

wishlistRouter.get("/", getWishlistHandler);
wishlistRouter.post("/", validate(addToWishlistSchema), addToWishlistHandler);
wishlistRouter.delete("/:productId", removeFromWishlistHandler);
wishlistRouter.get("/check/:productId", checkWishlistStatusHandler);
wishlistRouter.delete("/", clearWishlistHandler);

export { wishlistRouter };