import { Router } from "express";
import {
  createHeroSlideHandler,
  deleteHeroSlideHandler,
  getAdminHeroSlideById,
  getAdminHeroSlides,
  getPublicHeroSlides,
  updateHeroSlideHandler
} from "../controllers/hero-slide.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { heroSlideCreateSchema, heroSlideUpdateSchema } from "../validators/hero-slide.validator.js";

// Public router — no auth
const heroSlidePublicRouter = Router();
heroSlidePublicRouter.get("/", getPublicHeroSlides);

// Admin router — requires auth
const heroSlideAdminRouter = Router();
heroSlideAdminRouter.use(authenticate("admin"));
heroSlideAdminRouter.use(authorize("Admin", "SuperAdmin"));

heroSlideAdminRouter.get("/", getAdminHeroSlides);
heroSlideAdminRouter.get("/:id", getAdminHeroSlideById);
heroSlideAdminRouter.post("/", validate(heroSlideCreateSchema), createHeroSlideHandler);
heroSlideAdminRouter.put("/:id", validate(heroSlideUpdateSchema), updateHeroSlideHandler);
heroSlideAdminRouter.delete("/:id", deleteHeroSlideHandler);

export { heroSlidePublicRouter, heroSlideAdminRouter };
