import { findCustomerById, updateCustomerById } from "../repositories/customer.repository.js";
import { findProductById } from "../repositories/product.repository.js";
import { NotFoundError, ConflictError } from "../shared/app-error.js";

const getWishlist = async (customerId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  // Populate product details for wishlist items
  const populatedCustomer = await customer.populate({
    path: "wishlist",
    model: "Product",
    select: "name slug sku featuredImage gallery basePrice salePrice stock phoneModelId categories",
    populate: [
      { path: "categories", select: "name slug" },
      { path: "phoneModelId", select: "brand name slug" }
    ]
  });

  const wishlistItems = populatedCustomer.wishlist.map((product) => {
    if (!product) return null;
    
    const images = [
      product.featuredImage,
      ...(product.gallery || []).sort((a, b) => a.order - b.order).map((image) => image.url)
    ].filter(Boolean);

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      featuredImage: images[0] || "",
      images,
      basePrice: product.basePrice / 100,
      salePrice: product.salePrice == null ? null : product.salePrice / 100,
      price: (product.salePrice ?? product.basePrice) / 100,
      stock: product.stock,
      inStock: product.stock > 0,
      phoneModel: product.phoneModelId
        ? {
            id: product.phoneModelId.id,
            brand: product.phoneModelId.brand,
            name: product.phoneModelId.name,
            slug: product.phoneModelId.slug
          }
        : null,
      categories: (product.categories || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }))
    };
  }).filter(Boolean);

  return {
    items: wishlistItems,
    count: wishlistItems.length
  };
};

const addToWishlist = async (customerId, productId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  // Validate product exists and is available
  const product = await findProductById(productId);
  if (!product || product.status !== "Published" || product.visibility !== "Public") {
    throw new NotFoundError("Product not found or unavailable.");
  }

  // Check if already in wishlist
  const productObjectId = product._id.toString();
  const alreadyInWishlist = customer.wishlist.some(
    (id) => id.toString() === productObjectId
  );

  if (alreadyInWishlist) {
    // Idempotent - return current wishlist without error
    return getWishlist(customerId);
  }

  // Add to wishlist
  customer.wishlist.push(product._id);
  await updateCustomerById(customerId, { wishlist: customer.wishlist });

  return getWishlist(customerId);
};

const removeFromWishlist = async (customerId, productId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  const productObjectId = productId;
  customer.wishlist = customer.wishlist.filter(
    (id) => id.toString() !== productObjectId
  );

  await updateCustomerById(customerId, { wishlist: customer.wishlist });

  return getWishlist(customerId);
};

const checkWishlistStatus = async (customerId, productId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  const isWishlisted = customer.wishlist.some(
    (id) => id.toString() === productId
  );

  return { isWishlisted };
};

const clearWishlist = async (customerId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  customer.wishlist = [];
  await updateCustomerById(customerId, { wishlist: [] });

  return { items: [], count: 0 };
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  clearWishlist
};