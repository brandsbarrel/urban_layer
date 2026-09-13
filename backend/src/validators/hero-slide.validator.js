import { z } from "zod";

const nullableDate = z.preprocess((val) => {
  if (!val || val === "" || val === null || typeof val === "undefined") return null;
  return val;
}, z.union([
  z.string().refine((str) => !isNaN(Date.parse(str)), "Invalid date format").transform((str) => new Date(str)),
  z.date(),
  z.null()
]).optional().default(null));

const heroSlideCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  subtitle: z.string().trim().max(500).optional().default(""),
  ctaText: z.string().trim().max(100).optional().default(""),
  ctaLink: z.string().trim().max(500).optional().default(""),
  backgroundImage: z.string().trim().optional().default(""),
  order: z.coerce.number().int().nonnegative().optional(),
  isActive: z.boolean().optional().default(true),
  startDate: nullableDate,
  endDate: nullableDate
});

const heroSlideUpdateSchema = heroSlideCreateSchema.partial();

export { heroSlideCreateSchema, heroSlideUpdateSchema };
