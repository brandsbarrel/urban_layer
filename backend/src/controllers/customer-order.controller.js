import { sendSuccess } from "../shared/api-response.js";
import { findOrdersByCustomerId } from "../repositories/checkout.repository.js";
import { findAdminOrderById } from "../repositories/admin-order.repository.js";
import { NotFoundError } from "../shared/app-error.js";

const formatOrderDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

const mapOrderProducts = (items) => {
  return items.map((item, index) => ({
    id: item.productId?.toString?.() || `${index + 1}`,
    name: item.name,
    sku: item.sku,
    variant: item.variantLabel || item.variantId || "",
    subtitle: item.variantLabel || item.variantId || item.sku || "",
    price: item.unitPrice / 100,
    qty: item.quantity,
    quantity: item.quantity,
    image: item.image
  }));
};

const mapTimeline = (timeline = []) => {
  return timeline.map((entry) => ({
    id: entry._id?.toString?.() || `${entry.title}-${entry.createdAt}`,
    title: entry.title,
    date: formatOrderDate(entry.createdAt || new Date()),
    note: entry.note,
    done: entry.done,
    active: entry.active,
    source: entry.source || "order",
    actor: entry.actor || "system",
    metadata: entry.metadata || {}
  }));
};

const mapOrderToCustomerItem = (order) => {
  const total = order.totalAmount / 100;
  const subtotal = order.subtotal ? order.subtotal / 100 : total;
  const tax = order.taxAmount ? order.taxAmount / 100 : 0;
  const shipping = order.shippingAmount ? order.shippingAmount / 100 : 0;
  const discount = order.discountAmount ? order.discountAmount / 100 : 0;

  return {
    id: order.orderNumber,
    orderDbId: order.id,
    placedAt: formatOrderDate(order.createdAt),
    createdAt: order.createdAt,
    items: mapOrderProducts(order.items),
    amount: total,
    totalAmount: total,
    totals: {
      subtotal,
      shipping,
      tax,
      discount,
      total
    },
    subtotal,
    taxAmount: tax,
    shippingAmount: shipping,
    discountAmount: discount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status.toLowerCase(),
    displayStatus: order.status,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    shipping: {
      recipient: order.shipping?.recipient || order.shippingAddress?.recipientName || "",
      address: order.shipping?.address || [
        order.shippingAddress?.line1,
        order.shippingAddress?.line2,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.country
      ].filter(Boolean).join(", "),
      carrier: order.shipping?.carrier || "Not yet assigned",
      trackingNumber: order.shipping?.trackingNumber || null
    },
    timeline: mapTimeline(order.timeline),
    cancellationReason: order.cancellationReason
  };
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await findOrdersByCustomerId(req.user.id);
    const items = orders.map(mapOrderToCustomerItem);
    return sendSuccess({
      res,
      message: "Orders fetched successfully.",
      data: { items }
    });
  } catch (error) {
    return next(error);
  }
};

const getCustomerOrderById = async (req, res, next) => {
  try {
    const order = await findAdminOrderById(req.params.id);
    
    if (!order) {
      throw new NotFoundError("Order not found.");
    }
    
    // Verify order belongs to this customer
    if (order.customer._id.toString() !== req.user.id) {
      throw new NotFoundError("Order not found.");
    }
    
    return sendSuccess({
      res,
      message: "Order fetched successfully.",
      data: mapOrderToCustomerItem(order)
    });
  } catch (error) {
    return next(error);
  }
};

export { getCustomerOrders, getCustomerOrderById };