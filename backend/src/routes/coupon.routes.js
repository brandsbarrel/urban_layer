import { Router } from "express";
import {
  activateCouponHandler,
  archiveCouponHandler,
  createCouponHandler,
  deleteCouponHandler,
  getCouponAnalyticsHandler,
  getCoupons,
  pauseCouponHandler,
  updateCouponHandler,
  validateCouponHandler
} from "../controllers/coupon.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCouponSchema, updateCouponSchema, validateCouponCodeSchema } from "../validators/coupon.validator.js";

const couponRouter = Router();

couponRouter.use(authenticate("admin"));
couponRouter.use(authorize("Admin", "SuperAdmin"));

couponRouter.get("/", getCoupons);
couponRouter.post("/", validate(createCouponSchema), createCouponHandler);
couponRouter.patch("/:id", validate(updateCouponSchema), updateCouponHandler);
couponRouter.post("/:id/activate", activateCouponHandler);
couponRouter.post("/:id/pause", pauseCouponHandler);
couponRouter.post("/:id/archive", archiveCouponHandler);
couponRouter.delete("/:id", deleteCouponHandler);
couponRouter.get("/:id/analytics", getCouponAnalyticsHandler);

const storefrontCouponRouter = Router();
storefrontCouponRouter.post("/validate", validate(validateCouponCodeSchema), validateCouponHandler);

export { couponRouter, storefrontCouponRouter };
