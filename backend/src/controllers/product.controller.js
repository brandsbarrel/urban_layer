import { sendSuccess } from "../shared/api-response.js";
import {
  archiveProductRecord,
  createProductRecord,
  deleteProductRecord,
  getProductDetails,
  listProducts,
  updateProductRecord
} from "../services/product.service.js";

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const data = await listProducts({
      page,
      perPage,
      search: req.query.search || ""
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

const getProductById = async (req, res, next) => {
  try {
    const product = await getProductDetails(req.params.id);
    return sendSuccess({
      res,
      message: "Product fetched successfully.",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const createProductHandler = async (req, res, next) => {
  try {
    const product = await createProductRecord(req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Product created successfully.",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const updateProductHandler = async (req, res, next) => {
  try {
    const product = await updateProductRecord(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Product updated successfully.",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const archiveProductHandler = async (req, res, next) => {
  try {
    const product = await archiveProductRecord(req.params.id);
    return sendSuccess({
      res,
      message: "Product archived successfully.",
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProductHandler = async (req, res, next) => {
  try {
    await deleteProductRecord(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProductHandler,
  updateProductHandler,
  archiveProductHandler,
  deleteProductHandler
};
