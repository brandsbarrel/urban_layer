import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import { ACCESS_TOKEN_TTL } from "../constants/index.js";

const getRealmConfig = (realm) => {
  if (realm === "admin") {
    return {
      accessSecret: env.ADMIN_JWT_ACCESS_SECRET
    };
  }

  return {
    accessSecret: env.CUSTOMER_JWT_ACCESS_SECRET
  };
};

const signAccessToken = ({ sub, role, tokenVersion, realm }) => {
  const jti = crypto.randomUUID();
  const { accessSecret } = getRealmConfig(realm);

  return {
    token: jwt.sign({ sub, role, tokenVersion, realm }, accessSecret, {
      expiresIn: ACCESS_TOKEN_TTL,
      jwtid: jti
    }),
    jti
  };
};

const verifyAccessToken = (token, realm) => {
  const { accessSecret } = getRealmConfig(realm);
  return jwt.verify(token, accessSecret);
};

const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

export {
  getRealmConfig,
  signAccessToken,
  verifyAccessToken,
  decodeToken
};
