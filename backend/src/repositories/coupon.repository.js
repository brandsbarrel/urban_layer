import { CouponModel } from "../models/index.js";

const findCoupons = ({ filter = {}, sort = { createdAt: -1 } }) => {
  return CouponModel.find(filter).sort(sort);
};

const countCoupons = (filter = {}) => {
  return CouponModel.countDocuments(filter);
};

const findCouponById = (id) => {
  return CouponModel.findById(id);
};

const findCouponByCode = (code) => {
  return CouponModel.findOne({ code });
};

const createCoupon = (payload, options = {}) => {
  return CouponModel.create([{ ...payload }], options).then((docs) => docs[0]);
};

const updateCouponById = (id, update, options = {}) => {
  return CouponModel.findByIdAndUpdate(id, update, {
    new: true,
    ...options
  });
};

const deleteCouponById = (id, options = {}) => {
  return CouponModel.findByIdAndDelete(id, options);
};

export {
  findCoupons,
  countCoupons,
  findCouponById,
  findCouponByCode,
  createCoupon,
  updateCouponById,
  deleteCouponById
};
