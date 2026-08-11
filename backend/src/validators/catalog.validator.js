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
  image: httpsUrlSchema.optional().or(z.literal("")).default(""),
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

const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slugSchema.optional(),
  sku: skuSchema,
  phoneModel: z.string().trim().min(1).max(120),
  shortDescription: z.string().trim().max(500).optional().default(""),
  description: z.string().trim().max(10000).optional().default(""),
  brand: z.string().trim().max(120).optional().default(""),
  tags: z.array(z.string().trim().min(1).max(40)).optional().default([]),
  categories: z.array(objectIdSchema).optional().default([]),
  collection: z.string().trim().max(120).optional().default(""),
  featuredImage: imageSourceSchema.optional().or(z.literal("")).default(""),
  gallery: z.array(z.object({
    url: imageSourceSchema,
    order: z.number().int().nonnegative().optional().default(0),
    isFeatured: z.boolean().optional().default(false)
  })).optional().default([]),
  basePrice: numberField,
  salePrice: optionalNumberField.optional().default(null),
  costPrice: optionalNumberField.optional().default(null),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  stock: z.coerce.number().int().nonnegative().optional().default(0),
  reservedStock: z.coerce.number().int().nonnegative().optional().default(0),
  trackStock: z.boolean().optional().default(true),
  status: z.enum(PRODUCT_STATUSES).optional().default("Draft"),
  visibility: z.enum(PRODUCT_VISIBILITIES).optional().default("Public"),
  seoTitle: z.string().trim().max(65).optional().default(""),
  seoDescription: z.string().trim().max(160).optional().default(""),
  weight: optionalNumberField.optional().default(null),
  length: optionalNumberField.optional().default(null),
  width: optionalNumberField.optional().default(null),
  height: optionalNumberField.optional().default(null),
  packageType: z.enum(["Box", "Padded Envelope", "Mailer"]).optional().default("Box"),
  shippingClass: z.enum(["Standard", "Express", "Fragile"]).optional().default("Standard"),
  fragile: z.boolean().optional().default(false),
  variants: z.array(z.object({
    id: z.string().trim().min(1),
    name: z.string().trim().optional().default(""),
    color: z.string().trim().optional().default(""),
    stock: z.coerce.number().int().nonnegative().optional().default(0)
  })).optional().default([])
});

const productUpdateSchema = productCreateSchema.partial().extend({
  sku: skuSchema.optional()
});

export {
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryMoveSchema,
  productCreateSchema,
  productUpdateSchema
};
