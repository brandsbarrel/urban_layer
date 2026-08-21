import { sendSuccess } from "../shared/api-response.js";
import {
  createPhoneModelRecord,
  deletePhoneModelRecord,
  listPhoneModels,
  togglePhoneModelActive,
  updatePhoneModelRecord
} from "../services/phone-model.service.js";

const getPhoneModels = async (req, res, next) => {
  try {
    // Use validated query if available (from validate middleware), fallback to req.query
    const query = req.validatedQuery || req.query;
    const data = await listPhoneModels(query);
    return sendSuccess({
      res,
      message: "Phone models fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

const createPhoneModelHandler = async (req, res, next) => {
  try {
    const phoneModel = await createPhoneModelRecord(req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Phone model created successfully.",
      data: phoneModel
    });
  } catch (error) {
    return next(error);
  }
};

const updatePhoneModelHandler = async (req, res, next) => {
  try {
    const phoneModel = await updatePhoneModelRecord(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Phone model updated successfully.",
      data: phoneModel
    });
  } catch (error) {
    return next(error);
  }
};

const togglePhoneModelActiveHandler = async (req, res, next) => {
  try {
    const phoneModel = await togglePhoneModelActive(req.params.id);
    return sendSuccess({
      res,
      message: "Phone model status updated successfully.",
      data: phoneModel
    });
  } catch (error) {
    return next(error);
  }
};

const deletePhoneModelHandler = async (req, res, next) => {
  try {
    await deletePhoneModelRecord(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getPhoneModels,
  createPhoneModelHandler,
  updatePhoneModelHandler,
  togglePhoneModelActiveHandler,
  deletePhoneModelHandler
};
