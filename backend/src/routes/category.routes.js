import { Router } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategories,
  moveCategoryHandler,
  toggleCategoryVisibilityHandler,
  updateCategoryHandler
} from "../controllers/category.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categoryCreateSchema, categoryMoveSchema, categoryUpdateSchema } from "../validators/catalog.validator.js";

const categoryRouter = Router();

categoryRouter.use(authenticate("admin"));
categoryRouter.use(authorize("Admin", "SuperAdmin"));

categoryRouter.get("/", getCategories);
categoryRouter.post("/", validate(categoryCreateSchema), createCategoryHandler);
categoryRouter.patch("/:id", validate(categoryUpdateSchema), updateCategoryHandler);
categoryRouter.post("/:id/toggle-visibility", toggleCategoryVisibilityHandler);
categoryRouter.post("/:id/move", validate(categoryMoveSchema), moveCategoryHandler);
categoryRouter.delete("/:id", deleteCategoryHandler);

export { categoryRouter };
