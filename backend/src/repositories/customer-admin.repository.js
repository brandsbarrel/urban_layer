import { CustomerModel } from "../models/index.js";

const findCustomers = ({ filter = {}, skip = 0, limit = 20, sort = { createdAt: -1 } }) => {
  return CustomerModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countCustomers = (filter = {}) => {
  return CustomerModel.countDocuments(filter);
};

const deleteCustomerById = (id) => {
  return CustomerModel.findByIdAndDelete(id);
};

const findCustomerByEmail = (email) => {
  return CustomerModel.findOne({ email });
};

export { findCustomers, countCustomers, deleteCustomerById, findCustomerByEmail };
