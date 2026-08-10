import {
  findAdminByEmailWithPassword,
  findAdminById,
  updateAdminById,
  createAdmin
} from "../repositories/admin.repository.js";
import { AuthenticationError, AuthorizationError } from "../shared/app-error.js";
import { comparePassword } from "../utils/password.js";
import {
  clearRefreshCookie,
  issueAuthTokens,
  rotateRefreshToken,
  setRefreshCookie
} from "./auth-token.service.js";

const buildAdminAuthPayload = async (admin, res) => {
  const tokens = await issueAuthTokens({ user: admin, realm: "admin" });
  setRefreshCookie(res, "admin", tokens.refreshToken);

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

const loginAdmin = async ({ email, password, ip, userAgent, res }) => {
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

  return buildAdminAuthPayload(admin, res);
};

const refreshAdminSession = async ({ refreshToken, res }) => {
  const payload = await rotateRefreshToken({ refreshToken, realm: "admin" });
  const admin = await findAdminById(payload.sub);

  if (!admin || !admin.isActive || admin.tokenVersion !== payload.tokenVersion) {
    throw new AuthenticationError("Invalid refresh token.");
  }

  return buildAdminAuthPayload(admin, res);
};

const logoutAdmin = (res) => {
  clearRefreshCookie(res, "admin");
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
  refreshAdminSession,
  logoutAdmin,
  registerAdmin
};
