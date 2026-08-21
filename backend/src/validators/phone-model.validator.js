import { z } from "zod";

const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens.");

const phoneModelCreateSchema = z.object({
  brand: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  slug: slugSchema.optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().nonnegative().optional()
});

const phoneModelUpdateSchema = phoneModelCreateSchema.partial();

const phoneModelListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(20),
  search: z.string().trim().optional().default(""),
  active: z.enum(["true", "false", "All"]).optional().default("All")
});

export { phoneModelCreateSchema, phoneModelUpdateSchema, phoneModelListQuerySchema };
