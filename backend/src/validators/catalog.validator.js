import { z } from "zod";
import { CATEGORY_STATUSES, PRODUCT_STATUSES, PRODUCT_VISIBILITIES } from "../constants/index.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId.");
const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens.");
const httpsUrlSchema = z.string().url().refine((value) => value.startsWith("https://"), "URL must start with https://");
const imageSourceSchema = z.string().refine((value) => value.startsWith("https://") || value.startsWith("data:image/"), "Image must be a selected image or https URL.");
const skuSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{3,40}$/, "SKU must be 3-40 chars with uppercase letters, numbers, and hyphens.");
const numberField = z.coerce.number().nonnegative();
const optionalNumberField = z.union([z.coerce.number().nonnegative(), z.literal(""), z.null()]).transform((value) => {
  if (value === "" || value === null) {
    return null;
  }

  return value;
});

const categoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: slugSchema.optional(),
  description: z.string().trim().max(1000).optional().default(""),
  parent: z.union([objectIdSchema, z.literal(""), z.null()]).optional().transform((value) => {
    if (value === "" || typeof value === "undefined") {
      return null;
    }

    return value;
  }),
  image: imageSourceSchema.optional().or(z.literal("")).default(""),
  phoneModels: z.array(z.string().trim().min(1).max(120)).optional().default([]),
  seoTitle: z.string().trim().max(65).optional().default(""),
  seoDescription: z.string().trim().max(160).optional().default("")
});

const categoryUpdateSchema = categoryCreateSchema.extend({
  status: z.enum(CATEGORY_STATUSES).optional()
});

const categoryMoveSchema = z.object({
  direction: z.enum(["up", "down"])
});

const productBaseFields = {
  name: z.string().trim().min(1).max(160),
  slug: slugSchema.optional(),
  sku: skuSchema,
  phoneModelId: objectIdSchema,
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().trim().max(10000).optional(),
  brand: z.string().trim().max(120).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).optional(),
  bestSeller: z.boolean().optional(),
  categories: z.array(objectIdSchema).optional(),
  collection: z.string().trim().max(120).optional(),
  featuredImage: imageSourceSchema.optional().or(z.literal("")),
  gallery: z.array(z.object({
    url: imageSourceSchema,
    order: z.number().int().nonnegative().optional().default(0),
    isFeatured: z.boolean().optional().default(false)
  })).optional(),
  basePrice: numberField,
  salePrice: optionalNumberField.optional(),
  costPrice: optionalNumberField.optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  reservedStock: z.coerce.number().int().nonnegative().optional(),
  trackStock: z.boolean().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  visibility: z.enum(PRODUCT_VISIBILITIES).optional(),
  seoTitle: z.string().trim().max(65).optional(),
  seoDescription: z.string().trim().max(160).optional(),
  weight: optionalNumberField.optional(),
  length: optionalNumberField.optional(),
  width: optionalNumberField.optional(),
  height: optionalNumberField.optional(),
  packageType: z.enum(["Box", "Padded Envelope", "Mailer"]).optional(),
  shippingClass: z.enum(["Standard", "Express", "Fragile"]).optional(),
  fragile: z.boolean().optional(),
  pickupLocation: z.string().trim().max(120).optional(),
  variants: z.array(z.object({
    id: z.string().trim().min(1),
    name: z.string().trim().optional().default(""),
    color: z.string().trim().optional().default(""),
    stock: z.coerce.number().int().nonnegative().optional().default(0)
  })).optional()
};

const productCreateSchema = z.object({
  ...productBaseFields,
  shortDescription: productBaseFields.shortDescription.default(""),
  description: productBaseFields.description.default(""),
  brand: productBaseFields.brand.default(""),
  tags: productBaseFields.tags.default([]),
  bestSeller: productBaseFields.bestSeller.default(false),
  categories: productBaseFields.categories.default([]),
  collection: productBaseFields.collection.default(""),
  featuredImage: productBaseFields.featuredImage.default(""),
  gallery: productBaseFields.gallery.default([]),
  salePrice: productBaseFields.salePrice.default(null),
  costPrice: productBaseFields.costPrice.default(null),
  taxRate: productBaseFields.taxRate.default(0),
  stock: productBaseFields.stock.default(0),
  reservedStock: productBaseFields.reservedStock.default(0),
  trackStock: productBaseFields.trackStock.default(true),
  status: productBaseFields.status.default("Draft"),
  visibility: productBaseFields.visibility.default("Public"),
  seoTitle: productBaseFields.seoTitle.default(""),
  seoDescription: productBaseFields.seoDescription.default(""),
  weight: productBaseFields.weight.default(null),
  length: productBaseFields.length.default(null),
  width: productBaseFields.width.default(null),
  height: productBaseFields.height.default(null),
  packageType: productBaseFields.packageType.default("Box"),
  shippingClass: productBaseFields.shippingClass.default("Standard"),
  fragile: productBaseFields.fragile.default(false),
  pickupLocation: productBaseFields.pickupLocation.default(""),
  variants: productBaseFields.variants.default([])
});

const productUpdateSchema = z.object(productBaseFields).partial().extend({
  sku: skuSchema.optional()
});

const productBestSellerSchema = z.object({
  bestSeller: z.boolean().optional(),
  isBestSeller: z.boolean().optional()
}).refine((data) => typeof data.bestSeller === "boolean" || typeof data.isBestSeller === "boolean", {
  message: "Either bestSeller or isBestSeller boolean must be provided."
});

export {
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryMoveSchema,
  productCreateSchema,
  productUpdateSchema,
  productBestSellerSchema
};
