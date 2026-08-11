import { OrderModel } from "../models/index.js";

const findAdminOrders = ({ filter = {}, skip = 0, limit = 20, sort = { createdAt: -1 } }) => {
  return OrderModel.find(filter)
    .populate("customer")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countAdminOrders = (filter = {}) => {
  return OrderModel.countDocuments(filter);
};

const findAdminOrderById = (id) => {
  return OrderModel.findById(id).populate("customer");
};

const updateAdminOrderById = (id, update, options = {}) => {
  return OrderModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  }).populate("customer");
};

const findAdminOrderByGatewayOrderId = (paymentGatewayOrderId) => {
  return OrderModel.findOne({ paymentGatewayOrderId }).populate("customer");
};

export {
  findAdminOrders,
  countAdminOrders,
  findAdminOrderById,
  updateAdminOrderById,
  findAdminOrderByGatewayOrderId
};
