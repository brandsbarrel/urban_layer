import publicApi, { logPublicApiResult } from './publicApi';
import { getBestSellerProducts, getCategories, getPhoneModels } from './productsService';
import { homeMockData } from '../data/homeMockData';

const getItems = (responseData) => {
  if (Array.isArray(responseData?.data?.items)) return responseData.data.items;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
};

const normalizeHeroSlide = (slide = {}) => ({
  id: slide.id || slide._id || slide.title,
  title: slide.title || '',
  description: slide.subtitle || slide.description || '',
  image: slide.backgroundImage || slide.image || '',
  imageAlt: slide.imageAlt || slide.title || 'Urban Layers featured collection',
  eyebrow: slide.eyebrow || 'Urban Layers Co.',
  primaryCta: slide.ctaText
    ? {
        label: slide.ctaText,
        href: slide.ctaLink || '/shop',
      }
    : null,
  secondaryCta: slide.secondaryCta || null,
});

export const getHomeData = async () => ({
  heroSlides: await getHeroSlides(),
  devices: await getHomeDevices(),
  categories: await getHomeCategories(),
  bestSellers: await getHomeBestSellers(),
  materialStory: homeMockData.materialStory || null,
  lifestyleBanner: homeMockData.lifestyleBanner || null,
});

export const getHeroSlides = async () => {
  const response = await publicApi.get('/hero-slides');
  logPublicApiResult('Homepage Hero Slider', '/api/hero-slides', response.data);
  return getItems(response.data).map(normalizeHeroSlide).filter((slide) => slide.title && slide.image);
};

export const getHomeDevices = async () => {
  return getPhoneModels();
};

export const getHomeCategories = async () => {
  return getCategories();
};

export const getHomeBestSellers = async () => {
  return getBestSellerProducts({ page: 1, perPage: 8 });
};

export const getHomeEditorialContent = async () => {
  return {
    materialStory: homeMockData.materialStory || null,
    lifestyleBanner: homeMockData.lifestyleBanner || null,
  };
};
