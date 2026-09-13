import { z } from "zod";

const nullableDate = z.union([
  z.coerce.date(),
  z.literal(""),
  z.null()
]).optional().transform((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  return value;
});

const heroSlideCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  subtitle: z.string().trim().max(500).optional().default(""),
  ctaText: z.string().trim().max(100).optional().default(""),
  ctaLink: z.string().trim().max(500).optional().default(""),
  backgroundImage: z.string().trim().max(1000).optional().default(""),
  order: z.coerce.number().int().nonnegative().optional(),
  isActive: z.boolean().optional().default(true),
  startDate: nullableDate.default(null),
  endDate: nullableDate.default(null)
});

const heroSlideUpdateSchema = heroSlideCreateSchema.partial();

export { heroSlideCreateSchema, heroSlideUpdateSchema };
