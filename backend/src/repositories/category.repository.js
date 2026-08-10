import { CategoryModel } from "../models/index.js";

const findCategories = ({ filter = {}, skip = 0, limit = 20, sort = { sortOrder: 1, createdAt: -1 } }) => {
  return CategoryModel.find(filter)
    .populate("parent")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countCategories = (filter = {}) => {
  return CategoryModel.countDocuments(filter);
};

const findCategoryById = (id) => {
  return CategoryModel.findById(id).populate("parent");
};

const findCategoryBySlug = (slug) => {
  return CategoryModel.findOne({ slug });
};

const createCategory = (payload, options = {}) => {
  return CategoryModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const updateCategoryById = (id, update, options = {}) => {
  return CategoryModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  }).populate("parent");
};

const deleteCategoryById = (id, options = {}) => {
  return CategoryModel.findByIdAndDelete(id, options);
};

const getMaxCategorySortOrder = async () => {
  const category = await CategoryModel.findOne().sort({ sortOrder: -1 });
  return category?.sortOrder ?? -1;
};

export {
  findCategories,
  countCategories,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getMaxCategorySortOrder
};
