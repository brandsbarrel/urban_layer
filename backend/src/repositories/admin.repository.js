import { AdminModel } from "../models/index.js";

const findAdminByEmailWithPassword = (email) => {
  return AdminModel.findOne({ email }).select("+passwordHash");
};

const findAdminById = (id) => {
  return AdminModel.findById(id);
};

const updateAdminById = (id, update, options = {}) => {
  return AdminModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  });
};

const createAdmin = (payload) => {
  return AdminModel.create(payload);
};

export {
  findAdminByEmailWithPassword,
  findAdminById,
  updateAdminById,
  createAdmin
};
