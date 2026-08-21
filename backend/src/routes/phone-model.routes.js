import { Router } from "express";
import {
  createPhoneModelHandler,
  deletePhoneModelHandler,
  getPhoneModels,
  togglePhoneModelActiveHandler,
  updatePhoneModelHandler
} from "../controllers/phone-model.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  phoneModelCreateSchema,
  phoneModelListQuerySchema,
  phoneModelUpdateSchema
} from "../validators/phone-model.validator.js";

const phoneModelRouter = Router();

phoneModelRouter.use(authenticate("admin"));
phoneModelRouter.use(authorize("Admin", "SuperAdmin"));

phoneModelRouter.get("/", validate(phoneModelListQuerySchema, "query"), getPhoneModels);
phoneModelRouter.post("/", validate(phoneModelCreateSchema), createPhoneModelHandler);
phoneModelRouter.patch("/:id", validate(phoneModelUpdateSchema), updatePhoneModelHandler);
phoneModelRouter.post("/:id/toggle-active", togglePhoneModelActiveHandler);
phoneModelRouter.delete("/:id", deletePhoneModelHandler);

export { phoneModelRouter };
