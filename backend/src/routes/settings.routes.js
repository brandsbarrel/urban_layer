import { Router } from "express";
import { getSettingsHandler, updateSettingsHandler } from "../controllers/settings.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const settingsRouter = Router();

settingsRouter.use(authenticate("admin"));
settingsRouter.use(authorize("Admin", "SuperAdmin"));

settingsRouter.get("/", getSettingsHandler);
settingsRouter.put("/", updateSettingsHandler);
settingsRouter.patch("/", updateSettingsHandler);

export { settingsRouter };
