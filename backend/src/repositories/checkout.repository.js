import { OrderModel } from "../models/index.js";

const createOrder = (payload, options = {}) => {
  return OrderModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const findOrdersByCustomerId = (customerId) => {
  return OrderModel.find({ customer: customerId }).sort({ createdAt: -1 });
};

export { createOrder, findOrdersByCustomerId };
