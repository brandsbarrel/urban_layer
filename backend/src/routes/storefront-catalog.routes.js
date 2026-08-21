import { Router } from "express";
import {
  getStorefrontCategories,
  getStorefrontPhoneModels,
  getStorefrontProductById,
  getStorefrontProducts
} from "../controllers/storefront-catalog.controller.js";

const storefrontCatalogRouter = Router();

storefrontCatalogRouter.get("/categories", getStorefrontCategories);
storefrontCatalogRouter.get("/phone-models", getStorefrontPhoneModels);
storefrontCatalogRouter.get("/products", getStorefrontProducts);
storefrontCatalogRouter.get("/products/:id", getStorefrontProductById);

export { storefrontCatalogRouter };
