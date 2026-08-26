import mongoose from "mongoose";
import { findCartByCustomerId, updateCartByCustomerId } from "../repositories/cart.repository.js";
import { findCustomerById } from "../repositories/customer.repository.js";
import { findProductById, updateProductById } from "../repositories/product.repository.js";
import { createOrder } from "../repositories/checkout.repository.js";
import { updateAdminOrderById } from "../repositories/admin-order.repository.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";
import { generateOrderNumber } from "../helpers/order-number.js";
import { runWithOptionalTransaction } from "../helpers/transaction.helper.js";
import { env } from "../config/index.js";
import { createRazorpayApiOrder, triggerShiprocketShipment } from "./payment.service.js";

const SHIPPING_FLAT_RATE = 1500;
const FREE_SHIPPING_THRESHOLD = 15000;

const mapCartItem = (item) => {
  const product = item?.product;
  if (!product) return null;

  const effectivePrice = ((product.salePrice ?? product.basePrice) || 0) / 100;

  return {
    productId: product.id || product._id?.toString() || "",
    variantId: item.variantId || null,
    name: product.name || "",
    sku: product.sku || "",
    image: product.featuredImage || product.gallery?.[0]?.url || "",
    quantity: item.quantity || 1,
    unitPrice: effectivePrice,
    lineTotal: effectivePrice * (item.quantity || 1),
    stock: product.stock || 0,
    status: product.status || "Published"
  };
};

const summarizeCart = (cart) => {
  const items = (cart?.items || []).map(mapCartItem).filter(Boolean);
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
  const nextItems = (cart.items || [])
    .filter((item) => item && item.product)
    .map((item) => ({
      product: item.product._id || item.product,
      variantId: item.variantId || null,
      quantity: item.quantity || 1
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
  const nextItems = (cart.items || [])
    .filter((item) => item && item.product)
    .map((item) => ({
      product: (item.product._id || item.product).toString(),
      variantId: item.variantId || null,
      quantity: item.quantity || 1
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
  const nextItems = (cart.items || [])
    .filter((item) => item && item.product && (item.product._id || item.product).toString() !== productId)
    .map((item) => ({
      product: item.product._id || item.product,
      variantId: item.variantId || null,
      quantity: item.quantity || 1
    }));

  const updated = await updateCartByCustomerId(customerId, { items: nextItems });
  return summarizeCart(updated);
};

const checkoutCart = async (customerId, payload) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  // Resolve shipping address
  let shippingAddress;
  if (payload.shippingAddress) {
    shippingAddress = payload.shippingAddress;
  } else if (payload.shippingAddressIndex !== undefined) {
    if (!customer.addresses || customer.addresses.length <= payload.shippingAddressIndex) {
      throw new BusinessRuleError({ message: "Selected shipping address not found." });
    }
    shippingAddress = customer.addresses[payload.shippingAddressIndex].toObject();
  } else {
    const defaultAddress = customer.addresses?.find((a) => a.isDefault);
    if (!defaultAddress) {
      throw new BusinessRuleError({ message: "No shipping address provided and no default address found." });
    }
    shippingAddress = defaultAddress.toObject();
  }

  // Resolve billing address
  let billingAddress;
  if (payload.billingAddress) {
    billingAddress = payload.billingAddress;
  } else if (payload.billingAddressIndex !== undefined) {
    if (!customer.addresses || customer.addresses.length <= payload.billingAddressIndex) {
      throw new BusinessRuleError({ message: "Selected billing address not found." });
    }
    billingAddress = customer.addresses[payload.billingAddressIndex].toObject();
  } else {
    billingAddress = shippingAddress;
  }

  let cart = await ensureCart(customerId);

  // If DB cart is empty but payload items are provided from frontend, sync payload items to DB cart
  if ((!cart.items || cart.items.length === 0) && payload.items && payload.items.length > 0) {
    const nextItems = payload.items.map((item) => ({
      product: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity || 1
    }));
    cart = await updateCartByCustomerId(customerId, { items: nextItems });
  }

  if (!cart.items || cart.items.length === 0) {
    throw new BusinessRuleError({ message: "Cart is empty." });
  }

  const isCOD = payload.paymentMethod === "COD";

  return await runWithOptionalTransaction(async (options) => {
    const hydratedCart = await findCartByCustomerId(customerId);
    const itemsToProcess = (hydratedCart?.items && hydratedCart.items.length > 0) ? hydratedCart.items : cart.items;
    const orderItems = [];
    let subtotalMinor = 0;
    let taxMinor = 0;

    for (const item of itemsToProcess) {
      const productIdStr = item.product?._id ? item.product._id.toString() : (item.product?.toString() || item.productId || "");
      const product = await findProductById(productIdStr);

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

      // Deduct stock immediately ONLY for COD orders.
      // Online orders will deduct stock upon successful payment verification.
      if (isCOD) {
        await updateProductById(product.id, {
          stock: product.stock - item.quantity,
          reservedStock: (product.reservedStock || 0) + item.quantity,
          unfulfilledOrders: (product.unfulfilledOrders || 0) + item.quantity,
          activity: [
            {
              message: `Stock reserved for COD order (${item.quantity} units)`,
              meta: `COD order placed on ${new Date().toLocaleString()}`
            },
            ...product.activity
          ].slice(0, 20)
        }, options);
      }
    }

    // Calculate shipping
    const isExpress = payload.shippingMethod === "express";
    const EXPRESS_SHIPPING_FEE = 2500;
    const shippingMinor = isExpress ? EXPRESS_SHIPPING_FEE : (subtotalMinor >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE);
    const discountMinor = 0;
    const totalAmount = subtotalMinor + taxMinor + shippingMinor - discountMinor;

    const initialStatus = isCOD ? "Confirmed" : "Pending";
    const initialPaymentStatus = "Pending";

    const now = new Date();
    const timeline = isCOD
      ? [
          {
            title: "Order Placed",
            note: "Cash on Delivery order placed successfully.",
            done: true,
            active: false,
            source: "order",
            actor: "customer",
            createdAt: now,
            updatedAt: now,
            timestamp: now
          },
          {
            title: "Order Confirmed",
            note: "COD order confirmed and ready for shipment.",
            done: true,
            active: true,
            source: "order",
            actor: "system",
            createdAt: now,
            updatedAt: now,
            timestamp: now
          }
        ]
      : [
          {
            title: "Order Placed",
            note: "Order created, awaiting online payment confirmation.",
            done: true,
            active: true,
            source: "order",
            actor: "customer",
            createdAt: now,
            updatedAt: now,
            timestamp: now
          }
        ];

    const orderNumber = generateOrderNumber();
    const formattedAddress = [
      shippingAddress.line1,
      shippingAddress.line2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postalCode,
      shippingAddress.country
    ].filter(Boolean).join(", ");

    const order = await createOrder({
      orderNumber,
      customer: customer._id,
      items: orderItems,
      shippingAddress: shippingAddress.toObject ? shippingAddress.toObject() : shippingAddress,
      billingAddress: billingAddress.toObject ? billingAddress.toObject() : billingAddress,
      status: initialStatus,
      paymentStatus: initialPaymentStatus,
      paymentMethod: payload.paymentMethod,
      subtotal: subtotalMinor,
      taxAmount: taxMinor,
      shippingAmount: shippingMinor,
      discountAmount: discountMinor,
      totalAmount,
      couponCode: payload.couponCode || null,
      notes: payload.notes || "",
      shippingStatus: "Label Created",
      shipping: {
        recipient: shippingAddress.recipientName || "Customer",
        address: formattedAddress,
        carrier: isExpress ? "Express Courier (Shiprocket)" : "Standard Surface (Shiprocket)",
        trackingNumber: null,
        shiprocketShipmentId: isCOD ? `SR-${orderNumber}` : null
      },
      timeline
    }, options);

    if (isCOD) {
      // Clear DB cart for COD
      await updateCartByCustomerId(customerId, { items: [] }, options);

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: "COD",
        totalAmount: order.totalAmount / 100
      };
    }

    // For Online payment: Create real Razorpay order via Razorpay API
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayApiOrder({
        amountInPaise: totalAmount,
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerId: customer._id.toString()
        }
      });
    } catch (razorpayError) {
      throw new BusinessRuleError({
        message: `Failed to initiate payment gateway: ${razorpayError.message}`
      });
    }

    await updateAdminOrderById(order.id, {
      paymentGatewayOrderId: razorpayOrder.id
    }, options);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: payload.paymentMethod,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount / 100,
      amountPaise: order.totalAmount,
      currency: "INR",
      keyId: env.RAZORPAY_KEY_ID
    };
  });
};

export { getCart, addCartItem, updateCartItem, removeCartItem, checkoutCart };
