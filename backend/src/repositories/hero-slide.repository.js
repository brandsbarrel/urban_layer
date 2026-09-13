import { HeroSlideModel } from "../models/index.js";

const findHeroSlides = ({ filter = {}, skip = 0, limit = 50, sort = { order: 1, createdAt: -1 } }) => {
  return HeroSlideModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

const countHeroSlides = (filter = {}) => {
  return HeroSlideModel.countDocuments(filter);
};

const findHeroSlideById = (id) => {
  return HeroSlideModel.findById(id);
};

const createHeroSlide = (payload) => {
  return HeroSlideModel.create(payload);
};

const updateHeroSlideById = (id, update) => {
  return HeroSlideModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
};

const deleteHeroSlideById = (id) => {
  return HeroSlideModel.findByIdAndDelete(id);
};

const getMaxHeroSlideOrder = async () => {
  const slide = await HeroSlideModel.findOne().sort({ order: -1 });
  return slide?.order ?? -1;
};

export {
  findHeroSlides,
  countHeroSlides,
  findHeroSlideById,
  createHeroSlide,
  updateHeroSlideById,
  deleteHeroSlideById,
  getMaxHeroSlideOrder
};
