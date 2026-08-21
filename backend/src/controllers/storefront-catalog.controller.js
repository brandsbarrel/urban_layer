import { sendSuccess } from "../shared/api-response.js";
import {
  getStorefrontProduct,
  listStorefrontCategories,
  listStorefrontPhoneModels,
  listStorefrontProducts
} from "../services/storefront-catalog.service.js";

const getStorefrontCategories = async (req, res, next) => {
  try {
    const data = await listStorefrontCategories();
    return sendSuccess({
      res,
      message: "Categories fetched successfully.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const getStorefrontProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 20);
    const data = await listStorefrontProducts({
      page,
      perPage,
      search: req.query.search || "",
      category: req.query.category || "",
      phoneModel: req.query.phoneModel || "",
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null
    });

    return sendSuccess({
      res,
      message: "Products fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

const getStorefrontPhoneModels = async (req, res, next) => {
  try {
    const data = await listStorefrontPhoneModels();
    return sendSuccess({
      res,
      message: "Phone models fetched successfully.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const getStorefrontProductById = async (req, res, next) => {
  try {
    const product = await getStorefrontProduct(req.params.id);
    return sendSuccess({
      res,
      message: "Product fetched successfully.",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

export { getStorefrontCategories, getStorefrontPhoneModels, getStorefrontProducts, getStorefrontProductById };
