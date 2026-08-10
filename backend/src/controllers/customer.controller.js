import { sendSuccess } from "../shared/api-response.js";
import {
  addCustomerAddress,
  bulkDeactivateAdminCustomers,
  deactivateAdminCustomer,
  deleteAdminCustomer,
  getAdminCustomerDetails,
  getCustomerProfile,
  listAdminCustomers,
  updateAdminCustomer,
  updateCustomerAddress,
  updateCustomerProfile
} from "../services/customer.service.js";

const getAdminCustomers = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 20);
    const data = await listAdminCustomers({
      page,
      perPage,
      search: req.query.search || "",
      vipStatus: req.query.vipStatus || "All",
      region: req.query.region || "All"
    });

    return sendSuccess({
      res,
      message: "Customers fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminCustomerById = async (req, res, next) => {
  try {
    const customer = await getAdminCustomerDetails(req.params.id);
    return sendSuccess({
      res,
      message: "Customer fetched successfully.",
      data: customer
    });
  } catch (error) {
    return next(error);
  }
};

const updateAdminCustomerHandler = async (req, res, next) => {
  try {
    const customer = await updateAdminCustomer(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Customer updated successfully.",
      data: customer
    });
  } catch (error) {
    return next(error);
  }
};

const deactivateAdminCustomerHandler = async (req, res, next) => {
  try {
    const customer = await deactivateAdminCustomer(req.params.id);
    return sendSuccess({
      res,
      message: "Customer deactivated successfully.",
      data: customer
    });
  } catch (error) {
    return next(error);
  }
};

const bulkDeactivateCustomersHandler = async (req, res, next) => {
  try {
    const customers = await bulkDeactivateAdminCustomers(req.body.ids);
    return sendSuccess({
      res,
      message: "Customers deactivated successfully.",
      data: { items: customers }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAdminCustomerHandler = async (req, res, next) => {
  try {
    await deleteAdminCustomer(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const getCustomerProfileHandler = async (req, res, next) => {
  try {
    const profile = await getCustomerProfile(req.user.id);
    return sendSuccess({
      res,
      message: "Customer profile fetched successfully.",
      data: profile
    });
  } catch (error) {
    return next(error);
  }
};

const updateCustomerProfileHandler = async (req, res, next) => {
  try {
    const profile = await updateCustomerProfile(req.user.id, req.body);
    return sendSuccess({
      res,
      message: "Customer profile updated successfully.",
      data: profile
    });
  } catch (error) {
    return next(error);
  }
};

const addCustomerAddressHandler = async (req, res, next) => {
  try {
    const addresses = await addCustomerAddress(req.user.id, req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Address added successfully.",
      data: { items: addresses }
    });
  } catch (error) {
    return next(error);
  }
};

const updateCustomerAddressHandler = async (req, res, next) => {
  try {
    const addresses = await updateCustomerAddress(req.user.id, Number(req.params.index), req.body);
    return sendSuccess({
      res,
      message: "Address updated successfully.",
      data: { items: addresses }
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getAdminCustomers,
  getAdminCustomerById,
  updateAdminCustomerHandler,
  deactivateAdminCustomerHandler,
  bulkDeactivateCustomersHandler,
  deleteAdminCustomerHandler,
  getCustomerProfileHandler,
  updateCustomerProfileHandler,
  addCustomerAddressHandler,
  updateCustomerAddressHandler
};
