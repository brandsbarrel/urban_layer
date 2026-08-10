import { findAdminById } from "../repositories/admin.repository.js";
import { findCustomerById } from "../repositories/customer.repository.js";
import { AuthenticationError } from "../shared/app-error.js";
import { isAccessTokenRevoked } from "../services/auth-token.service.js";
import { verifyAccessToken } from "../utils/token.js";

const extractBearerToken = (req) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AuthenticationError("Authentication required.");
  }

  return header.replace("Bearer ", "").trim();
};

const authenticate = (realm) => {
  return async (req, res, next) => {
    try {
      const token = extractBearerToken(req);
      const payload = verifyAccessToken(token, realm);

      if (payload.realm !== realm) {
        throw new AuthenticationError("Invalid access token realm.");
      }

      const isRevoked = await isAccessTokenRevoked(payload.jti);

      if (isRevoked) {
        throw new AuthenticationError("Access token has been revoked.");
      }

      const user = realm === "admin"
        ? await findAdminById(payload.sub)
        : await findCustomerById(payload.sub);

      if (!user) {
        throw new AuthenticationError("Authenticated user not found.");
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        throw new AuthenticationError("Access token is no longer valid.");
      }

      req.user = {
        id: user.id,
        role: user.role || "Customer",
        realm,
        tokenVersion: user.tokenVersion
      };

      return next();
    } catch (error) {
      return next(new AuthenticationError("Authentication required."));
    }
  };
};

export { authenticate };
