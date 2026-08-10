import { redisClient } from "../database/redis.js";
import { AuthenticationError } from "../shared/app-error.js";
import {
  decodeToken,
  getRealmConfig,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/token.js";

const getRefreshSessionKey = (realm, jti) => {
  return `${realm}:refresh-session:${jti}`;
};

const getAccessBlocklistKey = (jti) => {
  return `auth:blocked-access:${jti}`;
};

const buildCookieOptions = () => {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/"
  };
};

const issueAuthTokens = async ({ user, realm }) => {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
    realm
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
    realm
  });

  await redisClient.set(
    getRefreshSessionKey(realm, refreshToken.jti),
    user.id,
    {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 7
      }
    }
  );

  return {
    accessToken: accessToken.token,
    accessTokenJti: accessToken.jti,
    refreshToken: refreshToken.token,
    refreshTokenJti: refreshToken.jti
  };
};

const rotateRefreshToken = async ({ refreshToken, realm }) => {
  const payload = verifyRefreshToken(refreshToken, realm);
  const sessionKey = getRefreshSessionKey(realm, payload.jti);
  const sessionExists = await redisClient.get(sessionKey);

  if (!sessionExists) {
    throw new AuthenticationError("Invalid refresh token.");
  }

  await redisClient.del(sessionKey);

  return payload;
};

const revokeAccessToken = async (accessToken) => {
  const decoded = decodeToken(accessToken);
  const jti = decoded?.payload?.jti;
  const expiresAt = decoded?.payload?.exp;

  if (!jti || !expiresAt) {
    return;
  }

  const ttlSeconds = Math.max(expiresAt - Math.floor(Date.now() / 1000), 1);

  await redisClient.set(getAccessBlocklistKey(jti), "1", {
    expiration: {
      type: "EX",
      value: ttlSeconds
    }
  });
};

const isAccessTokenRevoked = async (jti) => {
  const value = await redisClient.get(getAccessBlocklistKey(jti));
  return Boolean(value);
};

const setRefreshCookie = (res, realm, token) => {
  const { cookieName } = getRealmConfig(realm);
  res.cookie(cookieName, token, buildCookieOptions());
};

const clearRefreshCookie = (res, realm) => {
  const { cookieName } = getRealmConfig(realm);
  res.clearCookie(cookieName, buildCookieOptions());
};

export {
  issueAuthTokens,
  rotateRefreshToken,
  revokeAccessToken,
  isAccessTokenRevoked,
  setRefreshCookie,
  clearRefreshCookie
};
