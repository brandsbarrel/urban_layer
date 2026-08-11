import {
  findAdminByEmailWithPassword,
  findAdminById,
  updateAdminById,
  createAdmin
} from "../repositories/admin.repository.js";
import { AuthenticationError, AuthorizationError } from "../shared/app-error.js";
import { comparePassword } from "../utils/password.js";
import { issueAuthTokens } from "./auth-token.service.js";

const buildAdminAuthPayload = async (admin) => {
  const tokens = await issueAuthTokens({ user: admin, realm: "admin" });

  return {
    accessToken: tokens.accessToken,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatarUrl: admin.avatarUrl || null
    }
  };
};

const loginAdmin = async ({ email, password, ip, userAgent }) => {
  const admin = await findAdminByEmailWithPassword(email);

  if (!admin) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (!admin.isActive) {
    throw new AuthorizationError("This admin account is inactive.");
  }

  admin.lastLoginAt = new Date();
  admin.loginHistory = [
    { ip, userAgent, at: new Date() },
    ...(admin.loginHistory || [])
  ].slice(0, 20);

  await admin.save();

  return buildAdminAuthPayload(admin);
};

const logoutAdmin = () => {
  return true;
};

const registerAdmin = async ({ name, email, passwordHash, role }) => {
  return createAdmin({
    name,
    email,
    passwordHash,
    role
  });
};

export {
  loginAdmin,
  logoutAdmin,
  registerAdmin
};
