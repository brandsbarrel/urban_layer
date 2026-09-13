import { Router } from "express";
import {
  getStorefrontCategories,
  getStorefrontPhoneModels,
  getStorefrontProducts
} from "../controllers/storefront-catalog.controller.js";

const homepagePublicRouter = Router();

// GET /api/categories — active categories list
homepagePublicRouter.get("/categories", getStorefrontCategories);

// GET /api/devices — active phone models with dynamic productCount
homepagePublicRouter.get("/devices", getStorefrontPhoneModels);

// GET /api/products?tag=best-seller (and other filters)
homepagePublicRouter.get("/products", getStorefrontProducts);

export { homepagePublicRouter };
