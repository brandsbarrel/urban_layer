import { NotFoundError } from "../shared/app-error.js";
import {
  countHeroSlides,
  createHeroSlide,
  deleteHeroSlideById,
  findHeroSlideById,
  findHeroSlides,
  getMaxHeroSlideOrder,
  updateHeroSlideById
} from "../repositories/hero-slide.repository.js";
import { buildPaginationMeta } from "../utils/pagination.js";

const mapHeroSlide = (slide) => ({
  id: slide.id,
  title: slide.title,
  subtitle: slide.subtitle || "",
  ctaText: slide.ctaText || "",
  ctaLink: slide.ctaLink || "",
  backgroundImage: slide.backgroundImage || "",
  order: slide.order,
  isActive: slide.isActive,
  startDate: slide.startDate || null,
  endDate: slide.endDate || null,
  createdAt: slide.createdAt,
  updatedAt: slide.updatedAt
});

// Public: return only currently valid/active slides
const listActiveHeroSlides = async () => {
  const now = new Date();
  const slides = await findHeroSlides({
    filter: {
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    },
    limit: 100
  });

  return { items: slides.map(mapHeroSlide) };
};

// Admin: list all slides with pagination
const listAllHeroSlides = async ({ page = 1, perPage = 20 }) => {
  const skip = (page - 1) * perPage;
  const [items, totalItems] = await Promise.all([
    findHeroSlides({ skip, limit: perPage }),
    countHeroSlides()
  ]);

  return {
    items: items.map(mapHeroSlide),
    meta: buildPaginationMeta({ page, perPage, totalItems })
  };
};

const getHeroSlideById = async (id) => {
  const slide = await findHeroSlideById(id);
  if (!slide) throw new NotFoundError("Hero slide not found.");
  return mapHeroSlide(slide);
};

const createHeroSlideRecord = async (payload) => {
  const order = payload.order ?? (await getMaxHeroSlideOrder()) + 1;
  const slide = await createHeroSlide({ ...payload, order });
  return mapHeroSlide(slide);
};

const updateHeroSlideRecord = async (id, payload) => {
  const existing = await findHeroSlideById(id);
  if (!existing) throw new NotFoundError("Hero slide not found.");
  const updated = await updateHeroSlideById(id, payload);
  return mapHeroSlide(updated);
};

const deleteHeroSlideRecord = async (id) => {
  const existing = await findHeroSlideById(id);
  if (!existing) throw new NotFoundError("Hero slide not found.");
  await deleteHeroSlideById(id);
};

export {
  listActiveHeroSlides,
  listAllHeroSlides,
  getHeroSlideById,
  createHeroSlideRecord,
  updateHeroSlideRecord,
  deleteHeroSlideRecord
};
