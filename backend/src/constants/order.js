const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
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

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refund Processing", "Refunded"];
const PAYMENT_METHODS = ["Card", "UPI", "Netbanking", "COD"];

export { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS };
