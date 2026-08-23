import { sendSuccess } from "../shared/api-response.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  clearWishlist
} from "../services/wishlist.service.js";

const getWishlistHandler = async (req, res, next) => {
  try {
    const wishlist = await getWishlist(req.user.id);
    return sendSuccess({
      res,
      message: "Wishlist fetched successfully.",
      data: wishlist
    });
  } catch (error) {
    return next(error);
  }
};

const addToWishlistHandler = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const wishlist = await addToWishlist(req.user.id, productId);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Product added to wishlist successfully.",
      data: wishlist
    });
  } catch (error) {
    return next(error);
  }
};

const removeFromWishlistHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await removeFromWishlist(req.user.id, productId);
    return sendSuccess({
      res,
      message: "Product removed from wishlist successfully.",
      data: wishlist
    });
  } catch (error) {
    return next(error);
  }
};

const checkWishlistStatusHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const status = await checkWishlistStatus(req.user.id, productId);
    return sendSuccess({
      res,
      message: "Wishlist status checked successfully.",
      data: status
    });
  } catch (error) {
    return next(error);
  }
};

const clearWishlistHandler = async (req, res, next) => {
  try {
    const result = await clearWishlist(req.user.id);
    return sendSuccess({
      res,
      message: "Wishlist cleared successfully.",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getWishlistHandler,
  addToWishlistHandler,
  removeFromWishlistHandler,
  checkWishlistStatusHandler,
  clearWishlistHandler
};