import mongoose from "mongoose";
import { CATEGORY_STATUSES } from "../constants/index.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    phoneModels: {
      type: [String],
      default: []
    },
    seoTitle: {
      type: String,
      trim: true,
      default: ""
    },
    seoDescription: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: CATEGORY_STATUSES,
      default: "Active"
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    productsAssignedCount: {
      type: Number,
      default: 0
    },
    seoScore: {
      type: Number,
      default: 0
    },
    archivedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ sortOrder: 1 });

const CategoryModel = mongoose.model("Category", categorySchema);

export { CategoryModel };
