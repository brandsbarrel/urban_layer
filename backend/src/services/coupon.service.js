import { ConflictError, NotFoundError, BusinessRuleError } from "../shared/app-error.js";
import {
  countCoupons,
  createCoupon,
  deleteCouponById,
  findCouponByCode,
  findCouponById,
  findCoupons,
  updateCouponById
} from "../repositories/coupon.repository.js";

const formatDate = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const inferCouponType = (discountType) => {
  if (discountType === "Percentage") {
    return "Flash Sale";
  }

  if (discountType === "BOGO") {
    return "Buy X Get Y";
  }

  return "Direct Discount";
};

const computeProgressPercent = (coupon) => {
  if (coupon.maxRedemption === "Unlimited") {
    return coupon.status === "Active" ? 50 : 0;
  }

  const limit = Number(coupon.maxRedemption);

  if (!limit || Number.isNaN(limit)) {
    return 0;
  }

  return Math.min(Math.round((coupon.redemptions / limit) * 100), 100);
};

const mapCoupon = (coupon) => {
  const discountSuffix = coupon.discountType === "Percentage" ? "% Off" : "";

  return {
    id: coupon.id,
    code: coupon.code,
    title: coupon.title,
    subtitle: coupon.subtitle,
    type: coupon.type,
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    minOrderValue: (coupon.minOrderValue / 100).toFixed(2),
    maxRedemption: coupon.maxRedemption,
    status: coupon.status,
    revenue: coupon.revenue / 100,
    redemptions: coupon.redemptions,
    avgBasket: coupon.avgBasket / 100,
    startDate: formatDate(coupon.startDate),
    endDate: formatDate(coupon.endDate),
    progressPercent: coupon.progressPercent,
    heroImage: coupon.heroImage,
    usageTrend: coupon.usageTrend,
    discountLabel: `${coupon.discountValue}${discountSuffix}`
  };
};

const listCoupons = async ({ search = "", status = "All", type = "All" }) => {
  const filter = {};

  if (status !== "All") {
    filter.status = status;
  }

  if (type !== "All") {
    filter.type = type;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } }
    ];
  }

  const coupons = await findCoupons({ filter });

  return {
    items: coupons.map(mapCoupon),
    total: await countCoupons(filter)
  };
};

const createCouponRecord = async (payload) => {
  const existing = await findCouponByCode(payload.code);

  if (existing) {
    throw new ConflictError({ message: "Coupon code already exists." });
  }

  const coupon = await createCoupon({
    ...payload,
    type: payload.type || inferCouponType(payload.discountType),
    title: payload.title || payload.code,
    minOrderValue: Math.round(Number(payload.minOrderValue || 0) * 100),
    revenue: 0,
    avgBasket: 0,
    progressPercent: 0
  });

  const updated = await updateCouponById(coupon.id, {
    progressPercent: computeProgressPercent(coupon)
  });

  return mapCoupon(updated);
};

const updateCouponRecord = async (id, payload) => {
  const coupon = await findCouponById(id);

  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }

  if (payload.code && payload.code !== coupon.code) {
    const existing = await findCouponByCode(payload.code);
    if (existing && existing.id !== id) {
      throw new ConflictError({ message: "Coupon code already exists." });
    }
  }

  const updated = await updateCouponById(id, {
    ...payload,
    type: payload.type || coupon.type || inferCouponType(payload.discountType || coupon.discountType),
    minOrderValue: payload.minOrderValue === undefined
      ? coupon.minOrderValue
      : Math.round(Number(payload.minOrderValue || 0) * 100)
  });

  const finalized = await updateCouponById(id, {
    progressPercent: computeProgressPercent(updated)
  });

  return mapCoupon(finalized);
};

const setCouponStatus = async (id, status) => {
  const coupon = await findCouponById(id);

  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }

  const updated = await updateCouponById(id, { status });
  return mapCoupon(updated);
};

const deleteCouponRecord = async (id) => {
  const coupon = await findCouponById(id);

  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }

  await deleteCouponById(id);
};

const getCouponAnalytics = async (id) => {
  const coupon = await findCouponById(id);

  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }

  return {
    id: coupon.id,
    code: coupon.code,
    revenue: coupon.revenue / 100,
    redemptions: coupon.redemptions,
    avgBasket: coupon.avgBasket / 100,
    conversionRate: coupon.maxRedemption === "Unlimited"
      ? null
      : Number(coupon.maxRedemption) > 0
        ? Number(((coupon.redemptions / Number(coupon.maxRedemption)) * 100).toFixed(2))
        : 0,
    usageTrend: coupon.usageTrend
  };
};

const validateCouponForStorefront = async ({ code, cartTotal }) => {
  const coupon = await findCouponByCode(code);

  if (!coupon) {
    throw new BusinessRuleError({ message: "Coupon does not exist." });
  }

  if (coupon.status !== "Active") {
    throw new BusinessRuleError({ message: "Coupon is not active." });
  }

  const now = Date.now();

  if (now < new Date(coupon.startDate).getTime()) {
    throw new BusinessRuleError({ message: "Coupon is not active yet." });
  }

  if (now > new Date(coupon.endDate).getTime()) {
    throw new BusinessRuleError({ message: "Coupon has expired." });
  }

  if (cartTotal * 100 < coupon.minOrderValue) {
    throw new BusinessRuleError({ message: "Cart total does not meet the minimum order value." });
  }

  if (coupon.maxRedemption !== "Unlimited" && coupon.redemptions >= Number(coupon.maxRedemption)) {
    throw new BusinessRuleError({ message: "Coupon redemption limit has been reached." });
  }

  let discountAmount = 0;

  if (coupon.discountType === "Percentage") {
    discountAmount = Number(((cartTotal * coupon.discountValue) / 100).toFixed(2));
  } else if (coupon.discountType === "Fixed Amount") {
    discountAmount = Number((coupon.discountValue / 100).toFixed(2));
  }

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount
  };
};

export {
  listCoupons,
  createCouponRecord,
  updateCouponRecord,
  setCouponStatus,
  deleteCouponRecord,
  getCouponAnalytics,
  validateCouponForStorefront
};
