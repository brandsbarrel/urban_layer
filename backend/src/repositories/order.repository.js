import { findOrdersByCustomerId as findCustomerOrders } from "./checkout.repository.js";

const findOrdersByCustomerId = (customerId) => {
  return findCustomerOrders(customerId);
};

export { findOrdersByCustomerId };
