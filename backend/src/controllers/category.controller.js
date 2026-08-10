import { sendSuccess } from "../shared/api-response.js";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  listCategories,
  moveCategoryRecord,
  toggleCategoryVisibility,
  updateCategoryRecord
} from "../services/category.service.js";

const getCategories = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 20);
    const data = await listCategories({
      page,
      perPage,
      search: req.query.search || "",
      status: req.query.status || "All"
    });

    return sendSuccess({
      res,
      message: "Categories fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

const createCategoryHandler = async (req, res, next) => {
  try {
    const category = await createCategoryRecord(req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Category created successfully.",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const updateCategoryHandler = async (req, res, next) => {
  try {
    const category = await updateCategoryRecord(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Category updated successfully.",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const toggleCategoryVisibilityHandler = async (req, res, next) => {
  try {
    const category = await toggleCategoryVisibility(req.params.id);
    return sendSuccess({
      res,
      message: "Category visibility updated successfully.",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const moveCategoryHandler = async (req, res, next) => {
  try {
    const category = await moveCategoryRecord(req.params.id, req.body.direction);
    return sendSuccess({
      res,
      message: "Category reordered successfully.",
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCategoryHandler = async (req, res, next) => {
  try {
    await deleteCategoryRecord({
      id: req.params.id,
      force: req.query.force === "true",
      reassignToCategoryId: req.query.reassignToCategoryId || null
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getCategories,
  createCategoryHandler,
  updateCategoryHandler,
  toggleCategoryVisibilityHandler,
  moveCategoryHandler,
  deleteCategoryHandler
};
