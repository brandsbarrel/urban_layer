import { countProducts, findProductById, findProducts } from "../repositories/product.repository.js";
import { findCategories } from "../repositories/category.repository.js";
import { findPhoneModels } from "../repositories/phone-model.repository.js";
import { NotFoundError } from "../shared/app-error.js";
import { buildPaginationMeta } from "../utils/pagination.js";

const mapStorefrontCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image || "",
  phoneModels: category.phoneModels || [],
  productsAssigned: category.productsAssignedCount
});

const mapStorefrontProduct = (product) => {
  const phoneModel = product.phoneModelId
    ? {
        id: product.phoneModelId.id,
        brand: product.phoneModelId.brand,
        name: product.phoneModelId.name,
        slug: product.phoneModelId.slug
      }
    : null;
  const images = [
    product.featuredImage,
    ...(product.gallery || []).sort((a, b) => a.order - b.order).map((image) => image.url)
  ].filter(Boolean);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    phoneModel,
    phoneModelId: phoneModel?.id || "",
    description: product.description,
    categories: (product.categories || []).map(mapStorefrontCategory),
    collection: product.collection,
    tags: product.tags,
    images,
    featuredImage: images[0] || "",
    basePrice: product.basePrice / 100,
    salePrice: product.salePrice == null ? null : product.salePrice / 100,
    price: (product.salePrice ?? product.basePrice) / 100,
    stock: product.stock,
    inStock: product.stock > 0,
    weight: product.weight,
    dimensions: {
      length: product.length,
      width: product.width,
      height: product.height
    },
    packageType: product.packageType,
    shippingClass: product.shippingClass,
    fragile: product.fragile
  };
};

const listStorefrontCategories = async () => {
  const categories = await findCategories({
    filter: { status: "Active" },
    limit: 500
  });

  return { items: categories.map(mapStorefrontCategory) };
};

const listStorefrontPhoneModels = async () => {
  const phoneModels = await findPhoneModels({
    filter: { active: true },
    limit: 500
  });

  return {
    items: phoneModels.map((phoneModel) => ({
      id: phoneModel.id,
      brand: phoneModel.brand,
      name: phoneModel.name,
      slug: phoneModel.slug
    }))
  };
};

const listStorefrontProducts = async ({ page = 1, perPage = 20, search = "", category = "", phoneModel = "", maxPrice = null }) => {
  const filter = {
    status: "Published",
    visibility: "Public"
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } }
    ];
  }

  if (phoneModel) {
    const isObjectId = typeof phoneModel === 'string' && /^[a-fA-F0-9]{24}$/.test(phoneModel);
    const phoneModels = await findPhoneModels({
      filter: {
        active: true,
        $or: [
          ...(isObjectId ? [{ _id: phoneModel }] : []),
          { slug: phoneModel },
          { name: phoneModel }
        ]
      },
      limit: 1
    });

    if (!phoneModels || !phoneModels[0]) {
      return {
        items: [],
        meta: buildPaginationMeta({ page, perPage, totalItems: 0 })
      };
    }

    filter.phoneModelId = phoneModels[0]._id;
  }

  if (maxPrice != null && !isNaN(Number(maxPrice))) {
    const maxCents = Number(maxPrice) * 100;
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { salePrice: { $ne: null, $lte: maxCents } },
        { salePrice: null, basePrice: { $lte: maxCents } }
      ]
    });
  }

  const skip = (page - 1) * perPage;
  const [products, totalItems] = await Promise.all([
    findProducts({ filter, skip, limit: perPage }),
    countProducts(filter)
  ]);

  let items = products.map(mapStorefrontProduct);

  if (category) {
    items = items.filter((product) =>
      product.categories.some((item) => item.slug === category || item.id === category)
    );
  }

  return {
    items,
    meta: buildPaginationMeta({ page, perPage, totalItems: items.length || totalItems })
  };
};

const getStorefrontProduct = async (id) => {
  const product = await findProductById(id);

  if (!product || product.status !== "Published" || product.visibility !== "Public") {
    throw new NotFoundError("Product not found.");
  }

  return mapStorefrontProduct(product);
};

export { listStorefrontCategories, listStorefrontPhoneModels, listStorefrontProducts, getStorefrontProduct };
