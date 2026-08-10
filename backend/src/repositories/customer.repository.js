import { CustomerModel } from "../models/index.js";

const findCustomerByEmailWithPassword = (email) => {
  return CustomerModel.findOne({ email }).select("+passwordHash");
};

const findCustomerById = (id) => {
  return CustomerModel.findById(id);
};

const findCustomerByIdWithPassword = (id) => {
  return CustomerModel.findById(id).select("+passwordHash");
};

const createCustomer = (payload) => {
  return CustomerModel.create(payload);
};

const updateCustomerById = (id, update, options = {}) => {
  return CustomerModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  });
};

export {
  findCustomerByEmailWithPassword,
  findCustomerById,
  findCustomerByIdWithPassword,
  createCustomer,
  updateCustomerById
};
