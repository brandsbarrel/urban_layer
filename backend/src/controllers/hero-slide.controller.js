import { sendSuccess } from "../shared/api-response.js";
import {
  createHeroSlideRecord,
  deleteHeroSlideRecord,
  getHeroSlideById,
  listActiveHeroSlides,
  listAllHeroSlides,
  updateHeroSlideRecord
} from "../services/hero-slide.service.js";

// Public: GET /api/hero-slides — active + within date range
const getPublicHeroSlides = async (req, res, next) => {
  try {
    const data = await listActiveHeroSlides();
    return sendSuccess({
      res,
      message: "Hero slides fetched successfully.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: GET /api/admin/hero-slides
const getAdminHeroSlides = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 20);
    const data = await listAllHeroSlides({ page, perPage });
    return sendSuccess({
      res,
      message: "Hero slides fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: GET /api/admin/hero-slides/:id
const getAdminHeroSlideById = async (req, res, next) => {
  try {
    const slide = await getHeroSlideById(req.params.id);
    return sendSuccess({
      res,
      message: "Hero slide fetched successfully.",
      data: slide
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: POST /api/admin/hero-slides
const createHeroSlideHandler = async (req, res, next) => {
  try {
    const slide = await createHeroSlideRecord(req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Hero slide created successfully.",
      data: slide
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: PUT /api/admin/hero-slides/:id
const updateHeroSlideHandler = async (req, res, next) => {
  try {
    const slide = await updateHeroSlideRecord(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Hero slide updated successfully.",
      data: slide
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: DELETE /api/admin/hero-slides/:id
const deleteHeroSlideHandler = async (req, res, next) => {
  try {
    await deleteHeroSlideRecord(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getPublicHeroSlides,
  getAdminHeroSlides,
  getAdminHeroSlideById,
  createHeroSlideHandler,
  updateHeroSlideHandler,
  deleteHeroSlideHandler
};
