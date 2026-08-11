import { CartModel } from "../models/index.js";

const findCartByCustomerId = (customerId) => {
  return CartModel.findOne({ customer: customerId }).populate("items.product");
};

const createCart = (payload, options = {}) => {
  return CartModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const updateCartByCustomerId = (customerId, update, options = {}) => {
  return CartModel.findOneAndUpdate(
    { customer: customerId },
    update,
    {
      new: true,
      upsert: true,
      ...options
    }
  ).populate("items.product");
};

export { findCartByCustomerId, createCart, updateCartByCustomerId };
