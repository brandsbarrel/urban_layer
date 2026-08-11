import { sendSuccess } from "../shared/api-response.js";
import {
  createCouponRecord,
  deleteCouponRecord,
  getCouponAnalytics,
  listCoupons,
  setCouponStatus,
  updateCouponRecord,
  validateCouponForStorefront
} from "../services/coupon.service.js";

const getCoupons = async (req, res, next) => {
  try {
    const data = await listCoupons({
      search: req.query.search || "",
      status: req.query.status || "All",
      type: req.query.type || "All"
    });

    return sendSuccess({
      res,
      message: "Coupons fetched successfully.",
      data: { items: data.items }
    });
  } catch (error) {
    return next(error);
  }
};

const createCouponHandler = async (req, res, next) => {
  try {
    const coupon = await createCouponRecord(req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Coupon created successfully.",
      data: coupon
    });
  } catch (error) {
    return next(error);
  }
};

const updateCouponHandler = async (req, res, next) => {
  try {
    const coupon = await updateCouponRecord(req.params.id, req.body);
    return sendSuccess({
      res,
      message: "Coupon updated successfully.",
      data: coupon
    });
  } catch (error) {
    return next(error);
  }
};

const activateCouponHandler = async (req, res, next) => {
  try {
    const coupon = await setCouponStatus(req.params.id, "Active");
    return sendSuccess({ res, message: "Coupon activated successfully.", data: coupon });
  } catch (error) {
    return next(error);
  }
};

const pauseCouponHandler = async (req, res, next) => {
  try {
    const coupon = await setCouponStatus(req.params.id, "Scheduled");
    return sendSuccess({ res, message: "Coupon paused successfully.", data: coupon });
  } catch (error) {
    return next(error);
  }
};

const archiveCouponHandler = async (req, res, next) => {
  try {
    const coupon = await setCouponStatus(req.params.id, "Expired");
    return sendSuccess({ res, message: "Coupon archived successfully.", data: coupon });
  } catch (error) {
    return next(error);
  }
};

const deleteCouponHandler = async (req, res, next) => {
  try {
    await deleteCouponRecord(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const getCouponAnalyticsHandler = async (req, res, next) => {
  try {
    const analytics = await getCouponAnalytics(req.params.id);
    return sendSuccess({
      res,
      message: "Coupon analytics fetched successfully.",
      data: analytics
    });
  } catch (error) {
    return next(error);
  }
};

const validateCouponHandler = async (req, res, next) => {
  try {
    const result = await validateCouponForStorefront(req.body);
    return sendSuccess({
      res,
      message: "Coupon validated successfully.",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getCoupons,
  createCouponHandler,
  updateCouponHandler,
  activateCouponHandler,
  pauseCouponHandler,
  archiveCouponHandler,
  deleteCouponHandler,
  getCouponAnalyticsHandler,
  validateCouponHandler
};
