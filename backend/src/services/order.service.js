import { countAdminOrders, findAdminOrderById, findAdminOrders, updateAdminOrderById } from "../repositories/admin-order.repository.js";
import { updateCustomerById, findCustomerById } from "../repositories/customer.repository.js";
import { updateProductById, findProductById } from "../repositories/product.repository.js";
import { CustomerModel } from "../models/index.js";
import { buildPaginationMeta } from "../utils/pagination.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";
import { validateTransition, createTimelineEntry, getTimelineSource, getTimelineActor } from "../utils/statusTransition.js";



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
    price: item.unitPrice / 100,
    qty: item.quantity,
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

const mapOrderToAdminItem = (order) => {
  const customer = order.customer || {};
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
    customer: {
      name: customer.name || order.shippingAddress?.recipientName || "Unknown Customer",
      email: customer.email || "",
      avatar: customer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
    },
    products: mapOrderProducts(order.items),
    amount: total,
    totalAmount: total,
    subtotal,
    taxAmount: tax,
    shippingAmount: shipping,
    discountAmount: discount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
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

const listAdminOrders = async ({ page = 1, perPage = 20, search = "", status = "All", paymentStatus = "All" }) => {
  const filter = {};

  if (status && status !== "All") {
    filter.status = status;
  }

  if (paymentStatus && paymentStatus !== "All") {
    filter.paymentStatus = paymentStatus;
  }

  if (search && search.trim()) {
    const query = search.trim();
    const regex = new RegExp(query, "i");
    const matchingCustomers = await CustomerModel.find({
      $or: [{ name: regex }, { email: regex }]
    }).select("_id");
    const customerIds = matchingCustomers.map((c) => c._id);

    filter.$or = [
      { orderNumber: regex },
      { customer: { $in: customerIds } },
      { "items.sku": regex },
      { "items.name": regex }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(perPage, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [orders, totalItems] = await Promise.all([
    findAdminOrders({ filter, skip, limit: limitNum }),
    countAdminOrders(filter)
  ]);

  const items = orders.map(mapOrderToAdminItem);

  return {
    items,
    meta: buildPaginationMeta({ page: pageNum, perPage: limitNum, totalItems })
  };
};

const getAdminOrderDetails = async (id) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  return mapOrderToAdminItem(order);
};

const appendTimelineEntry = (order, { title, note = "", source = "order", actor = "system", actorId = null, actorModel = null, metadata = {} }) => {
  const entry = createTimelineEntry({ title, note, source, actor, actorId, actorModel, metadata });
  return [...(order.timeline || []), entry];
};

const transitionOrderStatus = async ({ id, nextStatus, note, shipping, actor = "admin", actorId = null }) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  // Validate the transition using centralized validation
  validateTransition(order.status, nextStatus, "order", "Order");

  // Determine shipping status based on order status
  let shippingStatus = order.shippingStatus;
  if (nextStatus === "Shipped") {
    shippingStatus = "Label Created";
  } else if (nextStatus === "Out for Delivery") {
    shippingStatus = "Out for Delivery";
  } else if (nextStatus === "Delivered") {
    shippingStatus = "Delivered";
  } else if (nextStatus === "Cancelled") {
    shippingStatus = "Cancelled";
  }

  const update = {
    status: nextStatus,
    shippingStatus,
    timeline: appendTimelineEntry(order, {
      title: nextStatus,
      note,
      source: "order",
      actor,
      actorId,
      actorModel: actor === "admin" ? "Admin" : "Customer",
      metadata: { previousStatus: order.status }
    })
  };

  if (shipping) {
    update.shipping = {
      recipient: order.shipping?.recipient || order.shippingAddress?.recipientName || "",
      address: order.shipping?.address || [
        order.shippingAddress?.line1,
        order.shippingAddress?.line2,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.country
      ].filter(Boolean).join(", "),
      carrier: `${shipping.courier} (${shipping.shippingMethod})`,
      trackingNumber: shipping.trackingNumber,
      shiprocketShipmentId: shipping.shiprocketShipmentId || null,
      shiprocketAwbCode: shipping.shiprocketAwbCode || null,
      shiprocketTrackingUrl: shipping.shiprocketTrackingUrl || null,
      labelUrl: shipping.labelUrl || null,
      invoiceUrl: shipping.invoiceUrl || null,
      pickupDate: shipping.pickupDate || null,
      estimatedDeliveryDate: shipping.estimatedDeliveryDate || null
    };
  }

  if (nextStatus === "Delivered") {
    update.deliveredAt = new Date();
    // Ensure shipping object exists
    if (!update.shipping) {
      update.shipping = {
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
      };
    }
    update.shipping.actualDeliveryDate = new Date();

    const customer = await findCustomerById(order.customer._id.toString());
    if (customer) {
      await updateCustomerById(customer.id, {
        totalOrders: customer.totalOrders + 1,
        lifetimeSpend: customer.lifetimeSpend + order.totalAmount
      });
    }

    for (const item of order.items) {
      const product = await findProductById(item.productId.toString());
      if (product) {
        await updateProductById(product.id, {
          reservedStock: Math.max((product.reservedStock || 0) - item.quantity, 0),
          unfulfilledOrders: Math.max((product.unfulfilledOrders || 0) - item.quantity, 0)
        });
      }
    }
  }

  const updated = await updateAdminOrderById(id, update);
  return mapOrderToAdminItem(updated);
};

const confirmAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Confirmed", note: "Order confirmed by admin." });
const processAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Processing", note: "Order processing started." });
const packAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Packed", note: "Order packed and ready for shipping." });
const shipAdminOrder = async (id, payload) => transitionOrderStatus({
  id,
  nextStatus: "Shipped",
  note: `Carrier: ${payload.courier} (Tracking: ${payload.trackingNumber})`,
  shipping: payload
});
const outForDeliveryAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Out for Delivery", note: "Order is out for delivery." });
const deliverAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Delivered", note: "Order delivered successfully." });

const cancelAdminOrder = async (id, reason, actor = "admin", actorId = null) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.status !== "Pending") {
    throw new BusinessRuleError({ message: "Only pending orders can be cancelled." });
  }

  // Validate transition
  validateTransition(order.status, "Cancelled", "order", "Order");

  const updated = await updateAdminOrderById(id, {
    status: "Cancelled",
    shippingStatus: "Cancelled",
    cancellationReason: reason,
    paymentStatus: order.paymentStatus === "Paid" ? "Refund Processing" : order.paymentStatus,
    timeline: appendTimelineEntry(order, {
      title: "Order Cancelled",
      note: `Reason: ${reason}`,
      source: "order",
      actor,
      actorId,
      actorModel: actor === "admin" ? "Admin" : "Customer",
      metadata: { previousStatus: order.status }
    })
  });

  return mapOrderToAdminItem(updated);
};

const getOrderStats = async () => {
  const orders = await findAdminOrders({ limit: 5000 });
  const total = orders.length;
  const pending = orders.filter((order) => order.status === "Pending").length;
  const shipped = orders.filter((order) => ["Shipped", "Out for Delivery"].includes(order.status)).length;
  const delivered = orders.filter((order) => order.status === "Delivered").length;

  return [
    { id: "total", label: "Total Orders", value: total, change: "0%", icon: "shopping_bag", tone: "primary" },
    { id: "pending", label: "Pending", value: pending, note: `${pending} awaiting action`, tone: "amber" },
    { id: "shipped", label: "Shipped", value: shipped, note: "In transit orders", tone: "blue" },
    { id: "delivered", label: "Delivered", value: delivered, note: "Completed orders", tone: "green" }
  ];
};

export {
  listAdminOrders,
  getAdminOrderDetails,
  confirmAdminOrder,
  processAdminOrder,
  packAdminOrder,
  shipAdminOrder,
  outForDeliveryAdminOrder,
  deliverAdminOrder,
  cancelAdminOrder,
  getOrderStats
};
