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
    productId: item.productId?._id ? item.productId._id.toString() : item.productId?.toString(),
    name: item.name,
    sku: item.sku,
    variant: item.variantLabel || item.variantId || "",
    variantId: item.variantId || null,
    price: (item.unitPrice || 0) / 100,
    unitPrice: (item.unitPrice || 0) / 100,
    lineTotal: (item.lineTotal || 0) / 100,
    qty: item.quantity,
    quantity: item.quantity,
    image: item.image
  }));
};

const mapTimeline = (timeline = []) => {
  return timeline.map((entry) => {
    const eventTime = entry.createdAt || entry.timestamp || entry.updatedAt || new Date();
    return {
      id: entry._id?.toString?.() || `${entry.title}-${eventTime}`,
      title: entry.title,
      date: formatOrderDate(eventTime),
      createdAt: eventTime,
      timestamp: eventTime,
      note: entry.note || "",
      done: entry.done !== undefined ? entry.done : true,
      active: entry.active || false,
      source: entry.source || "order",
      actor: entry.actor || "system",
      metadata: entry.metadata || {}
    };
  });
};

const mapOrderToAdminItem = (order) => {
  const customer = order.customer || {};
  const total = (order.totalAmount || 0) / 100;
  const subtotal = order.subtotal ? order.subtotal / 100 : total;
  const tax = order.taxAmount ? order.taxAmount / 100 : 0;
  const shipping = order.shippingAmount ? order.shippingAmount / 100 : 0;
  const discount = order.discountAmount ? order.discountAmount / 100 : 0;

  const rawShipping = order.shipping || {};
  const returnReq = order.returnRequest || null;
  const refundObj = order.refund || null;
  const returnShipment = order.returnShipment || null;

  return {
    id: order.orderNumber,
    orderDbId: order.id || order._id?.toString(),
    placedAt: formatOrderDate(order.createdAt),
    createdAt: order.createdAt,
    customer: {
      id: customer.id || customer._id?.toString() || "",
      name: customer.name || order.shippingAddress?.recipientName || "Unknown Customer",
      email: customer.email || order.shippingAddress?.email || "",
      phone: customer.phone || order.shippingAddress?.phone || order.billingAddress?.phone || "",
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
    paymentGatewayOrderId: order.paymentGatewayOrderId || null,
    paymentGatewayPaymentId: order.paymentGatewayPaymentId || null,
    paymentGatewaySignature: order.paymentGatewaySignature || null,
    status: order.status,
    shippingStatus: order.shippingStatus || "Label Created",
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    shipping: {
      recipient: rawShipping.recipient || order.shippingAddress?.recipientName || "",
      address: rawShipping.address || [
        order.shippingAddress?.line1,
        order.shippingAddress?.line2,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.country
      ].filter(Boolean).join(", "),
      carrier: rawShipping.carrier || "Not yet assigned",
      courierName: rawShipping.courierName || rawShipping.carrier || null,
      trackingNumber: rawShipping.trackingNumber || rawShipping.awb || null,
      awb: rawShipping.awb || rawShipping.shiprocketAwbCode || null,
      shiprocketOrderId: rawShipping.shiprocketOrderId || null,
      shiprocketShipmentId: rawShipping.shiprocketShipmentId || null,
      shiprocketReferenceOrderId: rawShipping.shiprocketReferenceOrderId || order.orderNumber,
      shiprocketAwbCode: rawShipping.shiprocketAwbCode || rawShipping.awb || null,
      shiprocketTrackingUrl: rawShipping.shiprocketTrackingUrl || rawShipping.trackingUrl || null,
      currentStatus: rawShipping.currentStatus || null,
      currentStatusId: rawShipping.currentStatusId || null,
      shipmentStatus: rawShipping.shipmentStatus || null,
      shipmentStatusId: rawShipping.shipmentStatusId || null,
      awbAssignedDate: rawShipping.awbAssignedDate || null,
      pickupScheduledDate: rawShipping.pickupScheduledDate || null,
      pickupDate: rawShipping.pickupDate || null,
      estimatedDeliveryDate: rawShipping.estimatedDeliveryDate || null,
      actualDeliveryDate: rawShipping.actualDeliveryDate || null,
      podStatus: rawShipping.podStatus || null,
      pod: rawShipping.pod || null,
      qcImage: rawShipping.qcImage || null,
      qcFailureReason: rawShipping.qcFailureReason || null,
      labelUrl: rawShipping.labelUrl || null,
      invoiceUrl: rawShipping.invoiceUrl || null
    },
    trackingEvents: (order.trackingEvents || []).map((e) => ({
      eventKey: e.eventKey,
      status: e.status,
      statusLabel: e.statusLabel,
      activity: e.activity,
      location: e.location,
      providerStatusCode: e.providerStatusCode,
      occurredAt: e.occurredAt
    })),
    returnRequest: returnReq ? {
      status: returnReq.status,
      reason: returnReq.reason,
      rejectionReason: returnReq.rejectionReason,
      requestedAt: returnReq.requestedAt,
      approvedAt: returnReq.approvedAt,
      items: returnReq.items || []
    } : null,
    refund: refundObj ? {
      amount: (refundObj.amount || 0) / 100,
      reason: refundObj.reason,
      status: refundObj.status,
      method: refundObj.method,
      processedAt: refundObj.processedAt,
      razorpayRefundId: refundObj.razorpayRefundId
    } : null,
    returnShipment: returnShipment ? {
      shiprocketOrderId: returnShipment.shiprocketOrderId,
      awb: returnShipment.awb,
      courierName: returnShipment.courierName,
      currentStatus: returnShipment.currentStatus,
      shipmentStatus: returnShipment.shipmentStatus,
      podStatus: returnShipment.podStatus,
      updatedAt: returnShipment.updatedAt
    } : null,
    returnTrackingEvents: (order.returnTrackingEvents || []).map((e) => ({
      eventKey: e.eventKey,
      status: e.status,
      statusLabel: e.statusLabel,
      activity: e.activity,
      location: e.location,
      providerStatusCode: e.providerStatusCode,
      occurredAt: e.occurredAt
    })),
    timeline: mapTimeline(order.timeline),
    cancellationReason: order.cancellationReason || null
  };
};

const listAdminOrders = async ({
  page = 1,
  perPage = 20,
  search = "",
  status = "All",
  paymentStatus = "All",
  paymentMethod = "All",
  shippingStatus = "All",
  startDate,
  endDate,
  sortBy = "createdAt",
  sortOrder = "desc"
}) => {
  const filter = {};

  if (status && status !== "All") {
    filter.status = status;
  }

  if (paymentStatus && paymentStatus !== "All") {
    filter.paymentStatus = paymentStatus;
  }

  if (paymentMethod && paymentMethod !== "All") {
    filter.paymentMethod = paymentMethod;
  }

  if (shippingStatus && shippingStatus !== "All") {
    filter.shippingStatus = shippingStatus;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  if (search && search.trim()) {
    const query = search.trim();
    const regex = new RegExp(query, "i");
    const matchingCustomers = await CustomerModel.find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }]
    }).select("_id");
    const customerIds = matchingCustomers.map((c) => c._id);

    filter.$or = [
      { orderNumber: regex },
      { customer: { $in: customerIds } },
      { "items.sku": regex },
      { "items.name": regex },
      { "shipping.awb": regex },
      { "shipping.shiprocketOrderId": regex },
      { "shippingAddress.recipientName": regex },
      { "shippingAddress.phone": regex }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(perPage, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const [orders, totalItems] = await Promise.all([
    findAdminOrders({ filter, skip, limit: limitNum, sort }),
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
  const existingTimeline = (order.timeline || []).map((entry) => {
    const raw = entry.toObject ? entry.toObject() : entry;
    const entryTime = raw.createdAt || raw.timestamp || (order.createdAt ? new Date(order.createdAt) : new Date());
    return {
      ...raw,
      createdAt: entryTime,
      updatedAt: raw.updatedAt || entryTime,
      timestamp: raw.timestamp || entryTime,
      active: false
    };
  });

  const now = new Date();
  const entry = createTimelineEntry({
    title,
    note,
    source,
    actor,
    actorId,
    actorModel,
    metadata,
    createdAt: now,
    updatedAt: now,
    timestamp: now
  });
  entry.active = true;

  return [...existingTimeline, entry];
};

const transitionOrderStatus = async ({ id, nextStatus, note, actor = "admin", actorId = null }) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  // Validate the transition using centralized validation
  validateTransition(order.status, nextStatus, "order", "Order");

  const update = {
    status: nextStatus,
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

  const updated = await updateAdminOrderById(id, update);
  return mapOrderToAdminItem(updated);
};

const confirmAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Confirmed", note: "Order confirmed by admin." });
const processAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Processing", note: "Order processing started." });
const packAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Packed", note: "Order packed and ready for carrier pickup." });
const shipAdminOrder = async (id, payload = {}) => transitionOrderStatus({
  id,
  nextStatus: "Shipped",
  note: payload.courier ? `Carrier: ${payload.courier} (Tracking: ${payload.trackingNumber || "N/A"})` : "Order shipped.",
  shipping: payload
});
const outForDeliveryAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Out for Delivery", note: "Order out for delivery." });
const deliverAdminOrder = async (id) => transitionOrderStatus({ id, nextStatus: "Delivered", note: "Order delivered." });

const cancelAdminOrder = async (id, reason, actor = "admin", actorId = null) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  // Cancellation allowed on Pending, or Confirmed prior to carrier dispatch
  if (!["Pending", "Confirmed"].includes(order.status)) {
    throw new BusinessRuleError({ message: `Cannot cancel order in ${order.status} status. Only Pending or unfulfilled Confirmed orders can be cancelled.` });
  }

  // If order was already paid or COD with stock reserved, restore reserved inventory
  for (const item of order.items || []) {
    const productId = item.productId?._id ? item.productId._id.toString() : item.productId?.toString();
    if (productId) {
      const product = await findProductById(productId);
      if (product) {
        await updateProductById(product.id, {
          stock: (product.stock || 0) + item.quantity,
          reservedStock: Math.max((product.reservedStock || 0) - item.quantity, 0),
          unfulfilledOrders: Math.max((product.unfulfilledOrders || 0) - item.quantity, 0)
        });
      }
    }
  }

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

const approveAdminReturn = async (id, actor = "admin", actorId = null) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.status !== "Return Requested") {
    throw new BusinessRuleError({ message: "Only orders with 'Return Requested' status can be approved for return." });
  }

  const now = new Date();
  const updated = await updateAdminOrderById(id, {
    status: "Return Approved",
    "returnRequest.status": "Approved",
    "returnRequest.approvedAt": now,
    timeline: appendTimelineEntry(order, {
      title: "Return Approved",
      note: "Return request approved by admin. Reverse pickup scheduled.",
      source: "return",
      actor,
      actorId,
      actorModel: "Admin",
      metadata: { previousStatus: order.status }
    })
  });

  return mapOrderToAdminItem(updated);
};

const rejectAdminReturn = async (id, reason, actor = "admin", actorId = null) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.status !== "Return Requested") {
    throw new BusinessRuleError({ message: "Only orders with 'Return Requested' status can be rejected." });
  }

  const updated = await updateAdminOrderById(id, {
    status: "Return Rejected",
    "returnRequest.status": "Rejected",
    "returnRequest.rejectionReason": reason,
    timeline: appendTimelineEntry(order, {
      title: "Return Rejected",
      note: `Return request rejected. Reason: ${reason}`,
      source: "return",
      actor,
      actorId,
      actorModel: "Admin",
      metadata: { previousStatus: order.status, reason }
    })
  });

  return mapOrderToAdminItem(updated);
};

const processAdminRefund = async (id, { amount, reason = "Admin refund processed", method = "Original Payment Method" }, actor = "admin", actorId = null) => {
  const order = await findAdminOrderById(id);

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  const refundAmount = amount ? Math.round(amount * 100) : order.totalAmount;
  const isPartial = refundAmount < order.totalAmount;
  const nextPaymentStatus = isPartial ? "Partially Refunded" : "Refunded";
  const now = new Date();

  const updated = await updateAdminOrderById(id, {
    paymentStatus: nextPaymentStatus,
    status: order.status === "Received" || order.status === "Returned" ? "Refunded" : order.status,
    refund: {
      amount: refundAmount,
      reason,
      status: "Completed",
      processedAt: now,
      method,
      razorpayRefundId: `ref_admin_${Date.now()}`
    },
    timeline: appendTimelineEntry(order, {
      title: "Refund Completed",
      note: `Refund of ₹${(refundAmount / 100).toLocaleString('en-IN')} processed successfully. (${method})`,
      source: "refund",
      actor,
      actorId,
      actorModel: "Admin",
      metadata: { refundAmount, method, reason }
    })
  });

  return mapOrderToAdminItem(updated);
};

const getOrderStats = async () => {
  const orders = await findAdminOrders({ limit: 5000 });
  const total = orders.length;
  const pending = orders.filter((order) => order.status === "Pending").length;
  const shipped = orders.filter((order) => ["Shipped", "Out for Delivery"].includes(order.status) || ["In Transit", "Out for Delivery"].includes(order.shippingStatus)).length;
  const delivered = orders.filter((order) => order.status === "Delivered" || order.shippingStatus === "Delivered").length;

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
  approveAdminReturn,
  rejectAdminReturn,
  processAdminRefund,
  getOrderStats
};
