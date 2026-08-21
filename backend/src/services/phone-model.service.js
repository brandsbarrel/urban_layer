import { ConflictError, NotFoundError } from "../shared/app-error.js";
import {
  countPhoneModels,
  createPhoneModel,
  deletePhoneModelById,
  findPhoneModelById,
  findPhoneModelBySlug,
  findPhoneModels,
  getMaxPhoneModelSortOrder,
  updatePhoneModelById
} from "../repositories/phone-model.repository.js";
import { countProductsByPhoneModelId } from "../repositories/product.repository.js";
import { buildPaginationMeta } from "../utils/pagination.js";
import { slugify } from "../utils/slugify.js";

const mapPhoneModel = async (phoneModel) => {
  const productsAssigned = await countProductsByPhoneModelId(phoneModel.id);

  return {
    id: phoneModel.id,
    brand: phoneModel.brand,
    name: phoneModel.name,
    slug: phoneModel.slug,
    active: phoneModel.active,
    sortOrder: phoneModel.sortOrder,
    productsAssigned
  };
};

const mapPhoneModels = async (phoneModels) => {
  return Promise.all(phoneModels.map(mapPhoneModel));
};

const listPhoneModels = async ({ page = 1, perPage = 20, search = "", active = "All" }) => {
  const filter = {};

  if (active !== "All") {
    filter.active = active === "true";
  }

  if (search) {
    filter.$or = [
      { brand: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * perPage;
  const [items, totalItems] = await Promise.all([
    findPhoneModels({ filter, skip, limit: perPage }),
    countPhoneModels(filter)
  ]);

  return {
    items: await mapPhoneModels(items),
    meta: buildPaginationMeta({ page, perPage, totalItems })
  };
};

const createPhoneModelRecord = async (payload) => {
  const slug = slugify(payload.slug || `${payload.brand} ${payload.name}`);
  const existing = await findPhoneModelBySlug(slug);

  if (existing) {
    throw new ConflictError({ message: "Phone model slug already exists." });
  }

  const sortOrder = payload.sortOrder ?? (await getMaxPhoneModelSortOrder()) + 1;
  const phoneModel = await createPhoneModel({
    ...payload,
    slug,
    sortOrder
  });

  return mapPhoneModel(phoneModel);
};

const updatePhoneModelRecord = async (id, payload) => {
  const phoneModel = await findPhoneModelById(id);

  if (!phoneModel) {
    throw new NotFoundError("Phone model not found.");
  }

  const slug = slugify(payload.slug || phoneModel.slug || `${payload.brand || phoneModel.brand} ${payload.name || phoneModel.name}`);

  if (slug !== phoneModel.slug) {
    const existing = await findPhoneModelBySlug(slug);
    if (existing && existing.id !== id) {
      throw new ConflictError({ message: "Phone model slug already exists." });
    }
  }

  const updated = await updatePhoneModelById(id, {
    ...payload,
    slug
  });

  return mapPhoneModel(updated);
};

const togglePhoneModelActive = async (id) => {
  const phoneModel = await findPhoneModelById(id);

  if (!phoneModel) {
    throw new NotFoundError("Phone model not found.");
  }

  const updated = await updatePhoneModelById(id, {
    active: !phoneModel.active
  });

  return mapPhoneModel(updated);
};

const deletePhoneModelRecord = async (id) => {
  const phoneModel = await findPhoneModelById(id);

  if (!phoneModel) {
    throw new NotFoundError("Phone model not found.");
  }

  const productsAssigned = await countProductsByPhoneModelId(id);

  if (productsAssigned > 0) {
    throw new ConflictError({
      message: "Phone model has assigned products.",
      details: { productsAssigned }
    });
  }

  await deletePhoneModelById(id);
};

export {
  listPhoneModels,
  createPhoneModelRecord,
  updatePhoneModelRecord,
  togglePhoneModelActive,
  deletePhoneModelRecord
};
