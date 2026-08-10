import { Router } from "express";
import {
  archiveProductHandler,
  createProductHandler,
  deleteProductHandler,
  getProductById,
  getProducts,
  updateProductHandler
} from "../controllers/product.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productCreateSchema, productUpdateSchema } from "../validators/catalog.validator.js";

const productRouter = Router();

productRouter.use(authenticate("admin"));
productRouter.use(authorize("Admin", "SuperAdmin"));

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", validate(productCreateSchema), createProductHandler);
productRouter.patch("/:id", validate(productUpdateSchema), updateProductHandler);
productRouter.post("/:id/archive", archiveProductHandler);
productRouter.delete("/:id", deleteProductHandler);

export { productRouter };
