import { sendSuccess } from "../shared/api-response.js";
import {
  cancelAdminOrder,
  confirmAdminOrder,
  processAdminOrder,
  deliverAdminOrder,
  getAdminOrderDetails,
  getOrderStats,
  listAdminOrders,
  outForDeliveryAdminOrder,
  packAdminOrder,
  shipAdminOrder
} from "../services/order.service.js";

const getAdminOrders = async (req, res, next) => {
  try {
    const data = await listAdminOrders(req.query);
    return sendSuccess({
      res,
      message: "Orders fetched successfully.",
      data: { items: data.items },
      meta: data.meta
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await getAdminOrderDetails(req.params.id);
    return sendSuccess({
      res,
      message: "Order fetched successfully.",
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

const confirmOrderHandler = async (req, res, next) => {
  try {
    const order = await confirmAdminOrder(req.params.id);
    return sendSuccess({ res, message: "Order confirmed successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const processOrderHandler = async (req, res, next) => {
  try {
    const order = await processAdminOrder(req.params.id);
    return sendSuccess({ res, message: "Order processing started successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const packOrderHandler = async (req, res, next) => {
  try {
    const order = await packAdminOrder(req.params.id);
    return sendSuccess({ res, message: "Order packed successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const shipOrderHandler = async (req, res, next) => {
  try {
    const order = await shipAdminOrder(req.params.id, req.body);
    return sendSuccess({ res, message: "Order marked as shipped successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const outForDeliveryOrderHandler = async (req, res, next) => {
  try {
    const order = await outForDeliveryAdminOrder(req.params.id);
    return sendSuccess({ res, message: "Order marked out for delivery successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const deliverOrderHandler = async (req, res, next) => {
  try {
    const order = await deliverAdminOrder(req.params.id);
    return sendSuccess({ res, message: "Order delivered successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const cancelOrderHandler = async (req, res, next) => {
  try {
    const order = await cancelAdminOrder(req.params.id, req.body.reason, req.user?.role || "admin", req.user?._id || null);
    return sendSuccess({ res, message: "Order cancelled successfully.", data: order });
  } catch (error) {
    return next(error);
  }
};

const getOrderStatsHandler = async (req, res, next) => {
  try {
    const stats = await getOrderStats();
    return sendSuccess({ res, message: "Order stats fetched successfully.", data: { items: stats } });
  } catch (error) {
    return next(error);
  }
};

export {
  getAdminOrders,
  getAdminOrderById,
  confirmOrderHandler,
  processOrderHandler,
  packOrderHandler,
  shipOrderHandler,
  outForDeliveryOrderHandler,
  deliverOrderHandler,
  cancelOrderHandler,
  getOrderStatsHandler
};
