const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Return Requested",
  "Return Approved",
  "Return Pickup",
  "Returned",
  "Refund Processing",
  "Refunded",
  "Return Rejected"
];

const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
  "Refund Processing",
  "Refunded",
  "Partially Refunded",
  // COD specific
  "Collected",
  "Settled",
  "Collection Failed",
  "Settlement Failed"
];

const PAYMENT_METHODS = ["Online", "COD"];

// Shipping statuses (separate from order status)
const SHIPPING_STATUSES = [
  "Label Created",
  "Pickup Scheduled",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "RTO Initiated",
  "RTO Delivered",
  "Cancelled",
  "Exception"
];

// Return statuses
const RETURN_STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Picked Up",
  "Received",
  "Refund Processing",
  "Refunded",
  "Cancelled"
];

// Return reasons
const RETURN_REASONS = [
  "Wrong Item",
  "Damaged/Defective",
  "Size/Fit Issue",
  "Quality Issue",
  "Changed Mind",
  "Late Delivery",
  "Better Price Found",
  "Other"
];

// Refund statuses
const REFUND_STATUSES = [
  "Pending",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled"
];

// Refund methods
const REFUND_METHODS = [
  "Original Payment Method",
  "Bank Transfer",
  "Store Credit",
  "COD Cash Collection"
];

// Valid order status transitions
const VALID_ORDER_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Packed", "Cancelled"],
  Processing: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Return Requested"],
  "Out for Delivery": ["Delivered", "Return Requested"],
  Delivered: ["Return Requested"],
  Cancelled: [],
  "Return Requested": ["Return Approved", "Return Rejected"],
  "Return Approved": ["Return Pickup"],
  "Return Pickup": ["Picked Up"],
  "Picked Up": ["Received"],
  Received: ["Refund Processing"],
  "Refund Processing": ["Refunded"],
  Refunded: [],
  "Return Rejected": []
};

// Valid payment status transitions
const VALID_PAYMENT_TRANSITIONS = {
  Pending: ["Paid", "Failed", "Collected", "Collection Failed"],
  Paid: ["Refund Processing", "Partially Refunded"],
  Failed: ["Pending"], // Retry
  "Refund Processing": ["Refunded", "Partially Refunded"],
  Refunded: [],
  "Partially Refunded": ["Refund Processing", "Refunded"],
  // COD
  Collected: ["Settled", "Settlement Failed"],
  Settled: ["Refund Processing"],
  "Collection Failed": ["Pending"],
  "Settlement Failed": ["Collected"]
};

// Valid shipping status transitions
const VALID_SHIPPING_TRANSITIONS = {
  "Label Created": ["Pickup Scheduled", "Cancelled"],
  "Pickup Scheduled": ["Picked Up", "Cancelled"],
  "Picked Up": ["In Transit", "Exception"],
  "In Transit": ["Out for Delivery", "Exception", "RTO Initiated"],
  "Out for Delivery": ["Delivered", "Exception", "RTO Initiated"],
  Delivered: ["Return Requested"],
  "RTO Initiated": ["RTO Delivered"],
  "RTO Delivered": ["Return Requested"],
  Cancelled: [],
  Exception: ["In Transit", "RTO Initiated", "Cancelled"]
};

// Valid return status transitions
const VALID_RETURN_TRANSITIONS = {
  Requested: ["Approved", "Rejected", "Cancelled"],
  Approved: ["Pickup Scheduled"],
  Rejected: [],
  "Pickup Scheduled": ["Picked Up", "Cancelled"],
  "Picked Up": ["Received"],
  Received: ["Refund Processing"],
  "Refund Processing": ["Refunded"],
  Refunded: [],
  Cancelled: []
};

export {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  SHIPPING_STATUSES,
  RETURN_STATUSES,
  RETURN_REASONS,
  REFUND_STATUSES,
  REFUND_METHODS,
  VALID_ORDER_TRANSITIONS,
  VALID_PAYMENT_TRANSITIONS,
  VALID_SHIPPING_TRANSITIONS,
  VALID_RETURN_TRANSITIONS
};
