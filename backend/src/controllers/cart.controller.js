import { sendSuccess } from "../shared/api-response.js";
import { addCartItem, checkoutCart, getCart, removeCartItem, updateCartItem } from "../services/cart.service.js";

const getCustomerCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    return sendSuccess({
      res,
      message: "Cart fetched successfully.",
      data: cart
    });
  } catch (error) {
    return next(error);
  }
};

const addCustomerCartItem = async (req, res, next) => {
  try {
    const cart = await addCartItem(req.user.id, req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Cart item added successfully.",
      data: cart
    });
  } catch (error) {
    return next(error);
  }
};

const updateCustomerCartItem = async (req, res, next) => {
  try {
    const cart = await updateCartItem(req.user.id, req.params.productId, req.body);
    return sendSuccess({
      res,
      message: "Cart item updated successfully.",
      data: cart
    });
  } catch (error) {
    return next(error);
  }
};

const removeCustomerCartItem = async (req, res, next) => {
  try {
    const cart = await removeCartItem(req.user.id, req.params.productId);
    return sendSuccess({
      res,
      message: "Cart item removed successfully.",
      data: cart
    });
  } catch (error) {
    return next(error);
  }
};

const checkoutCustomerCart = async (req, res, next) => {
  try {
    const order = await checkoutCart(req.user.id, req.body);
    return sendSuccess({
      res,
      statusCode: 201,
      message: "Checkout completed successfully.",
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getCustomerCart,
  addCustomerCartItem,
  updateCustomerCartItem,
  removeCustomerCartItem,
  checkoutCustomerCart
};
