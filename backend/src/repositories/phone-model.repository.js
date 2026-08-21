import { PhoneModel } from "../models/index.js";

const findPhoneModels = ({ filter = {}, skip = 0, limit = 20, sort = { sortOrder: 1, createdAt: -1 } }) => {
  return PhoneModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countPhoneModels = (filter = {}) => {
  return PhoneModel.countDocuments(filter);
};

const findPhoneModelById = (id) => {
  return PhoneModel.findById(id);
};

const findPhoneModelBySlug = (slug) => {
  return PhoneModel.findOne({ slug });
};

const createPhoneModel = (payload, options = {}) => {
  return PhoneModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const updatePhoneModelById = (id, update, options = {}) => {
  return PhoneModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  });
};

const deletePhoneModelById = (id, options = {}) => {
  return PhoneModel.findByIdAndDelete(id, options);
};

const getMaxPhoneModelSortOrder = async () => {
  const phoneModel = await PhoneModel.findOne().sort({ sortOrder: -1 });
  return phoneModel?.sortOrder ?? -1;
};

export {
  findPhoneModels,
  countPhoneModels,
  findPhoneModelById,
  findPhoneModelBySlug,
  createPhoneModel,
  updatePhoneModelById,
  deletePhoneModelById,
  getMaxPhoneModelSortOrder
};
