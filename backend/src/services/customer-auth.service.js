import {
  createCustomer,
  findCustomerByEmailWithPassword,
  findCustomerById
} from "../repositories/customer.repository.js";
import { AuthenticationError, AuthorizationError, ConflictError } from "../shared/app-error.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  clearRefreshCookie,
  issueAuthTokens,
  rotateRefreshToken,
  setRefreshCookie
} from "./auth-token.service.js";

const buildCustomerAuthPayload = async (customer, res) => {
  const tokens = await issueAuthTokens({ user: customer, realm: "customer" });
  setRefreshCookie(res, "customer", tokens.refreshToken);

  return {
    accessToken: tokens.accessToken,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
      tier: customer.tier || null,
      avatarUrl: customer.avatarUrl || null
    }
  };
};

const registerCustomer = async ({ name, email, password }) => {
  const existingCustomer = await findCustomerByEmailWithPassword(email);

  if (existingCustomer) {
    throw new ConflictError({ message: "An account with this email already exists." });
  }

  const passwordHash = await hashPassword(password);

  return createCustomer({
    name,
    email,
    passwordHash,
    status: "Active"
  });
};

const loginCustomer = async ({ email, password, res }) => {
  const customer = await findCustomerByEmailWithPassword(email);

  if (!customer) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, customer.passwordHash);

  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (customer.status === "Deactivated") {
    throw new AuthorizationError("This customer account is inactive.");
  }

  customer.lastLoginAt = new Date();
  await customer.save();

  return buildCustomerAuthPayload(customer, res);
};

const refreshCustomerSession = async ({ refreshToken, res }) => {
  const payload = await rotateRefreshToken({ refreshToken, realm: "customer" });
  const customer = await findCustomerById(payload.sub);

  if (!customer || customer.status === "Deactivated" || customer.tokenVersion !== payload.tokenVersion) {
    throw new AuthenticationError("Invalid refresh token.");
  }

  return buildCustomerAuthPayload(customer, res);
};

const logoutCustomer = (res) => {
  clearRefreshCookie(res, "customer");
};

export {
  registerCustomer,
  loginCustomer,
  refreshCustomerSession,
  logoutCustomer
};
