import { Router } from "express";
import { adminCreate, adminLogin, adminLogout, adminRefresh } from "../controllers/admin-auth.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAdminSchema, adminLoginSchema } from "../validators/auth.validator.js";

const adminAuthRouter = Router();

adminAuthRouter.post("/login", validate(adminLoginSchema), adminLogin);
adminAuthRouter.post("/refresh", adminRefresh);
adminAuthRouter.post("/logout", adminLogout);
adminAuthRouter.post(
  "/admins",
  authenticate("admin"),
  authorize("SuperAdmin"),
  validate(createAdminSchema),
  adminCreate
);

export { adminAuthRouter };
