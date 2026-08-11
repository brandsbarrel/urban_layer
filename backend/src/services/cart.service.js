import mongoose from "mongoose";
import { findCartByCustomerId, updateCartByCustomerId } from "../repositories/cart.repository.js";
import { findCustomerById } from "../repositories/customer.repository.js";
import { findProductById, updateProductById } from "../repositories/product.repository.js";
import { createOrder } from "../repositories/checkout.repository.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";
import { generateOrderNumber } from "../helpers/order-number.js";

const SHIPPING_FLAT_RATE = 1500;
const FREE_SHIPPING_THRESHOLD = 15000;

const mapCartItem = (item) => {
  const product = item.product;
  const effectivePrice = (product.salePrice ?? product.basePrice) / 100;

  return {
    productId: product.id,
    variantId: item.variantId,
    name: product.name,
    sku: product.sku,
    image: product.featuredImage || product.gallery?.[0]?.url || "",
    quantity: item.quantity,
    unitPrice: effectivePrice,
    lineTotal: effectivePrice * item.quantity,
    stock: product.stock,
    status: product.status
  };
};

const summarizeCart = (cart) => {
  const items = cart.items.map(mapCartItem);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD / 100 ? 0 : SHIPPING_FLAT_RATE / 100;
  const total = subtotal + shipping;

  return {
    items,
    summary: {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total
    }
  };
};

const ensureCart = async (customerId) => {
  let cart = await findCartByCustomerId(customerId);

  if (!cart) {
    cart = await updateCartByCustomerId(customerId, {
      $setOnInsert: {
        customer: customerId,
        items: []
      }
    });
  }

  return cart;
};

const getCart = async (customerId) => {
  const cart = await ensureCart(customerId);
  return summarizeCart(cart);
};

const addCartItem = async (customerId, payload) => {
  const product = await findProductById(payload.productId);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  if (product.status === "Archived") {
    throw new BusinessRuleError({ message: "Archived products cannot be added to cart." });
  }

  if (product.stock < payload.quantity) {
    throw new BusinessRuleError({ message: "Requested quantity exceeds available stock." });
  }

  const cart = await ensureCart(customerId);
  const nextItems = cart.items.map((item) => ({
    product: item.product._id,
    variantId: item.variantId,
    quantity: item.quantity
  }));

  const existingIndex = nextItems.findIndex((item) =>
    item.product.toString() === payload.productId &&
    (item.variantId || null) === (payload.variantId || null)
  );

  if (existingIndex >= 0) {
    nextItems[existingIndex].quantity += payload.quantity;
  } else {
    nextItems.push({
      product: payload.productId,
      variantId: payload.variantId || null,
      quantity: payload.quantity
    });
  }

  const updated = await updateCartByCustomerId(customerId, { items: nextItems });
  return summarizeCart(updated);
};

const updateCartItem = async (customerId, productId, payload) => {
  const cart = await ensureCart(customerId);
  const nextItems = cart.items.map((item) => ({
    product: item.product._id.toString(),
    variantId: item.variantId,
    quantity: item.quantity
  }));

  const itemIndex = nextItems.findIndex((item) => item.product === productId);

  if (itemIndex < 0) {
    throw new NotFoundError("Cart item not found.");
  }

  const product = await findProductById(productId);

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  if (product.stock < payload.quantity) {
    throw new BusinessRuleError({ message: "Requested quantity exceeds available stock." });
  }

  nextItems[itemIndex].quantity = payload.quantity;

  const updated = await updateCartByCustomerId(customerId, { items: nextItems });
  return summarizeCart(updated);
};

const removeCartItem = async (customerId, productId) => {
  const cart = await ensureCart(customerId);
  const nextItems = cart.items
    .filter((item) => item.product._id.toString() !== productId)
    .map((item) => ({
      product: item.product._id,
      variantId: item.variantId,
      quantity: item.quantity
    }));

  const updated = await updateCartByCustomerId(customerId, { items: nextItems });
  return summarizeCart(updated);
};

const checkoutCart = async (customerId, payload) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  const shippingAddress = customer.addresses[payload.shippingAddressIndex];
  const billingAddress = customer.addresses[payload.billingAddressIndex ?? payload.shippingAddressIndex];

  if (!shippingAddress || !billingAddress) {
    throw new BusinessRuleError({ message: "A valid shipping and billing address is required." });
  }

  const cart = await ensureCart(customerId);

  if (cart.items.length === 0) {
    throw new BusinessRuleError({ message: "Cart is empty." });
  }

  const session = await mongoose.startSession();

  try {
    let order;

    await session.withTransaction(async () => {
      const hydratedCart = await findCartByCustomerId(customerId);
      const orderItems = [];
      let subtotalMinor = 0;
      let taxMinor = 0;

      for (const item of hydratedCart.items) {
        const product = await findProductById(item.product._id.toString());

        if (!product) {
          throw new NotFoundError("One or more cart products no longer exist.");
        }

        if (product.stock < item.quantity) {
          throw new BusinessRuleError({ message: `${product.name} no longer has sufficient stock.` });
        }

        const unitPrice = product.salePrice ?? product.basePrice;
        const lineTotal = unitPrice * item.quantity;
        const itemTax = Math.round(lineTotal * ((product.taxRate || 0) / 100));

        subtotalMinor += lineTotal;
        taxMinor += itemTax;

        orderItems.push({
          productId: product._id,
          name: product.name,
          sku: product.sku,
          variantId: item.variantId,
          variantLabel: item.variantId || "",
          quantity: item.quantity,
          unitPrice,
          lineTotal,
          image: product.featuredImage || product.gallery?.[0]?.url || ""
        });

        await updateProductById(product.id, {
          stock: product.stock - item.quantity,
          reservedStock: (product.reservedStock || 0) + item.quantity,
          unfulfilledOrders: (product.unfulfilledOrders || 0) + item.quantity,
          activity: [
            {
              message: `Stock reserved for pending order (${item.quantity} units)`,
              meta: `Checkout initiated on ${new Date().toLocaleString()}`
            },
            ...product.activity
          ].slice(0, 20)
        }, { session });
      }

      const shippingMinor = subtotalMinor >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
      const discountMinor = 0;
      const totalAmount = subtotalMinor + taxMinor + shippingMinor - discountMinor;

      order = await createOrder({
        orderNumber: generateOrderNumber(),
        customer: customer._id,
        items: orderItems,
        shippingAddress: shippingAddress.toObject ? shippingAddress.toObject() : shippingAddress,
        billingAddress: billingAddress.toObject ? billingAddress.toObject() : billingAddress,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: payload.paymentMethod,
        subtotal: subtotalMinor,
        taxAmount: taxMinor,
        shippingAmount: shippingMinor,
        discountAmount: discountMinor,
        totalAmount,
        couponCode: payload.couponCode || null,
        notes: payload.notes || "",
        timeline: [
          {
            title: "Order Placed",
            note: "Order created and awaiting payment confirmation.",
            done: true,
            active: true
          }
        ]
      }, { session });

      await updateCartByCustomerId(customerId, { items: [] }, { session });
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount / 100
    };
  } finally {
    await session.endSession();
  }
};

export { getCart, addCartItem, updateCartItem, removeCartItem, checkoutCart };
