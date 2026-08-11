import { signAccessToken } from "../utils/token.js";

const issueAuthTokens = async ({ user, realm }) => {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
    realm
  });

  return {
    accessToken: accessToken.token,
    accessTokenJti: accessToken.jti
  };
};

const isAccessTokenRevoked = async () => {
  return false;
};

export { issueAuthTokens, isAccessTokenRevoked };
