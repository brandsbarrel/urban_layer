import {
  createCustomer,
  findCustomerByEmailWithPassword,
  findCustomerById
} from "../repositories/customer.repository.js";
import { AuthenticationError, AuthorizationError, ConflictError } from "../shared/app-error.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { issueAuthTokens } from "./auth-token.service.js";

const buildCustomerAuthPayload = async (customer) => {
  const tokens = await issueAuthTokens({ user: customer, realm: "customer" });

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

const loginCustomer = async ({ email, password }) => {
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

  return buildCustomerAuthPayload(customer);
};

const logoutCustomer = () => {
  return true;
};

export {
  registerCustomer,
  loginCustomer,
  logoutCustomer
};
