import mongoose from "mongoose";
import { ProductModel } from "../models/index.js";

const buildProductQuery = () => {
  return ProductModel.find().populate("categories").populate("phoneModelId");
};

const findProducts = ({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) => {
  return ProductModel.find(filter)
    .populate("categories")
    .populate("phoneModelId")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countProducts = (filter = {}) => {
  return ProductModel.countDocuments(filter);
};

const findProductById = (id) => {
  if (!id) return Promise.resolve(null);
  if (mongoose.Types.ObjectId.isValid(id)) {
    return ProductModel.findById(id).populate("categories").populate("phoneModelId");
  }
  return ProductModel.findOne({ slug: id }).populate("categories").populate("phoneModelId");
};

const findProductBySlug = (slug) => {
  return ProductModel.findOne({ slug });
};

const findProductBySku = (sku) => {
  return ProductModel.findOne({ sku });
};

const createProduct = (payload, options = {}) => {
  return ProductModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const updateProductById = (id, update, options = {}) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return ProductModel.findByIdAndUpdate(id, update, {
      new: true,
      ...options
    }).populate("categories").populate("phoneModelId");
  }
  return ProductModel.findOneAndUpdate({ slug: id }, update, {
    new: true,
    ...options
  }).populate("categories").populate("phoneModelId");
};

const deleteProductById = (id, options = {}) => {
  return ProductModel.findByIdAndDelete(id, options);
};

const countProductsByCategoryId = (categoryId) => {
  return ProductModel.countDocuments({ categories: categoryId });
};

const countProductsByPhoneModelId = (phoneModelId) => {
  return ProductModel.countDocuments({ phoneModelId });
};

const reassignProductsFromCategory = (fromCategoryId, toCategoryId, options = {}) => {
  return ProductModel.updateMany(
    { categories: fromCategoryId },
    [
      {
        $set: {
          categories: {
            $setUnion: [
              {
                $filter: {
                  input: "$categories",
                  as: "categoryId",
                  cond: { $ne: ["$$categoryId", fromCategoryId] }
                }
              },
              [toCategoryId]
            ]
          }
        }
      }
    ],
    options
  );
};

export {
  buildProductQuery,
  findProducts,
  countProducts,
  findProductById,
  findProductBySlug,
  findProductBySku,
  createProduct,
  updateProductById,
  deleteProductById,
  countProductsByCategoryId,
  countProductsByPhoneModelId,
  reassignProductsFromCategory
};
