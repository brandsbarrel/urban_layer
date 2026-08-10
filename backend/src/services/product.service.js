import { ConflictError, NotFoundError } from "../shared/app-error.js";
import {
  countProducts,
  createProduct,
  deleteProductById,
  findProductById,
  findProductBySku,
  findProducts,
  findProductBySlug,
  updateProductById
} from "../repositories/product.repository.js";
import { buildPaginationMeta } from "../utils/pagination.js";
import { computeSeoScore } from "../utils/seo-score.js";
import { slugify } from "../utils/slugify.js";

const mapProductStatusForTable = (product) => {
  if (product.status === "Archived") {
    return "Archived";
  }

  if (product.status === "Draft") {
    return "Draft";
  }

  if (product.stock <= 0) {
    return "Out of Stock";
  }

  if (product.stock <= 20) {
    return "Low Stock";
  }

  return "Active";
};

const mapProductToAdminListItem = (product) => {
  const primaryCategory = product.categories?.[0]?.name || "Uncategorized";
  const effectivePrice = product.salePrice ?? product.basePrice;

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: primaryCategory,
    collectionLabel: product.collection ? product.collection.toUpperCase() : "",
    price: effectivePrice / 100,
    stock: product.stock,
    unfulfilledOrders: product.unfulfilledOrders,
    status: mapProductStatusForTable(product),
    image: product.featuredImage || product.gallery?.[0]?.url || "",
    description: product.description,
    variants: product.variants,
    activity: product.activity.map((entry) => ({
      id: entry._id.toString(),
      message: entry.message,
      meta: entry.meta
    }))
  };
};

const mapProductToFormShape = (product) => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    featuredImage: product.featuredImage,
    status: product.status,
    visibility: product.visibility,
    basePrice: String(product.basePrice / 100),
    salePrice: product.salePrice ? String(product.salePrice / 100) : "",
    totalStock: product.stock,
    trackStock: product.trackStock,
    categories: product.categories.map((category) => category.name),
    categoryIds: product.categories.map((category) => category.id),
    collection: product.collection,
    tags: product.tags,
    weight: product.weight ?? "",
    length: product.length ?? "",
    width: product.width ?? "",
    height: product.height ?? "",
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    variants: product.variants
  };
};

const listProducts = async ({ page = 1, perPage = 10, search = "" }) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * perPage;
  const [items, totalItems] = await Promise.all([
    findProducts({ filter, skip, limit: perPage }),
    countProducts(filter)
  ]);

  return {
    items: items.map(mapProductToAdminListItem),
    meta: buildPaginationMeta({ page, perPage, totalItems })
  };
};

const getProductDetails = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  return {
    listItem: mapProductToAdminListItem(product),
    form: mapProductToFormShape(product)
  };
};

const createProductRecord = async (payload) => {
  const slug = slugify(payload.slug || payload.name);

  const [existingSlug, existingSku] = await Promise.all([
    findProductBySlug(slug),
    findProductBySku(payload.sku)
  ]);

  if (existingSlug) {
    throw new ConflictError({ message: "Product slug already exists." });
  }

  if (existingSku) {
    throw new ConflictError({ message: "Product SKU already exists." });
  }

  const seoScore = computeSeoScore({
    title: payload.seoTitle,
    description: payload.seoDescription,
    image: payload.featuredImage,
    slug,
    name: payload.name
  });

  const product = await createProduct({
    ...payload,
    slug,
    basePrice: Math.round(payload.basePrice * 100),
    salePrice: payload.salePrice == null ? null : Math.round(payload.salePrice * 100),
    costPrice: payload.costPrice == null ? null : Math.round(payload.costPrice * 100),
    seoScore
  });

  return getProductDetails(product.id);
};

const updateProductRecord = async (id, payload) => {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  const slug = slugify(payload.slug || product.slug || payload.name || product.name);

  if (payload.sku && payload.sku !== product.sku) {
    const existingSku = await findProductBySku(payload.sku);
    if (existingSku && existingSku.id !== id) {
      throw new ConflictError({ message: "Product SKU already exists." });
    }
  }

  if (slug !== product.slug) {
    const existingSlug = await findProductBySlug(slug);
    if (existingSlug && existingSlug.id !== id) {
      throw new ConflictError({ message: "Product slug already exists." });
    }
  }

  const updated = await updateProductById(id, {
    ...payload,
    slug,
    basePrice: payload.basePrice == null ? product.basePrice : Math.round(payload.basePrice * 100),
    salePrice: payload.salePrice === undefined
      ? product.salePrice
      : payload.salePrice === null
        ? null
        : Math.round(payload.salePrice * 100),
    costPrice: payload.costPrice === undefined
      ? product.costPrice
      : payload.costPrice === null
        ? null
        : Math.round(payload.costPrice * 100),
    seoScore: computeSeoScore({
      title: payload.seoTitle ?? product.seoTitle,
      description: payload.seoDescription ?? product.seoDescription,
      image: payload.featuredImage ?? product.featuredImage,
      slug,
      name: payload.name ?? product.name
    })
  });

  return {
    listItem: mapProductToAdminListItem(updated),
    form: mapProductToFormShape(updated)
  };
};

const archiveProductRecord = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  const updated = await updateProductById(id, {
    status: "Archived",
    archivedAt: new Date()
  });

  return mapProductToAdminListItem(updated);
};

const deleteProductRecord = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  await deleteProductById(id);
};

export {
  listProducts,
  getProductDetails,
  createProductRecord,
  updateProductRecord,
  archiveProductRecord,
  deleteProductRecord
};
