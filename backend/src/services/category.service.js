import mongoose from "mongoose";
import { ConflictError, NotFoundError } from "../shared/app-error.js";
import {
  countCategories,
  createCategory,
  deleteCategoryById,
  findCategories,
  findCategoryById,
  findCategoryBySlug,
  getMaxCategorySortOrder,
  updateCategoryById
} from "../repositories/category.repository.js";
import { countProductsByCategoryId, reassignProductsFromCategory } from "../repositories/product.repository.js";
import { buildPaginationMeta } from "../utils/pagination.js";
import { computeSeoScore } from "../utils/seo-score.js";
import { slugify } from "../utils/slugify.js";

const mapCategoryToAdminListItem = (category) => {
  const parentName = category.parent?.name || "Root";

  return {
    id: category.id,
    name: category.name,
    breadcrumb: parentName === "Root" ? "Root" : parentName,
    slug: `/${category.slug}`,
    productsAssigned: category.productsAssignedCount,
    seoScore: category.seoScore,
    status: category.status,
    image: category.image || "",
    phoneModels: category.phoneModels || [],
    parentId: category.parent?._id?.toString() || null,
    description: category.description,
    seoTitle: category.seoTitle,
    seoDescription: category.seoDescription
  };
};

const listCategories = async ({ page = 1, perPage = 20, search = "", status = "All" }) => {
  const filter = {};

  if (status !== "All") {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * perPage;
  const [items, totalItems] = await Promise.all([
    findCategories({ filter, skip, limit: perPage }),
    countCategories(filter)
  ]);

  return {
    items: items.map(mapCategoryToAdminListItem),
    meta: buildPaginationMeta({ page, perPage, totalItems })
  };
};

const createCategoryRecord = async (payload) => {
  const slug = slugify(payload.slug || payload.name);
  const existing = await findCategoryBySlug(slug);

  if (existing) {
    throw new ConflictError({ message: "Category slug already exists." });
  }

  const sortOrder = (await getMaxCategorySortOrder()) + 1;
  const seoScore = computeSeoScore({
    title: payload.seoTitle,
    description: payload.seoDescription,
    image: payload.image,
    slug,
    name: payload.name
  });

  const category = await createCategory({
    ...payload,
    slug,
    seoScore,
    sortOrder
  });

  return findCategoryById(category.id).then(mapCategoryToAdminListItem);
};

const updateCategoryRecord = async (id, payload) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Category not found.");
  }

  const slug = slugify(payload.slug || category.slug || payload.name || category.name);

  if (slug !== category.slug) {
    const existing = await findCategoryBySlug(slug);
    if (existing && existing.id !== id) {
      throw new ConflictError({ message: "Category slug already exists." });
    }
  }

  const nextPayload = {
    ...payload,
    slug,
    seoScore: computeSeoScore({
      title: payload.seoTitle ?? category.seoTitle,
      description: payload.seoDescription ?? category.seoDescription,
      image: payload.image ?? category.image,
      slug,
      name: payload.name ?? category.name
    })
  };

  const updated = await updateCategoryById(id, nextPayload);
  return mapCategoryToAdminListItem(updated);
};

const toggleCategoryVisibility = async (id) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Category not found.");
  }

  const updated = await updateCategoryById(id, {
    status: category.status === "Hidden" ? "Active" : "Hidden"
  });

  return mapCategoryToAdminListItem(updated);
};

const moveCategoryRecord = async (id, direction) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Category not found.");
  }

  const neighbor = await mongoose.model("Category")
    .findOne(direction === "up"
      ? { sortOrder: { $lt: category.sortOrder } }
      : { sortOrder: { $gt: category.sortOrder } })
    .sort(direction === "up" ? { sortOrder: -1 } : { sortOrder: 1 });

  if (!neighbor) {
    return mapCategoryToAdminListItem(category);
  }

  const currentSortOrder = category.sortOrder;
  await Promise.all([
    updateCategoryById(category.id, { sortOrder: neighbor.sortOrder }),
    updateCategoryById(neighbor.id, { sortOrder: currentSortOrder })
  ]);

  return findCategoryById(id).then(mapCategoryToAdminListItem);
};

const deleteCategoryRecord = async ({ id, force = false, reassignToCategoryId = null }) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Category not found.");
  }

  const productsAssignedCount = await countProductsByCategoryId(id);

  if (productsAssignedCount > 0 && !force) {
    throw new ConflictError({
      message: "Category has assigned products.",
      details: {
        requiresReassignment: true,
        productsAssignedCount
      }
    });
  }

  if (productsAssignedCount > 0 && force && !reassignToCategoryId) {
    throw new ConflictError({
      message: "Reassignment category is required.",
      details: {
        requiresReassignment: true,
        productsAssignedCount
      }
    });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (productsAssignedCount > 0) {
        await reassignProductsFromCategory(
          new mongoose.Types.ObjectId(id),
          new mongoose.Types.ObjectId(reassignToCategoryId),
          { session }
        );
      }

      await deleteCategoryById(id, { session });
    });
  } finally {
    await session.endSession();
  }
};

export {
  listCategories,
  createCategoryRecord,
  updateCategoryRecord,
  toggleCategoryVisibility,
  moveCategoryRecord,
  deleteCategoryRecord
};
