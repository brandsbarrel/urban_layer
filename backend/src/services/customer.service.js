import { findOrdersByCustomerId } from "../repositories/order.repository.js";
import {
  createCustomer,
  findCustomerById,
  updateCustomerById
} from "../repositories/customer.repository.js";
import { countCustomers, deleteCustomerById, findCustomers, findCustomerByEmail } from "../repositories/customer-admin.repository.js";
import { BusinessRuleError, ConflictError, NotFoundError } from "../shared/app-error.js";
import { buildPaginationMeta } from "../utils/pagination.js";

const MAX_CUSTOMER_ADDRESSES = 3;

const formatCurrency = (amountMinor) => {
  return amountMinor / 100;
};

const formatRelativeLogin = (date) => {
  if (!date) {
    return "Never";
  }

  const diffMs = Date.now() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24) {
    return `${diffHours} Hours Ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

const formatCustomerSince = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

const buildRegion = (customer) => {
  const country = customer.addresses?.[0]?.country?.toLowerCase() || "";

  if (["united states", "usa", "canada", "mexico"].includes(country)) {
    return "North America";
  }

  if (["france", "uk", "united kingdom", "germany", "italy", "spain", "russia"].includes(country)) {
    return "Europe";
  }

  if (country) {
    return "Asia Pacific";
  }

  return "All";
};

const mapActivity = (customer) => {
  const items = [];

  if (customer.lastLoginAt) {
    items.push({
      id: `login-${customer.id}`,
      icon: "login",
      title: "Logged In",
      meta: `${formatRelativeLogin(customer.lastLoginAt)}`
    });
  }

  if (customer.totalOrders > 0) {
    items.push({
      id: `orders-${customer.id}`,
      icon: "shopping_bag",
      title: "Order History Active",
      meta: `${customer.totalOrders} total orders`
    });
  }

  if (customer.rewardPoints > 0) {
    items.push({
      id: `points-${customer.id}`,
      icon: "star",
      title: "Reward Points Available",
      meta: `${customer.rewardPoints.toLocaleString()} points`
    });
  }

  return items;
};

const mapCustomerToAdminListItem = (customer) => {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    avatar: customer.avatarUrl || "",
    totalOrders: customer.totalOrders,
    lifetimeSpend: formatCurrency(customer.lifetimeSpend),
    rewardPoints: customer.rewardPoints,
    status: customer.status,
    lastLogin: formatRelativeLogin(customer.lastLoginAt),
    region: buildRegion(customer),
    customerSince: formatCustomerSince(customer.createdAt),
    avgOrderValue: formatCurrency(customer.avgOrderValue || 0),
    returnRate: `${customer.returnRate}%`,
    tier: customer.tier || "",
    activity: mapActivity(customer)
  };
};

const mapCustomerToAdminDetail = async (customer) => {
  const orders = await findOrdersByCustomerId(customer.id);

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    avatar: customer.avatarUrl || "",
    totalOrders: customer.totalOrders,
    lifetimeSpend: formatCurrency(customer.lifetimeSpend),
    rewardPoints: customer.rewardPoints,
    status: customer.status,
    lastLogin: formatRelativeLogin(customer.lastLoginAt),
    customerSince: formatCustomerSince(customer.createdAt),
    avgOrderValue: formatCurrency(customer.avgOrderValue || 0),
    returnRate: `${customer.returnRate}%`,
    tier: customer.tier || "",
    activity: mapActivity(customer),
    addresses: customer.addresses,
    wishlist: customer.wishlist,
    orderHistorySummary: {
      total: orders.length
    }
  };
};

const listAdminCustomers = async ({ page = 1, perPage = 20, search = "", vipStatus = "All", region = "All" }) => {
  const filter = {};

  if (vipStatus !== "All") {
    filter.status = vipStatus;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * perPage;
  const [items, totalItems] = await Promise.all([
    findCustomers({ filter, skip, limit: perPage }),
    countCustomers(filter)
  ]);

  let mapped = items.map(mapCustomerToAdminListItem);

  if (region !== "All") {
    mapped = mapped.filter((item) => item.region === region);
  }

  return {
    items: mapped,
    meta: buildPaginationMeta({ page, perPage, totalItems: mapped.length || totalItems })
  };
};

const getAdminCustomerDetails = async (id) => {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  return mapCustomerToAdminDetail(customer);
};

const updateAdminCustomer = async (id, payload) => {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  if (payload.email && payload.email !== customer.email) {
    const existing = await findCustomerByEmail(payload.email);
    if (existing && existing.id !== id) {
      throw new ConflictError({ message: "Customer email already exists." });
    }
  }

  const normalizedPayload = { ...payload };

  if (payload.status === "Deactivated" && !customer.deactivatedAt) {
    normalizedPayload.deactivatedAt = new Date();
  }

  if (payload.status && payload.status !== "Deactivated") {
    normalizedPayload.deactivatedAt = null;
  }

  const updated = await updateCustomerById(id, normalizedPayload);
  return mapCustomerToAdminDetail(updated);
};

const deactivateAdminCustomer = async (id) => {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  const updated = await updateCustomerById(id, {
    status: "Deactivated",
    deactivatedAt: new Date(),
    tokenVersion: customer.tokenVersion + 1
  });

  return mapCustomerToAdminDetail(updated);
};

const bulkDeactivateAdminCustomers = async (ids) => {
  const updates = await Promise.all(ids.map((id) => deactivateAdminCustomer(id)));
  return updates;
};

const deleteAdminCustomer = async (id) => {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  await deleteCustomerById(id);
};

const getCustomerProfile = async (customerId) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    avatarUrl: customer.avatarUrl || "",
    status: customer.status,
    tier: customer.tier || "",
    rewardPoints: customer.rewardPoints,
    addresses: customer.addresses
  };
};

const updateCustomerProfile = async (customerId, payload) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  const updated = await updateCustomerById(customerId, payload);
  return getCustomerProfile(updated.id);
};

const addCustomerAddress = async (customerId, payload) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  if ((customer.addresses?.length || 0) >= MAX_CUSTOMER_ADDRESSES) {
    throw new BusinessRuleError({ message: `You can save a maximum of ${MAX_CUSTOMER_ADDRESSES} addresses.` });
  }

  const addresses = payload.isDefault
    ? customer.addresses.map((address) => ({ ...address.toObject(), isDefault: false }))
    : customer.addresses.map((address) => address.toObject());

  addresses.push(payload);

  const updated = await updateCustomerById(customerId, { addresses });
  return updated.addresses;
};

const updateCustomerAddress = async (customerId, addressIndex, payload) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  if (!customer.addresses[addressIndex]) {
    throw new NotFoundError("Address not found.");
  }

  const addresses = customer.addresses.map((address, index) => {
    const nextAddress = address.toObject();

    if (payload.isDefault && index !== addressIndex) {
      nextAddress.isDefault = false;
    }

    if (index === addressIndex) {
      return { ...nextAddress, ...payload };
    }

    return nextAddress;
  });

  const updated = await updateCustomerById(customerId, { addresses });
  return updated.addresses;
};

const deleteCustomerAddress = async (customerId, addressIndex) => {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  if (!customer.addresses[addressIndex]) {
    throw new NotFoundError("Address not found.");
  }

  const addresses = customer.addresses
    .filter((_, index) => index !== addressIndex)
    .map((address) => address.toObject());

  if (addresses.length > 0 && !addresses.some((address) => address.isDefault)) {
    addresses[0].isDefault = true;
  }

  const updated = await updateCustomerById(customerId, { addresses });
  return updated.addresses;
};

export {
  listAdminCustomers,
  getAdminCustomerDetails,
  updateAdminCustomer,
  deactivateAdminCustomer,
  bulkDeactivateAdminCustomers,
  deleteAdminCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
};
