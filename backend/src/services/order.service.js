import { countAdminOrders, findAdminOrderById, findAdminOrders, updateAdminOrderById } from "../repositories/admin-order.repository.js";
import { updateCustomerById, findCustomerById } from "../repositories/customer.repository.js";
import { updateProductById, findProductById } from "../repositories/product.repository.js";
import { buildPaginationMeta } from "../utils/pagination.js";
import { BusinessRuleError, NotFoundError } from "../shared/app-error.js";

const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered"
};

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
    id: `${index + 1}`,
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
    active: entry.active
  }));
};

const mapOrderToAdminItem = (order) => {
  const customer = order.customer || {};

  return {
    id: order.orderNumber,
    orderDbId: order.id,
    placedAt: formatOrderDate(order.createdAt),
    customer: {
      name: customer.name || "Unknown Customer",
      email: customer.email || "",
      avatar: customer.avatarUrl || ""
    },
    products: mapOrderProducts(order.items),
    amount: order.totalAmount / 100,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
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

  if (status !== "All") {
    filter.status = status;
  }

  if (paymentStatus !== "All") {
    filter.paymentStatus = paymentStatus;
  }

  const skip = (page - 1) * perPage;
  const [orders, totalItems] = await Promise.all([
    findAdminOrders({ filter, skip, limit: perPage }),
    countAdminOrders(filter)
  ]);

  let items = orders.map(mapOrderToAdminItem);

  if (search) {
    const query = search.toLowerCase();
    items = items.filter((order) =>
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.products.some((product) => product.sku.toLowerCase().includes(query))
    );
  }

  return {
    items,
    meta: buildPaginationMeta({ page, perPage, totalItems: items.length || totalItems })
  };
};

const getAdminOrderDetails = async (id) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  return mapOrderToAdminItem(order);
};

const appendTimelineEntry = (order, entry) => {
  const normalized = (order.timeline || []).map((item) => ({
    ...(item.toObject?.() || item),
    active: false
  }));

  normalized.push({
    title: entry.title,
    note: entry.note,
    done: true,
    active: true
  });

  return normalized;
};

const transitionOrderStatus = async ({ id, nextStatus, note = "", shipping }) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (NEXT_STATUS[order.status] !== nextStatus) {
    throw new BusinessRuleError({ message: "Invalid order status transition." });
  }

  const update = {
    status: nextStatus,
    timeline: appendTimelineEntry(order, {
      title: nextStatus,
      note
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
      trackingNumber: shipping.trackingNumber
    };
  }

  if (nextStatus === "Delivered") {
    update.deliveredAt = new Date();

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
const packAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Packed", note: "Order packed and ready for shipping." });
const shipAdminOrder = async (id, payload) => transitionOrderStatus({
  id,
  nextStatus: "Shipped",
  note: `Carrier: ${payload.courier} (Tracking: ${payload.trackingNumber})`,
  shipping: payload
});
const outForDeliveryAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Out for Delivery", note: "Order is out for delivery." });
const deliverAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Delivered", note: "Order delivered successfully." });

const cancelAdminOrder = async (id, reason) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.status !== "Pending") {
    throw new BusinessRuleError({ message: "Only pending orders can be cancelled." });
  }

  const updated = await updateAdminOrderById(id, {
    status: "Cancelled",
    cancellationReason: reason,
    paymentStatus: order.paymentStatus === "Paid" ? "Refund Processing" : order.paymentStatus,
    timeline: appendTimelineEntry(order, {
      title: "Order Cancelled",
      note: `Reason: ${reason}`
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
  packAdminOrder,
  shipAdminOrder,
  outForDeliveryAdminOrder,
  deliverAdminOrder,
  cancelAdminOrder,
  getOrderStats
};
